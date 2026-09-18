const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. අඩි 80 වැලිකඩදාසි roll P 40
  {
    name: 'අඩි 80 වැලිකඩදාසි roll (P 40)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් හා රසායනික',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 6250,
    qty: 0,
    reorderLevel: 1,
    packSize: 80,
    packUnit: 'ft',
    loosePrice: 100,
    description: 'අඩි 80 වැලිකඩදාසි රෝල P 40 (Sandpaper Roll 80ft P40) - රෝල = රු. 6250 / අඩි 1 = රු. 100'
  },
  // 2. අඩි 80 වැලිකඩදාසි roll (P 60)
  {
    name: 'අඩි 80 වැලිකඩදාසි roll (P 60)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් හා රසායනික',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 6250,
    qty: 0,
    reorderLevel: 1,
    packSize: 80,
    packUnit: 'ft',
    loosePrice: 100,
    description: 'අඩි 80 වැලිකඩදාසි රෝල P 60 (Sandpaper Roll 80ft P60) - රෝල = රු. 6250 / අඩි 1 = රු. 100'
  },
  // 3. අඩි 80 වැලිකඩදාසි roll (P 80)
  {
    name: 'අඩි 80 වැලිකඩදාසි roll (P 80)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් හා රසායනික',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 6250,
    qty: 0,
    reorderLevel: 1,
    packSize: 80,
    packUnit: 'ft',
    loosePrice: 100,
    description: 'අඩි 80 වැලිකඩදාසි රෝල P 80 (Sandpaper Roll 80ft P80) - රෝල = රු. 6250 / අඩි 1 = රු. 100'
  },
  // 4. අඩි 80 වැලිකඩදාසි roll (P 100)
  {
    name: 'අඩි 80 වැලිකඩදාසි roll (P 100)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් හා රසායනික',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 6250,
    qty: 0,
    reorderLevel: 1,
    packSize: 80,
    packUnit: 'ft',
    loosePrice: 100,
    description: 'අඩි 80 වැලිකඩදාසි රෝල P 100 (Sandpaper Roll 80ft P100) - රෝල = රු. 6250 / අඩි 1 = රු. 100'
  },
  // 5. අඩි 80 වැලිකඩදාසි roll (P 120)
  {
    name: 'අඩි 80 වැලිකඩදාසි roll (P 120)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් හා රසායනික',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 6250,
    qty: 0,
    reorderLevel: 1,
    packSize: 80,
    packUnit: 'ft',
    loosePrice: 100,
    description: 'අඩි 80 වැලිකඩදාසි රෝල P 120 (Sandpaper Roll 80ft P120) - රෝල = රු. 6250 / අඩි 1 = රු. 100'
  }
];

function generateBarcode(existingBarcodes) {
  for (let i = 0; i < 1000; i++) {
    const randomPart = Math.floor(1000000000 + Math.random() * 9000000000);
    const code = '20' + String(randomPart);
    if (!existingBarcodes.has(code)) {
      existingBarcodes.add(code);
      return code;
    }
  }
  const fallback = '20' + Date.now().toString().slice(-10);
  existingBarcodes.add(fallback);
  return fallback;
}

async function processDb(targetDbPath) {
  if (!fs.existsSync(targetDbPath)) {
    console.log(`Skipping non-existent DB: ${targetDbPath}`);
    return;
  }

  console.log(`\n========================================`);
  console.log(`Processing Database: ${targetDbPath}`);
  console.log(`========================================`);

  const db = new sqlite3.Database(targetDbPath);

  const run = (q, p = []) => new Promise((res, rej) => db.run(q, p, function(err) { if (err) rej(err); else res(this); }));
  const get = (q, p = []) => new Promise((res, rej) => db.get(q, p, (err, row) => { if (err) rej(err); else res(row); }));
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => { if (err) rej(err); else res(rows); }));

  const existingItems = await all('SELECT id, name, barcode FROM items');
  const existingBarcodes = new Set(existingItems.map(i => (i.barcode || '').trim()).filter(Boolean));

  let added = 0;
  let updated = 0;

  for (const item of itemsToAdd) {
    const existing = await get('SELECT id, name, qty, sellPrice, barcode FROM items WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))', [item.name]);

    if (existing) {
      await run(
        `UPDATE items 
         SET category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, reorderLevel = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ?
         WHERE id = ?`,
        [item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.reorderLevel, item.packSize || 1, item.packUnit || 'ft', item.loosePrice || 0, item.description, existing.id]
      );
      console.log(`🔄 Updated existing item: ID ${existing.id} -> ${item.name} (Price: Rs. ${item.sellPrice}, Loose: Rs. ${item.loosePrice})`);
      updated++;
    } else {
      const barcode = generateBarcode(existingBarcodes);
      const res = await run(
        `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, packSize, packUnit, loosePrice, description, image, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'ft', item.loosePrice || 0, item.description, Date.now()]
      );
      console.log(`✅ Added new item: ID ${res.lastID} -> ${item.name} | Barcode: ${barcode} | Roll Price: Rs. ${item.sellPrice} | Loose (1ft): Rs. ${item.loosePrice}`);
      added++;
    }
  }

  console.log(`Summary for ${path.basename(targetDbPath)}: Added: ${added}, Updated: ${updated}, Total items in batch: ${itemsToAdd.length}`);
  db.close();
}

async function main() {
  const dbPaths = [
    path.join(__dirname, '..', 'backend', 'pos.db')
  ];

  if (process.env.APPDATA) {
    dbPaths.push(path.join(process.env.APPDATA, 'hardware-pos', 'pos.db'));
    dbPaths.push(path.join(process.env.APPDATA, 'Hardware POS', 'pos.db'));
  }

  const uniquePaths = [...new Set(dbPaths)];

  for (const p of uniquePaths) {
    await processDb(p);
  }

  console.log('\n🎉 Batch 19 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
