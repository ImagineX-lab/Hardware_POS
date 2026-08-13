const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./backend/database');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- API ROUTES ---

// Settings
app.get('/api/settings', async (req, res) => {
    res.json(await db.getSettings());
});
app.put('/api/settings', async (req, res) => {
    const { shopName } = req.body;
    await db.updateSettings(shopName);
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
    const newCustomer = await db.addCustomer(req.body);
    res.json(newCustomer);
});
app.put('/api/customers/:id', async (req, res) => {
    const updated = await db.updateCustomer(req.params.id, req.body);
    if(updated) res.json(updated);
    else res.status(404).json({error: "Customer not found"});
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

const PORT = process.env.PORT || 3000;
db.init().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
