const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

let dataDir = __dirname;
try {
    const electron = require('electron');
    const app = electron.app || (electron.remote && electron.remote.app);
    if (app && typeof app.getPath === 'function') {
        dataDir = app.getPath('userData');
    } else if (process.env.APPDATA) {
        dataDir = path.join(process.env.APPDATA, 'Hardware POS');
    }
} catch (e) {
    if (process.env.APPDATA) {
        dataDir = path.join(process.env.APPDATA, 'Hardware POS');
    }
}

if (!fs.existsSync(dataDir)) {
    try {
        fs.mkdirSync(dataDir, { recursive: true });
    } catch (err) {
        console.error('Failed to create data directory in APPDATA, falling back to temp:', err);
        dataDir = path.join(require('os').tmpdir(), 'HardwarePOS');
        fs.mkdirSync(dataDir, { recursive: true });
    }
}

const dbPath = path.join(dataDir, 'pos.db');
const bundledDbPath = path.join(__dirname, 'pos.db');

if (dataDir !== __dirname) {
    const dbExists = fs.existsSync(dbPath);
    let dbEmpty = true;
    if (dbExists) {
        try {
            dbEmpty = fs.statSync(dbPath).size === 0;
        } catch (e) {
            dbEmpty = true;
        }
    }
    if (!dbExists || dbEmpty) {
        if (fs.existsSync(bundledDbPath)) {
            try {
                const bundledData = fs.readFileSync(bundledDbPath);
                if (bundledData && bundledData.length > 0) {
                    fs.writeFileSync(dbPath, bundledData);
                    console.log('Successfully copied bundled pos.db to userData:', dbPath);
                }
            } catch (err) {
                console.warn('Could not copy bundled pos.db, will create fresh schema on init():', err.message);
            }
        }
    }
}

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

const validatePhoneBackend = (phone) => {
    if (!phone || !String(phone).trim()) return { valid: true, value: '' };
    const clean = String(phone).trim().replace(/[\s\-\(\)\.]/g, '');
    const is10Digit = /^0[1-9][0-9]{8}$/.test(clean);
    const isPlus94 = /^\+94[1-9][0-9]{8}$/.test(clean);
    const is94 = /^94[1-9][0-9]{8}$/.test(clean);
    const is9Digit = /^[1-9][0-9]{8}$/.test(clean);
    if (is10Digit || isPlus94 || is94 || is9Digit) {
        let normalized = clean;
        if (isPlus94) normalized = '0' + clean.slice(3);
        else if (is94) normalized = '0' + clean.slice(2);
        else if (is9Digit) normalized = '0' + clean;
        return { valid: true, value: normalized };
    }
    return { valid: false, error: 'Invalid phone number' };
};

const validateNICBackend = (nic) => {
    if (!nic || !String(nic).trim()) return { valid: true, value: '' };
    const clean = String(nic).trim().replace(/[\s\-\.]/g, '').toUpperCase();
    const isOldNIC = /^[0-9]{9}[VX]$/.test(clean);
    const isNewNIC = /^[0-9]{12}$/.test(clean);
    if (isOldNIC || isNewNIC) {
        return { valid: true, value: clean };
    }
    return { valid: false, error: 'Invalid NIC number' };
};

module.exports = {
    init: async () => {
        await run(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`);
        await run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            barcode TEXT DEFAULT '',
            category TEXT,
            subCategory TEXT,
            unit TEXT,
            costPrice REAL,
            sellPrice REAL,
            qty REAL,
            reorderLevel REAL,
            packSize REAL DEFAULT 1,
            packUnit TEXT DEFAULT '',
            loosePrice REAL DEFAULT 0,
            description TEXT,
            image TEXT,
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
        try { await run(`ALTER TABLE sales ADD COLUMN barcode TEXT DEFAULT ''`); } catch(e) {}
        try { await run(`ALTER TABLE items ADD COLUMN barcode TEXT DEFAULT ''`); } catch(e) {}
        try { await run(`ALTER TABLE items ADD COLUMN description TEXT`); } catch(e) {}
        try { await run(`ALTER TABLE items ADD COLUMN image TEXT`); } catch(e) {}
        try { await run(`ALTER TABLE items ADD COLUMN subCategory TEXT`); } catch(e) {}
        try { await run(`ALTER TABLE items ADD COLUMN packSize REAL DEFAULT 1`); } catch(e) {}
        try { await run(`ALTER TABLE items ADD COLUMN packUnit TEXT DEFAULT ''`); } catch(e) {}
        try { await run(`ALTER TABLE items ADD COLUMN loosePrice REAL DEFAULT 0`); } catch(e) {}
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
            await run(`INSERT INTO settings (key, value) VALUES ('shopName', 'රත්න HARDWARE')`);
        }

        const defaultItems = [
            { name: 'අඟල් 1 L Bar (3mm)', category: 'යකඩ', subCategory: 'L Bar', unit: 'length', costPrice: 0, sellPrice: 2100, loosePrice: 150, packSize: 18, packUnit: 'ft', description: 'අඟල් 1 L Bar (3mm) - අඩි 18: රු. 2,100 | අඩි 1: රු. 150' },
            { name: 'අඟල් 1 L Bar (5mm)', category: 'යකඩ', subCategory: 'L Bar', unit: 'length', costPrice: 0, sellPrice: 2750, loosePrice: 150, packSize: 18, packUnit: 'ft', description: 'අඟල් 1 L Bar (5mm) - අඩි 18: රු. 2,750 | අඩි 1: රු. 150' },
            { name: '1 1/2" L Bar (3mm)', category: 'යකඩ', subCategory: 'L Bar', unit: 'length', costPrice: 0, sellPrice: 2750, loosePrice: 150, packSize: 18, packUnit: 'ft', description: '1 1/2" L Bar (3mm) - අඩි 18: රු. 2,750 | අඩි 1: රු. 150' },
            { name: '1 1/2" L Bar (4mm)', category: 'යකඩ', subCategory: 'L Bar', unit: 'length', costPrice: 0, sellPrice: 3400, loosePrice: 200, packSize: 18, packUnit: 'ft', description: '1 1/2" L Bar (4mm) - අඩි 18: රු. 3,400 | අඩි 1: රු. 200' },
            { name: '1 1/2" L Bar (5mm)', category: 'යකඩ', subCategory: 'L Bar', unit: 'length', costPrice: 0, sellPrice: 4350, loosePrice: 250, packSize: 18, packUnit: 'ft', description: '1 1/2" L Bar (5mm) - අඩි 18: රු. 4,350 | අඩි 1: රු. 250' },
            { name: '2" x 1/4" L Bar (රු. 4,800)', category: 'යකඩ', subCategory: 'L Bar', unit: 'length', costPrice: 0, sellPrice: 4800, loosePrice: 300, packSize: 18, packUnit: 'ft', description: '2" x 1/4" L Bar - අඩි 18: රු. 4,800 | අඩි 1: රු. 300' },
            { name: '2" x 1/4" L Bar (රු. 6,650)', category: 'යකඩ', subCategory: 'L Bar', unit: 'length', costPrice: 0, sellPrice: 6650, loosePrice: 400, packSize: 18, packUnit: 'ft', description: '2" x 1/4" L Bar - අඩි 18: රු. 6,650 | අඩි 1: රු. 400' },
            { name: '1/4" x 1/2" පට්ටම', category: 'යකඩ', subCategory: 'පට්ටම් (Flat Iron)', unit: 'length', costPrice: 0, sellPrice: 950, loosePrice: 0, packSize: 18, packUnit: 'ft', description: '1/4" x 1/2" පට්ටම (Flat Iron) - රු. 950' },
            { name: '3/4" පට්ටම', category: 'යකඩ', subCategory: 'පට්ටම් (Flat Iron)', unit: 'length', costPrice: 0, sellPrice: 1350, loosePrice: 100, packSize: 18, packUnit: 'ft', description: '3/4" පට්ටම (Flat Iron) - අඩි 18: රු. 1,350 | අඩි 1: රු. 100' },
            { name: 'අඟල් 1 පට්ටම', category: 'යකඩ', subCategory: 'පට්ටම් (Flat Iron)', unit: 'length', costPrice: 0, sellPrice: 1950, loosePrice: 150, packSize: 18, packUnit: 'ft', description: 'අඟල් 1 පට්ටම (1" Flat Iron) - අඩි 18: රු. 1,950 | අඩි 1: රු. 150' },
            { name: 'අඟල් 1 1/2 පට්ටම', category: 'යකඩ', subCategory: 'පට්ටම් (Flat Iron)', unit: 'length', costPrice: 0, sellPrice: 3450, loosePrice: 200, packSize: 18, packUnit: 'ft', description: 'අඟල් 1 1/2 පට්ටම (1 1/2" Flat Iron) - අඩි 18: රු. 3,450 | අඩි 1: රු. 200' },
            { name: 'අඟල් 2 1/4 පට්ටම', category: 'යකඩ', subCategory: 'පට්ටම් (Flat Iron)', unit: 'length', costPrice: 0, sellPrice: 3600, loosePrice: 250, packSize: 18, packUnit: 'ft', description: 'අඟල් 2 1/4 පට්ටම (2 1/4" Flat Iron) - අඩි 18: රු. 3,600 | අඩි 1: රු. 250' },

            // Box Bar items
            { name: '1/2" Box Bar', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 1050, loosePrice: 0, packSize: 18, packUnit: 'ft', description: '1/2" Box Bar (අඟල් 1/2) - අඩි 18: රු. 1,050' },
            { name: '3/4" Box Bar (1.2mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 1300, loosePrice: 78, packSize: 18, packUnit: 'ft', description: '3/4" Box Bar (1.2mm) - අඩි 18: රු. 1,300 | 1/2: රු. 700' },
            { name: '3/4" Box Bar (1.4mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 1450, loosePrice: 83, packSize: 18, packUnit: 'ft', description: '3/4" Box Bar (1.4mm) - අඩි 18: රු. 1,450 | 1/2: රු. 750' },
            { name: 'අඟල් 1 Box Bar (1.2mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 1700, loosePrice: 100, packSize: 18, packUnit: 'ft', description: '1" Box Bar (1.2mm) - අඩි 18: රු. 1,700 | 1/2: රු. 900' },
            { name: 'අඟල් 1 Box Bar (1.4mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 1950, loosePrice: 117, packSize: 18, packUnit: 'ft', description: '1" Box Bar (1.4mm) - අඩි 18: රු. 1,950 | 1/2: රු. 1,050' },
            { name: 'අඟල් 1 Box Bar (1.6mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 2950, loosePrice: 156, packSize: 18, packUnit: 'ft', description: '1" Box Bar (1.6mm) - අඩි 18: රු. 2,950 | 1/2: රු. 1,400' },
            { name: '1 1/2" Box Bar (1.2mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 2400, loosePrice: 156, packSize: 18, packUnit: 'ft', description: '1 1/2" Box Bar (1.2mm) - අඩි 18: රු. 2,400 | 1/2: රු. 1,400' },
            { name: '1 1/2" Box Bar (1.4mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 2950, loosePrice: 172, packSize: 18, packUnit: 'ft', description: '1 1/2" Box Bar (1.4mm) - අඩි 18: රු. 2,950 | 1/2: රු. 1,550' },
            { name: '1 1/2" Box Bar (1.6mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 3200, loosePrice: 189, packSize: 18, packUnit: 'ft', description: '1 1/2" Box Bar (1.6mm) - අඩි 18: රු. 3,200 | 1/2: රු. 1,700' },
            { name: '2" x 2" Box Bar (1.2mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 3500, loosePrice: 200, packSize: 18, packUnit: 'ft', description: '2" x 2" Box Bar (1.2mm) - අඩි 18: රු. 3,500 | 1/2: රු. 1,800' },
            { name: '2" x 2" Box Bar (1.4mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 3900, loosePrice: 222, packSize: 18, packUnit: 'ft', description: '2" x 2" Box Bar (1.4mm) - අඩි 18: රු. 3,900 | 1/2: රු. 2,000' },
            { name: '2" x 2" Box Bar (1.6mm)', category: 'යකඩ', subCategory: 'Box Bar', unit: 'length', costPrice: 0, sellPrice: 4600, loosePrice: 267, packSize: 18, packUnit: 'ft', description: '2" x 2" Box Bar (1.6mm) - අඩි 18: රු. 4,600 | 1/2: රු. 2,400' }
        ];

        for (const it of defaultItems) {
            const existing = await get(`SELECT id FROM items WHERE name = ?`, [it.name]);
            if (!existing) {
                await run(
                    `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, packSize, packUnit, loosePrice, description, image, createdAt) VALUES (?, '', ?, ?, ?, ?, ?, 0, 5, ?, ?, ?, ?, '', ?)`,
                    [it.name, it.category, it.subCategory, it.unit, it.costPrice, it.sellPrice, it.packSize, it.packUnit, it.loosePrice, it.description, Date.now()]
                );
            } else {
                await run(
                    `UPDATE items SET category = ?, subCategory = ?, sellPrice = ?, loosePrice = ?, packSize = ?, packUnit = ?, description = ? WHERE id = ?`,
                    [it.category, it.subCategory, it.sellPrice, it.loosePrice, it.packSize, it.packUnit, it.description, existing.id]
                );
            }
        }

        try {
            await run(`UPDATE items SET category = 'ගෘහ උපකරණ', subCategory = CASE WHEN category = 'Buckets' THEN 'බාල්දි' WHEN category = 'Cleaning' THEN 'පිරිසිදු කිරීම්' WHEN category = 'Storage' THEN 'රැක්ක' ELSE subCategory END WHERE category IN ('Buckets', 'Cleaning', 'Storage')`);
        } catch(e) {}
    },

    getSettings: async () => {
        const rows = await all(`SELECT * FROM settings`);
        const defaults = { shopName: 'රත්න HARDWARE', shopDescription: '', logo: 'icon.png', logoSize: 38, fontSize: 15 };
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
        const res = await run(`INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, description, image, packSize, packUnit, loosePrice, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [item.name, item.barcode?.trim() || '', item.category?.trim() || 'වෙනත්', item.subCategory?.trim() || '', item.unit || 'pcs', Number(item.costPrice)||0, Number(item.sellPrice)||0, Number(item.qty)||0, Number(item.reorderLevel)||5, item.description||'', item.image||'', Number(item.packSize)||1, item.packUnit||'', Number(item.loosePrice)||0, Date.now()]);
        return await get(`SELECT * FROM items WHERE id = ?`, [res.lastID]);
    },
    updateItem: async (id, patch) => {
        const item = await get(`SELECT * FROM items WHERE id = ?`, [id]);
        if (!item) return null;
        const merged = { ...item, ...patch };
        await run(`UPDATE items SET name=?, barcode=?, category=?, subCategory=?, unit=?, costPrice=?, sellPrice=?, qty=?, reorderLevel=?, description=?, image=?, packSize=?, packUnit=?, loosePrice=? WHERE id=?`,
            [merged.name, (merged.barcode || '').trim(), merged.category?.trim()||'වෙනත්', merged.subCategory?.trim()||'', merged.unit, Number(merged.costPrice)||0, Number(merged.sellPrice)||0, Number(merged.qty)||0, Number(merged.reorderLevel)||5, merged.description||'', merged.image||'', Number(merged.packSize)||1, merged.packUnit||'', Number(merged.loosePrice)||0, id]);
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
        if (!c.name || !c.name.trim()) throw new Error("Customer name is required");
        const phoneVal = validatePhoneBackend(c.phone);
        if (!phoneVal.valid) throw new Error("Invalid phone number format");
        const nicVal = validateNICBackend(c.nic);
        if (!nicVal.valid) throw new Error("Invalid NIC number format");

        const type = c.customerType || 'customer';
        const discount = Number(c.discountPercent) || 0;
        const res = await run(`INSERT INTO customers (name, phone, address, nic, creditLimit, balance, createdAt, customerType, discountPercent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [c.name.trim(), phoneVal.value, c.address?.trim()||"", nicVal.value, Number(c.creditLimit)||0, 0, Date.now(), type, discount]);
        return { id: res.lastID, ...c, phone: phoneVal.value, nic: nicVal.value, customerType: type, discountPercent: discount, balance: 0, ledger: [] };
    },
    updateCustomer: async (id, patch) => {
        const c = await get(`SELECT * FROM customers WHERE id = ?`, [id]);
        if (!c) return null;
        if (patch.name !== undefined && (!patch.name || !patch.name.trim())) {
            throw new Error("Customer name is required");
        }
        if (patch.phone !== undefined) {
            const phoneVal = validatePhoneBackend(patch.phone);
            if (!phoneVal.valid) throw new Error("Invalid phone number format");
            patch.phone = phoneVal.value;
        }
        if (patch.nic !== undefined) {
            const nicVal = validateNICBackend(patch.nic);
            if (!nicVal.valid) throw new Error("Invalid NIC number format");
            patch.nic = nicVal.value;
        }

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
        sales.forEach(s => {
            try { s.lines = typeof s.lines === 'string' ? JSON.parse(s.lines) : s.lines; } catch(e) { s.lines = []; }
            s.barcode = s.barcode || ('BILL-' + s.id);
        });
        return sales;
    },
    createSale: async (sale) => {
        const subtotal = sale.lines.reduce((s,l) => s + l.qty * (l.originalPrice || l.unitPrice), 0);
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
        const saleBarcode = 'BILL-' + saleId;
        try {
            await run(`UPDATE sales SET barcode = ? WHERE id = ?`, [saleBarcode, saleId]);
        } catch(e) {}

        // Reduce stock
        for(let l of sale.lines) {
            const it = await get(`SELECT qty FROM items WHERE id = ?`, [l.itemId]);
            if(it) {
                const remaining = Math.max(0, Math.round((it.qty - l.qty) * 10000) / 10000);
                await run(`UPDATE items SET qty = ? WHERE id = ?`, [remaining, l.itemId]);
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

        return { id: saleId, barcode: saleBarcode, date, lines: sale.lines, subtotal, discount, total, paymentType: sale.paymentType, customerId: sale.customerId, customerName: custName, amountPaid, changeAmount };
    },
    deleteSale: async (id) => {
        const s = await get(`SELECT * FROM sales WHERE id = ?`, [id]);
        if(!s) return;
        
        const lines = JSON.parse(s.lines);
        for(let l of lines) {
            const it = await get(`SELECT qty FROM items WHERE id = ?`, [l.itemId]);
            if(it) {
                const restored = Math.round((it.qty + l.qty) * 10000) / 10000;
                await run(`UPDATE items SET qty = ? WHERE id = ?`, [restored, l.itemId]);
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
        const remaining = await get(`SELECT COUNT(*) as cnt FROM sales`);
        if (remaining && remaining.cnt === 0) {
            try {
                await run(`DELETE FROM sqlite_sequence WHERE name = 'sales'`);
            } catch(e) {}
        }
    },

    clearAllSales: async (restoreStock = true) => {
        if (restoreStock) {
            const sales = await all(`SELECT * FROM sales`);
            for (let s of sales) {
                try {
                    const lines = typeof s.lines === 'string' ? JSON.parse(s.lines) : (s.lines || []);
                    for (let l of lines) {
                        const it = await get(`SELECT qty FROM items WHERE id = ?`, [l.itemId]);
                        if (it) {
                            const restored = Math.round((it.qty + l.qty) * 10000) / 10000;
                            await run(`UPDATE items SET qty = ? WHERE id = ?`, [restored, l.itemId]);
                        }
                    }
                    if (s.paymentType === 'credit' && s.customerId) {
                        const c = await get(`SELECT balance FROM customers WHERE id = ?`, [s.customerId]);
                        if (c) {
                            await run(`UPDATE customers SET balance = ? WHERE id = ?`, [Math.max(0, c.balance - s.total), s.customerId]);
                            await run(`INSERT INTO customer_ledger (customerId, date, type, amount, note) VALUES (?, ?, 'payment', ?, ?)`,
                                [s.customerId, Date.now(), s.total, `බිල්පත් සියල්ල මකා දැමීම (#${s.id})`]);
                        }
                    }
                } catch(e) {}
            }
        }
        await run(`DELETE FROM sales`);
        try {
            await run(`DELETE FROM sqlite_sequence WHERE name = 'sales'`);
        } catch(e) {}
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
                await run(`INSERT INTO items (id, name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, description, image, packSize, packUnit, loosePrice, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [it.id, it.name, it.barcode || '', it.category, it.subCategory || '', it.unit, it.costPrice, it.sellPrice, it.qty, it.reorderLevel, it.description || '', it.image || '', it.packSize || 1, it.packUnit || '', it.loosePrice || 0, it.createdAt]);
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
        await run(`DELETE FROM purchases`);
        try {
            await run(`DELETE FROM sqlite_sequence`);
        } catch(e) {}
    }
};
