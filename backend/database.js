const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'pos.db');
const db = new sqlite3.Database(dbPath);

const run = (query, params = []) => new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve(this);
    });
});

const get = (query, params = []) => new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
    });
});

const all = (query, params = []) => new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});

module.exports = {
    init: async () => {
        await run(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`);
        await run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            category TEXT,
            unit TEXT,
            costPrice REAL,
            sellPrice REAL,
            qty REAL,
            reorderLevel REAL,
            createdAt INTEGER
        )`);
        await run(`CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT,
            address TEXT,
            nic TEXT,
            creditLimit REAL,
            balance REAL,
            createdAt INTEGER,
            customerType TEXT DEFAULT 'customer',
            discountPercent REAL DEFAULT 0
        )`);
        await run(`CREATE TABLE IF NOT EXISTS customer_ledger (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customerId INTEGER,
            date INTEGER,
            type TEXT,
            amount REAL,
            note TEXT,
            saleId INTEGER
        )`);
        await run(`CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date INTEGER,
            lines TEXT, -- JSON string
            subtotal REAL,
            discount REAL,
            total REAL,
            paymentType TEXT,
            customerId INTEGER,
            customerName TEXT,
            amountPaid REAL DEFAULT 0,
            changeAmount REAL DEFAULT 0
        )`);

        try { await run(`ALTER TABLE customers ADD COLUMN customerType TEXT DEFAULT 'customer'`); } catch(e) {}
        try { await run(`ALTER TABLE customers ADD COLUMN discountPercent REAL DEFAULT 0`); } catch(e) {}
        try { await run(`ALTER TABLE sales ADD COLUMN amountPaid REAL DEFAULT 0`); } catch(e) {}
        try { await run(`ALTER TABLE sales ADD COLUMN changeAmount REAL DEFAULT 0`); } catch(e) {}
        try { await run(`ALTER TABLE items ADD COLUMN description TEXT`); } catch(e) {}
        try { await run(`ALTER TABLE items ADD COLUMN image TEXT`); } catch(e) {}
        try { await run(`ALTER TABLE purchases ADD COLUMN image TEXT`); } catch(e) {}

        await run(`CREATE TABLE IF NOT EXISTS purchases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            supplierName TEXT,
            billNo TEXT,
            date INTEGER,
            items TEXT,
            subtotal REAL,
            discount REAL,
            totalAmount REAL,
            paidAmount REAL,
            dueAmount REAL,
            paymentStatus TEXT,
            note TEXT,
            image TEXT,
            createdAt INTEGER
        )`);

        const settings = await get(`SELECT * FROM settings WHERE key = 'shopName'`);
        if (!settings) {
            await run(`INSERT INTO settings (key, value) VALUES ('shopName', 'HardwarePOS')`);
        }
        
        // Seed demo items if db is empty
        const count = await get(`SELECT COUNT(*) as c FROM items`);
        if(count.c === 0) {
            const demoItems = [
                { name:"සිමෙන්ති (50kg)", category:"සිමෙන්ති/වැලි", unit:"bag", costPrice:1450, sellPrice:1650, qty:40, reorderLevel:10 },
                { name:"6mm ඇණ", category:"ඇණ/බෝල්ට්", unit:"kg", costPrice:280, sellPrice:340, qty:25, reorderLevel:5 },
                { name:'PVC පයිප්ප 1/2"', category:"පයිප්ප", unit:"pcs", costPrice:320, sellPrice:400, qty:3, reorderLevel:8 },
                { name:"විදුලි වයර් (2.5mm)", category:"විදුලි", unit:"m", costPrice:65, sellPrice:85, qty:150, reorderLevel:20 },
                { name:"සායම් (Enamel 1L)", category:"සායම්", unit:"L", costPrice:850, sellPrice:1050, qty:2, reorderLevel:6 },
            ];
            for(let it of demoItems) {
                await run(`INSERT INTO items (name, category, unit, costPrice, sellPrice, qty, reorderLevel, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [it.name, it.category, it.unit, it.costPrice, it.sellPrice, it.qty, it.reorderLevel, Date.now()]);
            }
        }
    },

    getSettings: async () => {
        const rows = await all(`SELECT * FROM settings`);
        const defaults = { shopName: 'HardwarePOS', shopDescription: '', logo: '', logoSize: 38, fontSize: 15 };
        const result = { ...defaults };
        if (rows) {
            rows.forEach(r => {
                if (r.key === 'logoSize' || r.key === 'fontSize') {
                    result[r.key] = Number(r.value) || defaults[r.key];
                } else {
                    result[r.key] = r.value;
                }
            });
        }
        return result;
    },
    updateSettings: async (settingsObj) => {
        if (!settingsObj || typeof settingsObj !== 'object') return;
        for (const [key, value] of Object.entries(settingsObj)) {
            await run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, String(value ?? '')]);
        }
    },

    getAllItems: async () => {
        return await all(`SELECT * FROM items ORDER BY name ASC`);
    },
    addItem: async (item) => {
        const res = await run(`INSERT INTO items (name, category, unit, costPrice, sellPrice, qty, reorderLevel, description, image, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [item.name, item.category?.trim() || 'වෙනත්', item.unit || 'pcs', Number(item.costPrice)||0, Number(item.sellPrice)||0, Number(item.qty)||0, Number(item.reorderLevel)||5, item.description||'', item.image||'', Date.now()]);
        return await get(`SELECT * FROM items WHERE id = ?`, [res.lastID]);
    },
    updateItem: async (id, patch) => {
        const item = await get(`SELECT * FROM items WHERE id = ?`, [id]);
        if (!item) return null;
        const merged = { ...item, ...patch };
        await run(`UPDATE items SET name=?, category=?, unit=?, costPrice=?, sellPrice=?, qty=?, reorderLevel=?, description=?, image=? WHERE id=?`,
            [merged.name, merged.category?.trim()||'වෙනත්', merged.unit, Number(merged.costPrice)||0, Number(merged.sellPrice)||0, Number(merged.qty)||0, Number(merged.reorderLevel)||5, merged.description||'', merged.image||'', id]);
        return merged;
    },
    deleteItem: async (id) => {
        await run(`DELETE FROM items WHERE id = ?`, [id]);
    },

    getAllCustomers: async () => {
        const customers = await all(`SELECT * FROM customers ORDER BY name ASC`);
        for(let c of customers) {
            c.ledger = await all(`SELECT * FROM customer_ledger WHERE customerId = ? ORDER BY date DESC`, [c.id]);
        }
        return customers;
    },
    addCustomer: async (c) => {
        const type = c.customerType || 'customer';
        const discount = Number(c.discountPercent) || 0;
        const res = await run(`INSERT INTO customers (name, phone, address, nic, creditLimit, balance, createdAt, customerType, discountPercent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [c.name.trim(), c.phone?.trim()||"", c.address?.trim()||"", c.nic?.trim()||"", Number(c.creditLimit)||0, 0, Date.now(), type, discount]);
        return { id: res.lastID, ...c, customerType: type, discountPercent: discount, balance: 0, ledger: [] };
    },
    updateCustomer: async (id, patch) => {
        const c = await get(`SELECT * FROM customers WHERE id = ?`, [id]);
        if (!c) return null;
        const merged = { ...c, ...patch };
        await run(`UPDATE customers SET name=?, phone=?, address=?, nic=?, creditLimit=?, balance=?, customerType=?, discountPercent=? WHERE id=?`,
            [merged.name, merged.phone, merged.address, merged.nic, merged.creditLimit, merged.balance, merged.customerType || 'customer', Number(merged.discountPercent)||0, id]);
        return merged;
    },
    deleteCustomer: async (id) => {
        await run(`DELETE FROM customers WHERE id = ?`, [id]);
        await run(`DELETE FROM customer_ledger WHERE customerId = ?`, [id]);
    },
    recordPayment: async (custId, amount, note) => {
        const c = await get(`SELECT * FROM customers WHERE id = ?`, [custId]);
        if (!c) return null;
        const amt = Number(amount)||0;
        const newBalance = c.balance - amt;
        await run(`UPDATE customers SET balance = ? WHERE id = ?`, [newBalance, custId]);
        await run(`INSERT INTO customer_ledger (customerId, date, type, amount, note) VALUES (?, ?, 'payment', ?, ?)`,
            [custId, Date.now(), amt, note || "ගෙවීම"]);
        c.balance = newBalance;
        c.ledger = await all(`SELECT * FROM customer_ledger WHERE customerId = ? ORDER BY date DESC`, [custId]);
        return c;
    },

    getAllSales: async () => {
        const sales = await all(`SELECT * FROM sales ORDER BY id DESC`);
        sales.forEach(s => s.lines = JSON.parse(s.lines));
        return sales;
    },
    createSale: async (sale) => {
        const subtotal = sale.lines.reduce((s,l) => s + l.qty * l.unitPrice, 0);
        const discount = Number(sale.discount)||0;
        const total = Math.max(0, subtotal - discount);
        const amountPaid = Number(sale.amountPaid) || 0;
        const changeAmount = Number(sale.changeAmount) || 0;
        const date = Date.now();
        
        let custName = sale.customerName || '';
        if(sale.customerId) {
            const c = await get(`SELECT name FROM customers WHERE id = ?`, [sale.customerId]);
            if(c) custName = c.name;
        }

        const res = await run(`INSERT INTO sales (date, lines, subtotal, discount, total, paymentType, customerId, customerName, amountPaid, changeAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [date, JSON.stringify(sale.lines), subtotal, discount, total, sale.paymentType, sale.customerId || null, custName, amountPaid, changeAmount]);
        
        const saleId = res.lastID;

        // Reduce stock
        for(let l of sale.lines) {
            const it = await get(`SELECT qty FROM items WHERE id = ?`, [l.itemId]);
            if(it) {
                await run(`UPDATE items SET qty = ? WHERE id = ?`, [Math.max(0, it.qty - l.qty), l.itemId]);
            }
        }

        // Credit Ledger
        if(sale.paymentType === 'credit' && sale.customerId) {
            const c = await get(`SELECT balance FROM customers WHERE id = ?`, [sale.customerId]);
            if(c) {
                await run(`UPDATE customers SET balance = ? WHERE id = ?`, [c.balance + total, sale.customerId]);
                await run(`INSERT INTO customer_ledger (customerId, date, type, amount, note, saleId) VALUES (?, ?, 'sale', ?, ?, ?)`,
                    [sale.customerId, date, total, `බිල් #${saleId}`, saleId]);
            }
        }

        return { id: saleId, date, lines: sale.lines, subtotal, discount, total, paymentType: sale.paymentType, customerId: sale.customerId, customerName: custName, amountPaid, changeAmount };
    },
    deleteSale: async (id) => {
        const s = await get(`SELECT * FROM sales WHERE id = ?`, [id]);
        if(!s) return;
        
        const lines = JSON.parse(s.lines);
        for(let l of lines) {
            const it = await get(`SELECT qty FROM items WHERE id = ?`, [l.itemId]);
            if(it) {
                await run(`UPDATE items SET qty = ? WHERE id = ?`, [it.qty + l.qty, l.itemId]);
            }
        }

        if(s.paymentType === 'credit' && s.customerId) {
            const c = await get(`SELECT balance FROM customers WHERE id = ?`, [s.customerId]);
            if(c) {
                await run(`UPDATE customers SET balance = ? WHERE id = ?`, [c.balance - s.total, s.customerId]);
                await run(`INSERT INTO customer_ledger (customerId, date, type, amount, note) VALUES (?, ?, 'payment', ?, ?)`,
                    [s.customerId, Date.now(), s.total, `බිල් #${id} අවලංගු කිරීම`]);
            }
        }

        await run(`DELETE FROM sales WHERE id = ?`, [id]);
    },

    getAllPurchases: async () => {
        const rows = await all(`SELECT * FROM purchases ORDER BY id DESC`);
        rows.forEach(r => {
            try { r.items = typeof r.items === 'string' ? JSON.parse(r.items) : (r.items || []); } catch(e) { r.items = []; }
        });
        return rows;
    },
    addPurchase: async (p) => {
        const itemsList = Array.isArray(p.items) ? p.items : [];
        const itemsJson = JSON.stringify(itemsList);
        const totalAmount = Number(p.totalAmount) || 0;
        const paidAmount = Number(p.paidAmount) || 0;
        const dueAmount = Math.max(0, totalAmount - paidAmount);
        let paymentStatus = 'paid';
        if (dueAmount >= totalAmount && totalAmount > 0) paymentStatus = 'pending';
        else if (dueAmount > 0) paymentStatus = 'partial';

        const res = await run(
            `INSERT INTO purchases (supplierName, billNo, date, items, subtotal, discount, totalAmount, paidAmount, dueAmount, paymentStatus, note, image, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                p.supplierName?.trim() || 'වෙනත් සැපයුම්කරු',
                p.billNo?.trim() || '',
                p.date || Date.now(),
                itemsJson,
                Number(p.subtotal) || totalAmount,
                Number(p.discount) || 0,
                totalAmount,
                paidAmount,
                dueAmount,
                paymentStatus,
                p.note?.trim() || '',
                p.image || '',
                Date.now()
            ]
        );

        if (p.autoUpdateStock && itemsList.length) {
            for (let item of itemsList) {
                if (item.itemId) {
                    const existing = await get(`SELECT qty FROM items WHERE id = ?`, [item.itemId]);
                    if (existing) {
                        const addQty = Number(item.qty) || 0;
                        const costPrice = Number(item.costPrice) || 0;
                        await run(`UPDATE items SET qty = ?, costPrice = CASE WHEN ? > 0 THEN ? ELSE costPrice END WHERE id = ?`, [existing.qty + addQty, costPrice, costPrice, item.itemId]);
                    }
                }
            }
        }

        const newPurchase = await get(`SELECT * FROM purchases WHERE id = ?`, [res.lastID]);
        if (newPurchase) {
            try { newPurchase.items = JSON.parse(newPurchase.items); } catch(e) { newPurchase.items = []; }
        }
        return newPurchase;
    },
    updatePurchase: async (id, patch) => {
        const p = await get(`SELECT * FROM purchases WHERE id = ?`, [id]);
        if (!p) return null;
        const merged = { ...p, ...patch };
        const itemsJson = typeof merged.items === 'string' ? merged.items : JSON.stringify(merged.items || []);
        const totalAmount = Number(merged.totalAmount) || 0;
        const paidAmount = Number(merged.paidAmount) || 0;
        const dueAmount = Math.max(0, totalAmount - paidAmount);
        let paymentStatus = 'paid';
        if (dueAmount >= totalAmount && totalAmount > 0) paymentStatus = 'pending';
        else if (dueAmount > 0) paymentStatus = 'partial';

        await run(
            `UPDATE purchases SET supplierName=?, billNo=?, date=?, items=?, subtotal=?, discount=?, totalAmount=?, paidAmount=?, dueAmount=?, paymentStatus=?, note=?, image=? WHERE id=?`,
            [
                merged.supplierName?.trim(),
                merged.billNo?.trim(),
                merged.date || Date.now(),
                itemsJson,
                merged.subtotal || totalAmount,
                merged.discount || 0,
                totalAmount,
                paidAmount,
                dueAmount,
                paymentStatus,
                merged.note?.trim() || '',
                merged.image || '',
                id
            ]
        );
        const updated = await get(`SELECT * FROM purchases WHERE id = ?`, [id]);
        if (updated) {
            try { updated.items = JSON.parse(updated.items); } catch(e) { updated.items = []; }
        }
        return updated;
    },
    deletePurchase: async (id) => {
        await run(`DELETE FROM purchases WHERE id = ?`, [id]);
    },
    recordPurchasePayment: async (id, amount) => {
        const p = await get(`SELECT * FROM purchases WHERE id = ?`, [id]);
        if (!p) return null;
        const addAmt = Number(amount) || 0;
        const newPaid = (Number(p.paidAmount) || 0) + addAmt;
        const totalAmount = Number(p.totalAmount) || 0;
        const dueAmount = Math.max(0, totalAmount - newPaid);
        let paymentStatus = 'paid';
        if (dueAmount >= totalAmount && totalAmount > 0) paymentStatus = 'pending';
        else if (dueAmount > 0) paymentStatus = 'partial';

        await run(
            `UPDATE purchases SET paidAmount=?, dueAmount=?, paymentStatus=? WHERE id=?`,
            [newPaid, dueAmount, paymentStatus, id]
        );
        const updated = await get(`SELECT * FROM purchases WHERE id = ?`, [id]);
        if (updated) {
            try { updated.items = JSON.parse(updated.items); } catch(e) { updated.items = []; }
        }
        return updated;
    },

    exportJSON: async () => {
        return {
            settings: await module.exports.getSettings(),
            items: await module.exports.getAllItems(),
            customers: await module.exports.getAllCustomers(),
            sales: await module.exports.getAllSales()
        };
    },
    importJSON: async (data) => {
        // Basic naive import, just wipes and rewrites
        await module.exports.wipeAll();
        if(data.settings) await module.exports.updateSettings(data.settings.shopName);
        if(data.items) {
            for(let it of data.items) {
                await run(`INSERT INTO items (id, name, category, unit, costPrice, sellPrice, qty, reorderLevel, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [it.id, it.name, it.category, it.unit, it.costPrice, it.sellPrice, it.qty, it.reorderLevel, it.createdAt]);
            }
        }
        if(data.customers) {
            for(let c of data.customers) {
                await run(`INSERT INTO customers (id, name, phone, address, nic, creditLimit, balance, createdAt, customerType, discountPercent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [c.id, c.name, c.phone, c.address, c.nic, c.creditLimit, c.balance, c.createdAt, c.customerType || 'customer', c.discountPercent || 0]);
                if(c.ledger) {
                    for(let l of c.ledger) {
                        await run(`INSERT INTO customer_ledger (id, customerId, date, type, amount, note, saleId) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [l.id, c.id, l.date, l.type, l.amount, l.note, l.saleId]);
                    }
                }
            }
        }
        if(data.sales) {
            for(let s of data.sales) {
                await run(`INSERT INTO sales (id, date, lines, subtotal, discount, total, paymentType, customerId, customerName, amountPaid, changeAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [s.id, s.date, JSON.stringify(s.lines), s.subtotal, s.discount, s.total, s.paymentType, s.customerId, s.customerName, s.amountPaid || 0, s.changeAmount || 0]);
            }
        }
    },
    wipeAll: async () => {
        await run(`DELETE FROM items`);
        await run(`DELETE FROM customers`);
        await run(`DELETE FROM customer_ledger`);
        await run(`DELETE FROM sales`);
        await run(`DELETE FROM settings`);
    }
};
