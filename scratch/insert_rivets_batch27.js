const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 5/32 x 1/2" රිවට් | QTY: 100
  {
    name: '5/32 x 1/2" රිවට්',
    matchNames: [
      '5/32 x 1/2" රිවට්',
      '5/32x1/2" රිවට්',
      '5/32 x 1/2\' රිවට්',
      '5/32x1/2\' රිවට්',
      '5/32 x 1/2 රිවට්',
      '5/32x1/2 රිවට්',
      '5/32*1/2 රිවට්',
      '5/32*1/2" රිවට්'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '5/32" x 1/2" රිවට් (Blind Rivet / Pop Rivet 5/32 x 1/2)'
  },
  // 2. 5/32 x 3/4" රිවට් | QTY: 100
  {
    name: '5/32 x 3/4" රිවට්',
    matchNames: [
      '5/32 x 3/4" රිවට්',
      '5/32x3/4" රිවට්',
      '5/32 x 3/4\' රිවට්',
      '5/32x3/4\' රිවට්',
      '5/32 x 3/4 රිවට්',
      '5/32x3/4 රිවට්',
      '5/32*3/4 රිවට්',
      '5/32*3/4" රිවට්'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '5/32" x 3/4" රිවට් (Blind Rivet / Pop Rivet 5/32 x 3/4)'
  },
  // 3. 5/32 x 1" රිවට් | QTY: 100
  {
    name: '5/32 x 1" රිවට්',
    matchNames: [
      '5/32 x 1" රිවට්',
      '5/32x1" රිවට්',
      '5/32 x 1\' රිවට්',
      '5/32x1\' රිවට්',
      '5/32 x 1 රිවට්',
      '5/32x1 රිවට්',
      '5/32*1 රිවට්',
      '5/32*1" රිවට්'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '5/32" x 1" රිවට් (Blind Rivet / Pop Rivet 5/32 x 1)'
  },
  // 4. 3/16 x 1/2" රිවට් | QTY: 100
  {
    name: '3/16 x 1/2" රිවට්',
    matchNames: [
      '3/16 x 1/2" රිවට්',
      '3/16x1/2" රිවට්',
      '3/16 x 1/2\' රිවට්',
      '3/16x1/2\' රිවට්',
      '3/16 x 1/2 රිවට්',
      '3/16x1/2 රිවට්',
      '3/16*1/2 රිවට්',
      '3/16*1/2" රිවට්'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3/16" x 1/2" රිවට් (Blind Rivet / Pop Rivet 3/16 x 1/2)'
  },
  // 5. 3/16 x 3/4" රිවට් | QTY: 100
  {
    name: '3/16 x 3/4" රිවට්',
    matchNames: [
      '3/16 x 3/4" රිවට්',
      '3/16x3/4" රිවට්',
      '3/16 x 3/4\' රිවට්',
      '3/16x3/4\' රිවට්',
      '3/16 x 3/4 රිවට්',
      '3/16x3/4 රිවට්',
      '3/16*3/4 රිවට්',
      '3/16*3/4" රිවට්'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3/16" x 3/4" රිවට් (Blind Rivet / Pop Rivet 3/16 x 3/4)'
  },
  // 6. 3/16 x 1" රිවට් | QTY: 100
  {
    name: '3/16 x 1" රිවට්',
    matchNames: [
      '3/16 x 1" රිවට්',
      '3/16x1" රිවට්',
      '3/16 x 1\' රිවට්',
      '3/16x1\' රිවට්',
      '3/16 x 1 රිවට්',
      '3/16x1 රිවට්',
      '3/16*1 රිවට්',
      '3/16*1" රිවට්'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3/16" x 1" රිවට් (Blind Rivet / Pop Rivet 3/16 x 1)'
  },
  // 7. 1/8 x 1/2" රිවට් | QTY: 100
  {
    name: '1/8 x 1/2" රිවට්',
    matchNames: [
      '1/8 x 1/2" රිවට්',
      '1/8x1/2" රිවට්',
      '1/8 x 1/2\' රිවට්',
      '1/8x1/2\' රිවට්',
      '1/8 x 1/2 රිවට්',
      '1/8x1/2 රිවට්',
      '1/8*1/2 රිවට්',
      '1/8*1/2" රිවට්'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1/8" x 1/2" රිවට් (Blind Rivet / Pop Rivet 1/8 x 1/2)'
  },
  // 8. 1/8 x 3/4" රිවට් | QTY: 100
  {
    name: '1/8 x 3/4" රිවට්',
    matchNames: [
      '1/8 x 3/4" රිවට්',
      '1/8x3/4" රිවට්',
      '1/8 x 3/4\' රිවට්',
      '1/8x3/4\' රිවට්',
      '1/8 x 3/4 රිවට්',
      '1/8x3/4 රිවට්',
      '1/8*3/4 රිවට්',
      '1/8*3/4" රිවට්'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1/8" x 3/4" රිවට් (Blind Rivet / Pop Rivet 1/8 x 3/4)'
  },
  // 9. 1/8 x 1" රිවට් | QTY: 100
  {
    name: '1/8 x 1" රිවට්',
    matchNames: [
      '1/8 x 1" රිවට්',
      '1/8x1" රිවට්',
      '1/8 x 1\' රිවට්',
      '1/8x1\' රිවට්',
      '1/8 x 1 රිවට්',
      '1/8x1 රිවට්',
      '1/8*1 රිවට්',
      '1/8*1" රිවට්'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1/8" x 1" රිවට් (Blind Rivet / Pop Rivet 1/8 x 1)'
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
    let existing = null;
    for (const matchName of item.matchNames) {
      existing = await get('SELECT id, name, qty, sellPrice, barcode FROM items WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))', [matchName]);
      if (existing) break;
    }

    if (existing) {
      let barcode = (existing.barcode || '').trim();
      if (!barcode) {
        barcode = generateBarcode(existingBarcodes);
      }
      // If sell price is already set (> 0) on existing, preserve it
      const currentSellPrice = existing.sellPrice > 0 ? existing.sellPrice : item.sellPrice;
      await run(
        `UPDATE items 
         SET name = ?, barcode = ?, category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, qty = ?, reorderLevel = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ?
         WHERE id = ?`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, currentSellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, existing.id]
      );
      console.log(`🔄 Updated item: ID ${existing.id} -> ${item.name} | Qty: ${item.qty} | Price: Rs. ${currentSellPrice} | Barcode: ${barcode}`);
      updated++;
    } else {
      const barcode = generateBarcode(existingBarcodes);
      const res = await run(
        `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, packSize, packUnit, loosePrice, description, image, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, Date.now()]
      );
      console.log(`✅ Added new item: ID ${res.lastID} -> ${item.name} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice} | Barcode: ${barcode}`);
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

  console.log('\n🎉 Rivet items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
