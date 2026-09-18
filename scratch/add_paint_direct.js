const path = require('path');
const fs = require('fs');

let dataDir = path.join(__dirname, '..', 'backend');
try {
    if (process.env.APPDATA) {
        const standardPath = path.join(process.env.APPDATA, 'hardware-pos');
        const legacyPath = path.join(process.env.APPDATA, 'Hardware POS');
        if (fs.existsSync(standardPath)) dataDir = standardPath;
        else if (fs.existsSync(legacyPath)) dataDir = legacyPath;
    }
} catch(e) {}

const dbPath = path.join(dataDir, 'pos.db');
console.log('Using database at:', dbPath);

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbPath);

const run = (query, params = []) => new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
        if (err) reject(err); else resolve(this);
    });
});

const items = [
    { name: 'Multidec 4l Lily White',    category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 7,  reorderLevel: 2, description: 'Multidec 4L Lily White - රු. 4,000' },
    { name: 'Multidec 4l B/W',           category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 2,  reorderLevel: 2, description: 'Multidec 4L Brilliant White - රු. 4,000' },
    { name: 'Multidec 4l Robin Yellow',  category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 3,  reorderLevel: 2, description: 'Multidec 4L Robin Yellow - රු. 4,000' },
    { name: 'Multidec 4l Princess Blue', category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 5,  reorderLevel: 2, description: 'Multidec 4L Princess Blue - රු. 4,000' },
    { name: 'Multidec 4l Blissful',      category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 1,  reorderLevel: 2, description: 'Multidec 4L Blissful - රු. 4,000' },
    { name: 'Multidec 4l Ice Blue',      category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 2,  reorderLevel: 2, description: 'Multidec 4L Ice Blue - රු. 4,000' },
    { name: 'Multidec 4l Easter Egg',    category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 2,  reorderLevel: 2, description: 'Multidec 4L Easter Egg - රු. 4,000' },
    { name: 'Multidec 4l Roast Red',     category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 1,  reorderLevel: 2, description: 'Multidec 4L Roast Red - රු. 4,000' },
    { name: 'Multidec 4l Fairy Tale',    category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 1,  reorderLevel: 2, description: 'Multidec 4L Fairy Tale - රු. 4,000' },
    { name: 'Multidec 4l Sunflower',     category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 1,  reorderLevel: 2, description: 'Multidec 4L Sunflower - රු. 4,000' },
    { name: 'Multidec 4l Lime',          category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 3,  reorderLevel: 2, description: 'Multidec 4L Lime - රු. 4,000' },
    { name: 'Pure Lac 4l Fairy Tale',    category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 1,  reorderLevel: 2, description: 'Pure Lac 4L Fairy Tale - රු. 4,000' },
    { name: 'Pure Lac 4l Lime Fizz',     category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 7,  reorderLevel: 2, description: 'Pure Lac 4L Lime Fizz - රු. 4,000' },
    { name: 'Pure Lac 4l Fairy Tale (2)',category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 4000, qty: 6,  reorderLevel: 2, description: 'Pure Lac 4L Fairy Tale - රු. 4,000' },
    { name: 'Multilac 4l B/W',           category: 'සායම් හා රසායනික', subCategory: 'සායම් (Paint)', unit: 'pcs', costPrice: 0, sellPrice: 6000, qty: 5,  reorderLevel: 2, description: 'Multilac 4L Brilliant White - රු. 6,000' },
];

async function main() {
    let success = 0, skip = 0, fail = 0;

    for (const item of items) {
        try {
            const existing = await new Promise((resolve, reject) => {
                db.get('SELECT id FROM items WHERE name = ?', [item.name], (err, row) => {
                    if (err) reject(err); else resolve(row);
                });
            });
            if (existing) {
                console.log(`⏭️  Skip (දැනටමත් ඇත): ${item.name}`);
                skip++;
                continue;
            }

            const res = await run(
                `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, description, image, packSize, packUnit, loosePrice, createdAt)
                 VALUES (?, '', ?, ?, ?, ?, ?, ?, ?, ?, '', 1, 'pcs', 0, ?)`,
                [item.name, item.category, item.subCategory, item.unit,
                 item.costPrice, item.sellPrice, item.qty, item.reorderLevel,
                 item.description, Date.now()]
            );
            console.log(`✅ Added: ${item.name} (ID: ${res.lastID})`);
            success++;
        } catch(err) {
            console.log(`❌ Error: ${item.name} -> ${err.message}`);
            fail++;
        }
    }

    console.log(`\n📊 Result: ✅ Added: ${success} | ⏭️  Skipped: ${skip} | ❌ Failed: ${fail}`);
    db.close();
}

main().catch(err => { console.error('Fatal:', err); db.close(); process.exit(1); });
