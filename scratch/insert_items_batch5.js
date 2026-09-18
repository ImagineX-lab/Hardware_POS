const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. බැටරි වතුර 500ml - 17 - Rs. 150
  {
    name: 'බැටරි වතුර 500ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 17,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බැටරි වතුර (Battery Water) 500ml - රු. 150'
  },
  // 2. බැටරි වතුර 1000ml - 30 - Rs. 200
  {
    name: 'බැටරි වතුර 1000ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 200,
    qty: 30,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බැටරි වතුර (Battery Water) 1000ml (1L) - රු. 200'
  },
  // 3. බැටරි වතුර 1500ml - 15 - Rs. 250
  {
    name: 'බැටරි වතුර 1500ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 15,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බැටරි වතුර (Battery Water) 1500ml (1.5L) - රු. 250'
  },
  // 4. බැටරි ඇසිඩ් 500ml - 4 - Rs. 350
  {
    name: 'බැටරි ඇසිඩ් 500ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බැටරි ඇසිඩ් (Battery Acid) 500ml - රු. 350'
  },
  // 5. බැටරි ඇසිඩ් 1500ml - 4 - Rs. 950
  {
    name: 'බැටරි ඇසිඩ් 1500ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බැටරි ඇසිඩ් (Battery Acid) 1500ml (1.5L) - රු. 950'
  },
  // 6. 2 x 10 ඇණ (ස්ක්රව්) - 20 - Rs. 10
  {
    name: '2 x 10 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 20,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2 x 10 ඇණ / ස්කෲ (Screw 2 x 10) - රු. 10'
  },
  // 7. 2 x 8 ඇණ (ස්ක්රව්) - 30 - Rs. 10
  {
    name: '2 x 8 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 30,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2 x 8 ඇණ / ස්කෲ (Screw 2 x 8) - රු. 10'
  },
  // 8. 1 1/2 x 6 ඇණ (ස්ක්රව්) - 100 - Rs. 10
  {
    name: '1 1/2 x 6 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/2 x 6 ඇණ / ස්කෲ (Screw 1 1/2 x 6) - රු. 10'
  },
  // 9. 1 1/4 x 10 ඇණ (ස්ක්රව්) - 100 - Rs. 7
  {
    name: '1 1/4 x 10 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 7,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/4 x 10 ඇණ / ස්කෲ (Screw 1 1/4 x 10) - රු. 7'
  },
  // 10. 1 1/2 x 8 ඇණ (ස්ක්රව්) - 100 - Rs. 7
  {
    name: '1 1/2 x 8 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 7,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/2 x 8 ඇණ / ස්කෲ (Screw 1 1/2 x 8) - රු. 7'
  },
  // 11. 1 x 10 ඇණ (ස්ක්රව්) - 100 - Rs. 6
  {
    name: '1 x 10 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 6,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 x 10 ඇණ / ස්කෲ (Screw 1 x 10) - රු. 6'
  },
  // 12. 1 x 7 ඇණ (ස්ක්රව්) - 100 - Rs. 6
  {
    name: '1 x 7 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 6,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 x 7 ඇණ / ස්කෲ (Screw 1 x 7) - රු. 6'
  },
  // 13. 3/4 x 6 ඇණ (ස්ක්රව්) - 100 - Rs. 4
  {
    name: '3/4 x 6 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3/4 x 6 ඇණ / ස්කෲ (Screw 3/4 x 6) - රු. 4'
  },
  // 14. 3/4 x 8 ඇණ (ස්ක්රව්) - 100 - Rs. 5
  {
    name: '3/4 x 8 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 5,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3/4 x 8 ඇණ / ස්කෲ (Screw 3/4 x 8) - රු. 5'
  },
  // 15. 3/4 x 10 ඇණ (ස්ක්රව්) - 100 - Rs. 5
  {
    name: '3/4 x 10 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 5,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3/4 x 10 ඇණ / ස්කෲ (Screw 3/4 x 10) - රු. 5'
  },
  // 16. 5/8" ඇණ (ස්ක්රව්) - 100 - Rs. 4
  {
    name: '5/8" ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '5/8" ඇණ / ස්කෲ (Screw 5/8") - රු. 4'
  },
  // 17. 1/2" ඇණ (ස්ක්රව්) - 100 - Rs. 2.50
  {
    name: '1/2" ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2.5,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1/2" ඇණ / ස්කෲ (Screw 1/2") - රු. 2.50'
  },
  // 18. 1" ඇණ (ස්ක්රව්) - 100 - Rs. 6
  {
    name: '1" ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 6,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1" ඇණ / ස්කෲ (Screw 1") - රු. 6'
  },
  // 19. 2 1/2 x 10 ඇණ (ස්ක්රව්) - 50 - Rs. 12
  {
    name: '2 1/2 x 10 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 12,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2 1/2 x 10 ඇණ / ස්කෲ (Screw 2 1/2 x 10) - රු. 12'
  },
  // 20. 2 1/2 x 8 ඇණ (ස්ක්රව්) - 50 - Rs. 12
  {
    name: '2 1/2 x 8 ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 12,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2 1/2 x 8 ඇණ / ස්කෲ (Screw 2 1/2 x 8) - රු. 12'
  },
  // 21. 3" ඇණ (ස්ක්රව්) - 50 - Rs. 15
  {
    name: '3" ඇණ (ස්ක්රව්)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3" ඇණ / ස්කෲ (Screw 3") - රු. 15'
  },
  // 22. 2" ඇණ (ස්ක්රව්) Atlas - 50 - Rs. 10
  {
    name: '2" ඇණ (ස්ක්රව්) Atlas',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2" ඇණ / ස්කෲ Atlas (Screw 2" Atlas) - රු. 10'
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
      console.log(`✅ Added new item: ID ${res.lastID} -> ${item.name} | Barcode: ${barcode} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice}`);
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

  console.log('\n🎉 Batch 5 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
