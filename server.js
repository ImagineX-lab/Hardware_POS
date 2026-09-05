const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./backend/database');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/phosphor-icons', express.static(path.join(__dirname, 'phosphor-icons')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- API ROUTES ---

// Settings
app.get('/api/settings', async (req, res) => {
    res.json(await db.getSettings());
});
app.put('/api/settings', async (req, res) => {
    await db.updateSettings(req.body);
    res.json({ success: true });
});

// Items
app.get('/api/items', async (req, res) => {
    res.json(await db.getAllItems());
});
app.post('/api/items', async (req, res) => {
    const newItem = await db.addItem(req.body);
    res.json(newItem);
});
app.put('/api/items/:id', async (req, res) => {
    const updated = await db.updateItem(req.params.id, req.body);
    if(updated) res.json(updated);
    else res.status(404).json({error: "Item not found"});
});
app.delete('/api/items/:id', async (req, res) => {
    await db.deleteItem(req.params.id);
    res.json({ success: true });
});

// Customers
app.get('/api/customers', async (req, res) => {
    res.json(await db.getAllCustomers());
});
app.post('/api/customers', async (req, res) => {
    try {
        const newCustomer = await db.addCustomer(req.body);
        res.json(newCustomer);
    } catch (err) {
        res.status(400).json({ error: err.message || "Failed to add customer" });
    }
});
app.put('/api/customers/:id', async (req, res) => {
    try {
        const updated = await db.updateCustomer(req.params.id, req.body);
        if(updated) res.json(updated);
        else res.status(404).json({error: "Customer not found"});
    } catch (err) {
        res.status(400).json({ error: err.message || "Failed to update customer" });
    }
});
app.delete('/api/customers/:id', async (req, res) => {
    await db.deleteCustomer(req.params.id);
    res.json({ success: true });
});
app.post('/api/customers/:id/payment', async (req, res) => {
    const { amount, note } = req.body;
    const customer = await db.recordPayment(req.params.id, amount, note);
    if(customer) res.json(customer);
    else res.status(404).json({error: "Customer not found"});
});

// Sales
app.get('/api/sales', async (req, res) => {
    res.json(await db.getAllSales());
});
app.post('/api/sales', async (req, res) => {
    const newSale = await db.createSale(req.body);
    res.json(newSale);
});
app.delete('/api/sales/:id', async (req, res) => {
    await db.deleteSale(req.params.id);
    res.json({ success: true });
});
app.post('/api/sales/clear-all', async (req, res) => {
    try {
        const restoreStock = req.body?.restoreStock !== false;
        await db.clearAllSales(restoreStock);
        res.json({ success: true, message: "All sales cleared and bill counter reset to 1" });
    } catch (err) {
        res.status(500).json({ error: err.message || "Failed to clear sales" });
    }
});

// Purchases (කඩේට ගත් බිල්පත්)
app.get('/api/purchases', async (req, res) => {
    res.json(await db.getAllPurchases());
});
app.post('/api/purchases', async (req, res) => {
    const newPurchase = await db.addPurchase(req.body);
    res.json(newPurchase);
});
app.put('/api/purchases/:id', async (req, res) => {
    const updated = await db.updatePurchase(req.params.id, req.body);
    if(updated) res.json(updated);
    else res.status(404).json({error: "Purchase bill not found"});
});
app.delete('/api/purchases/:id', async (req, res) => {
    await db.deletePurchase(req.params.id);
    res.json({ success: true });
});
app.post('/api/purchases/:id/payment', async (req, res) => {
    const { amount } = req.body;
    const updated = await db.recordPurchasePayment(req.params.id, amount);
    if(updated) res.json(updated);
    else res.status(404).json({error: "Purchase bill not found"});
});

// Backup
app.get('/api/backup', async (req, res) => {
    res.json(await db.exportJSON());
});
app.post('/api/backup', async (req, res) => {
    try {
        await db.importJSON(req.body);
        res.json({ success: true });
    } catch(err) {
        res.status(400).json({ error: err.message });
    }
});
app.post('/api/wipe', async (req, res) => {
    await db.wipeAll();
    res.json({ success: true });
});

function startServer(preferredPort = 3000) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.init();
        } catch (dbErr) {
            console.error('Database initialization error:', dbErr);
            return reject(dbErr);
        }

        let currentPort = Number(process.env.PORT) || preferredPort || 3000;
        const maxAttempts = 20;
        let attempts = 0;

        function tryListen(port) {
            const server = app.listen(port, '127.0.0.1');
            server.on('listening', () => {
                const actualPort = server.address().port;
                console.log(`Hardware POS Server is running on http://127.0.0.1:${actualPort}`);
                resolve({ server, port: actualPort, app });
            });
            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE' && attempts < maxAttempts) {
                    attempts++;
                    const nextPort = port + 1;
                    console.warn(`Port ${port} in use on this PC, trying fallback port ${nextPort}...`);
                    tryListen(nextPort);
                } else {
                    reject(err);
                }
            });
        }

        tryListen(currentPort);
    });
}

// Auto-start if executed directly via `node server.js`
if (require.main === module) {
    startServer(process.env.PORT || 3000).catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
}

module.exports = { app, startServer };
