const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 13 x 1" බෝල්ට් ඇණ | 100 | RS. 30
  {
    name: '13 x 1" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 30,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '13 x 1" බෝල්ට් ඇණ (13 x 1" Bolt & Nut) - රු. 30'
  },
  // 2. 13 x 1/2" බෝල්ට් ඇණ | 100 | RS. 25
  {
    name: '13 x 1/2" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 25,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '13 x 1/2" බෝල්ට් ඇණ (13 x 1/2" Bolt & Nut) - රු. 25'
  },
  // 3. 13 x 1 1/2" බෝල්ට් ඇණ | 100 | RS. 35
  {
    name: '13 x 1 1/2" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 35,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '13 x 1 1/2" බෝල්ට් ඇණ (13 x 1 1/2" Bolt & Nut) - රු. 35'
  },
  // 4. 13 x 2" බෝල්ට් ඇණ | 100 | RS. 40
  {
    name: '13 x 2" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 40,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '13 x 2" බෝල්ට් ඇණ (13 x 2" Bolt & Nut) - රු. 40'
  },
  // 5. 13 x 3" බෝල්ට් ඇණ | 100 | RS. 50
  {
    name: '13 x 3" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 50,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '13 x 3" බෝල්ට් ඇණ (13 x 3" Bolt & Nut) - රු. 50'
  },
  // 6. 13 x 4" බෝල්ට් ඇණ | 100 | RS. 50
  {
    name: '13 x 4" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 50,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '13 x 4" බෝල්ට් ඇණ (13 x 4" Bolt & Nut) - රු. 50'
  },
  // 7. 17 x 1" බෝල්ට් ඇණ | 100 | RS. 40
  {
    name: '17 x 1" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 40,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '17 x 1" බෝල්ට් ඇණ (17 x 1" Bolt & Nut) - රු. 40'
  },
  // 8. 17 x 1 1/2" බෝල්ට් ඇණ | 100 | RS. 50
  {
    name: '17 x 1 1/2" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 50,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '17 x 1 1/2" බෝල්ට් ඇණ (17 x 1 1/2" Bolt & Nut) - රු. 50'
  },
  // 9. 17 x 2" බෝල්ට් ඇණ | 100 | RS. 60
  {
    name: '17 x 2" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 60,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '17 x 2" බෝල්ට් ඇණ (17 x 2" Bolt & Nut) - රු. 60'
  },
  // 10. 17 x 2 1/2" බෝල්ට් ඇණ | 100 | RS. 70
  {
    name: '17 x 2 1/2" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 70,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '17 x 2 1/2" බෝල්ට් ඇණ (17 x 2 1/2" Bolt & Nut) - රු. 70'
  },
  // 11. 17 x 5" බෝල්ට් ඇණ | 100 | RS. 80
  {
    name: '17 x 5" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 80,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '17 x 5" බෝල්ට් ඇණ (17 x 5" Bolt & Nut) - රු. 80'
  },
  // 12. 19 x 1 1/2" බෝල්ට් ඇණ | 100 | RS. 60
  {
    name: '19 x 1 1/2" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 60,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '19 x 1 1/2" බෝල්ට් ඇණ (19 x 1 1/2" Bolt & Nut) - රු. 60'
  },
  // 13. 19 x 4" බෝල්ට් ඇණ | 100 | RS. 80
  {
    name: '19 x 4" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 80,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '19 x 4" බෝල්ට් ඇණ (19 x 4" Bolt & Nut) - රු. 80'
  },
  // 14. 19 x 5" බෝල්ට් ඇණ | 100 | RS. 95
  {
    name: '19 x 5" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 95,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '19 x 5" බෝල්ට් ඇණ (19 x 5" Bolt & Nut) - රු. 95'
  },
  // 15. 19 x 1" බෝල්ට් ඇණ | 100 | RS. 50
  {
    name: '19 x 1" බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 50,
    qty: 100,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '19 x 1" බෝල්ට් ඇණ (19 x 1" Bolt & Nut) - රු. 50'
  },
  // 16. දිග ඇණ(යකඩ)බෝල්ට් ඇණ | 4 | Rs. 450
  {
    name: 'දිග ඇණ (යකඩ) බෝල්ට් ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'දිග ඇණ (යකඩ) බෝල්ට් ඇණ (Long Iron Bolt) - රු. 450'
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
         SET category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, qty = ?, reorderLevel = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ?
         WHERE id = ?`,
        [item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, existing.id]
      );
      console.log(`🔄 Updated existing item: ID ${existing.id} -> ${item.name} (Qty: ${item.qty}, Price: Rs. ${item.sellPrice})`);
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

  console.log('\n🎉 Batch 22 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
