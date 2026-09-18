const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. සුදු ගැල්වනිස් බෝල්ට් ඇණ 1/2 (8mm) - Rs. 5
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1/2 (8mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 5,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1/2" (8mm) - Galvanized Bolt Screw 1/2" 8mm - රු. 5'
  },
  // 2. සුදු ගැල්වනිස් බෝල්ට් ඇණ 3/4 (8mm) - Rs. 7
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 3/4 (8mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 7,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 3/4" (8mm) - Galvanized Bolt Screw 3/4" 8mm - රු. 7'
  },
  // 3. සුදු ගැල්වනිස් බෝල්ට් ඇණ 1 (8mm) - Rs. 10
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1 (8mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1" (8mm) - Galvanized Bolt Screw 1" 8mm - රු. 10'
  },
  // 4. සුදු ගැල්වනිස් බෝල්ට් ඇණ 1 1/2 (8mm) - Rs. 15
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1 1/2 (8mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1 1/2" (8mm) - Galvanized Bolt Screw 1 1/2" 8mm - රු. 15'
  },
  // 5. සුදු ගැල්වනිස් බෝල්ට් ඇණ 2 (8mm) - Rs. 20
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 2 (8mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 20,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 2" (8mm) - Galvanized Bolt Screw 2" 8mm - රු. 20'
  },
  // 6. සුදු ගැල්වනිස් බෝල්ට් ඇණ 2 1/2 (8mm) - Rs. 20
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 2 1/2 (8mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 20,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 2 1/2" (8mm) - Galvanized Bolt Screw 2 1/2" 8mm - රු. 20'
  },
  // 7. සුදු ගැල්වනිස් බෝල්ට් ඇණ 3 (8mm) - Rs. 25
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 3 (8mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 25,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 3" (8mm) - Galvanized Bolt Screw 3" 8mm - රු. 25'
  },
  // 8. සුදු ගැල්වනිස් බෝල්ට් ඇණ 1/2 (10mm) - Rs. 10
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1/2 (10mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1/2" (10mm) - Galvanized Bolt Screw 1/2" 10mm - රු. 10'
  },
  // 9. සුදු ගැල්වනිස් බෝල්ට් ඇණ 3/4 (10mm) - Rs. 10
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 3/4 (10mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 3/4" (10mm) - Galvanized Bolt Screw 3/4" 10mm - රු. 10'
  },
  // 10. සුදු ගැල්වනිස් බෝල්ට් ඇණ 1 (10mm) - Rs. 15
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1 (10mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1" (10mm) - Galvanized Bolt Screw 1" 10mm - රු. 15'
  },
  // 11. සුදු ගැල්වනිස් බෝල්ට් ඇණ 1 1/2 (10mm) - Rs. 20
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1 1/2 (10mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 20,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 1 1/2" (10mm) - Galvanized Bolt Screw 1 1/2" 10mm - රු. 20'
  },
  // 12. සුදු ගැල්වනිස් බෝල්ට් ඇණ 2 (10mm) - Rs. 25
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 2 (10mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 25,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 2" (10mm) - Galvanized Bolt Screw 2" 10mm - රු. 25'
  },
  // 13. සුදු ගැල්වනිස් බෝල්ට් ඇණ 2 1/2 (10mm) - Rs. 30
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 2 1/2 (10mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 30,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 2 1/2" (10mm) - Galvanized Bolt Screw 2 1/2" 10mm - රු. 30'
  },
  // 14. සුදු ගැල්වනිස් බෝල්ට් ඇණ 3 (10mm) - Rs. 40
  {
    name: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 3 (10mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 40,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු ගැල්වනිස් බෝල්ට් ඇණ 3" (10mm) - Galvanized Bolt Screw 3" 10mm - රු. 40'
  },
  // 15. සුදු යකඩ මල් ඇණ 1 (8mm) - Rs. 20
  {
    name: 'සුදු යකඩ මල් ඇණ 1 (8mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 20,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු යකඩ මල් ඇණ 1" (8mm) - SS Decorative Screw 1" 8mm - රු. 20'
  },
  // 16. සුදු යකඩ මල් ඇණ 1 1/2 (8mm) - Rs. 30
  {
    name: 'සුදු යකඩ මල් ඇණ 1 1/2 (8mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 30,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු යකඩ මල් ඇණ 1 1/2" (8mm) - SS Decorative Screw 1 1/2" 8mm - රු. 30'
  },
  // 17. සුදු යකඩ මල් ඇණ 1 (10mm) - Rs. 25
  {
    name: 'සුදු යකඩ මල් ඇණ 1 (10mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 25,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු යකඩ මල් ඇණ 1" (10mm) - SS Decorative Screw 1" 10mm - රු. 25'
  },
  // 18. සුදු යකඩ මල් ඇණ 1 1/2 (10mm) - Rs. 30
  {
    name: 'සුදු යකඩ මල් ඇණ 1 1/2 (10mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 30,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු යකඩ මල් ඇණ 1 1/2" (10mm) - SS Decorative Screw 1 1/2" 10mm - රු. 30'
  },
  // 19. සුදු යකඩ මල් ඇණ 3/4 (12mm) - Rs. 25
  {
    name: 'සුදු යකඩ මල් ඇණ 3/4 (12mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 25,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු යකඩ මල් ඇණ 3/4" (12mm) - SS Decorative Screw 3/4" 12mm - රු. 25'
  },
  // 20. සුදු යකඩ මල් ඇණ 1 1/2 (12mm) - Rs. 40
  {
    name: 'සුදු යකඩ මල් ඇණ 1 1/2 (12mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 40,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු යකඩ මල් ඇණ 1 1/2" (12mm) - SS Decorative Screw 1 1/2" 12mm - රු. 40'
  },
  // 21. නෙට් කොකු 3/4 - Rs. 15
  {
    name: 'නෙට් කොකු 3/4',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නෙට් කොකු 3/4" (Net Hook 3/4") - රු. 15'
  },
  // 22. නෙට් කොකු 1 - Rs. 25
  {
    name: 'නෙට් කොකු 1',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 25,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නෙට් කොකු 1" (Net Hook 1") - රු. 25'
  },
  // 23. නෙට් කොකු 1/2 - Rs. 10
  {
    name: 'නෙට් කොකු 1/2',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නෙට් කොකු 1/2" (Net Hook 1/2") - රු. 10'
  },
  // 24. නෙට් කොකු 1/4 - Rs. 5
  {
    name: 'නෙට් කොකු 1/4',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 5,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නෙට් කොකු 1/4" (Net Hook 1/4") - රු. 5'
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
        [item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, existing.id]
      );
      console.log(`🔄 Updated existing item: ID ${existing.id} -> ${item.name} (Price: Rs. ${item.sellPrice})`);
      updated++;
    } else {
      const barcode = generateBarcode(existingBarcodes);
      const res = await run(
        `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, packSize, packUnit, loosePrice, description, image, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, Date.now()]
      );
      console.log(`✅ Added new item: ID ${res.lastID} -> ${item.name} | Barcode: ${barcode} | Price: Rs. ${item.sellPrice}`);
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

  console.log('\n🎉 Batch 7 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
