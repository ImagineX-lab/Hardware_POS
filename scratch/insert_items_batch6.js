const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 8 වොෂර් (පොඩි) - Rs. 3
  {
    name: '8 වොෂර් (පොඩි)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '8 වොෂර් පොඩි (Washer 8 Small) - රු. 3'
  },
  // 2. 8 වොෂර් (ලොකු) - Rs. 5
  {
    name: '8 වොෂර් (ලොකු)',
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
    description: '8 වොෂර් ලොකු (Washer 8 Large) - රු. 5'
  },
  // 3. 10 වොෂර් (පොඩි) - Rs. 3
  {
    name: '10 වොෂර් (පොඩි)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '10 වොෂර් පොඩි (Washer 10 Small) - රු. 3'
  },
  // 4. 10 වොෂර් (ලොකු) - Rs. 5
  {
    name: '10 වොෂර් (ලොකු)',
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
    description: '10 වොෂර් ලොකු (Washer 10 Large) - රු. 5'
  },
  // 5. 10 වොෂර් ඝනකම් - Rs. 10
  {
    name: '10 වොෂර් ඝනකම්',
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
    description: '10 වොෂර් ඝනකම් / සනකම් (Washer 10 Thick) - රු. 10'
  },
  // 6. 12 වොෂර් (පොඩි) - Rs. 5
  {
    name: '12 වොෂර් (පොඩි)',
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
    description: '12 වොෂර් පොඩි (Washer 12 Small) - රු. 5'
  },
  // 7. 12 වොෂර් (ලොකු) - Rs. 10
  {
    name: '12 වොෂර් (ලොකු)',
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
    description: '12 වොෂර් ලොකු (Washer 12 Large) - රු. 10'
  },
  // 8. නූල් තුන වොෂර් - Rs. 15
  {
    name: 'නූල් තුන වොෂර්',
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
    description: 'නූල් තුන වොෂර් (Washer 3/8") - රු. 15'
  },
  // 9. නූල් හතර වොෂර් - Rs. 15
  {
    name: 'නූල් හතර වොෂර්',
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
    description: 'නූල් හතර වොෂර් (Washer 1/2") - රු. 15'
  },
  // 10. නූල් පහ වොෂර් - Rs. 15
  {
    name: 'නූල් පහ වොෂර්',
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
    description: 'නූල් පහ වොෂර් (Washer 5/8") - රු. 15'
  },
  // 11. 90 වොෂර් - Rs. 90
  {
    name: '90 වොෂර්',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 90,
    qty: 0,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '90 වොෂර් (Washer 90) - රු. 90'
  },
  // 12. ස්ප්රින්ග් වොෂර් 8 - Rs. 5
  {
    name: 'ස්ප්රින්ග් වොෂර් 8',
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
    description: 'ස්ප්‍රින්ග් වොෂර් 8 (Spring Washer 8mm) - රු. 5'
  },
  // 13. ස්ප්රින්ග් වොෂර් 10 - Rs. 5
  {
    name: 'ස්ප්රින්ග් වොෂර් 10',
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
    description: 'ස්ප්‍රින්ග් වොෂර් 10 (Spring Washer 10mm) - රු. 5'
  },
  // 14. ස්ප්රින්ග් වොෂර් 12 - Rs. 5
  {
    name: 'ස්ප්රින්ග් වොෂර් 12',
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
    description: 'ස්ප්‍රින්ග් වොෂර් 12 (Spring Washer 12mm) - රු. 5'
  },
  // 15. ස්ප්රින්ග් වොෂර් නූල් 3 - Rs. 10
  {
    name: 'ස්ප්රින්ග් වොෂර් නූල් 3',
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
    description: 'ස්ප්‍රින්ග් වොෂර් නූල් 3 (Spring Washer 3/8") - රු. 10'
  },
  // 16. ස්ප්රින්ග් වොෂර් නූල් 4 - Rs. 10
  {
    name: 'ස්ප්රින්ග් වොෂර් නූල් 4',
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
    description: 'ස්ප්‍රින්ග් වොෂර් නූල් 4 (Spring Washer 1/2") - රු. 10'
  },
  // 17. ස්ප්රින්ග් වොෂර් නූල් 6 - Rs. 15
  {
    name: 'ස්ප්රින්ග් වොෂර් නූල් 6',
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
    description: 'ස්ප්‍රින්ග් වොෂර් නූල් 6 (Spring Washer 3/4") - රු. 15'
  },
  // 18. ස්ප්රින්ග් වොෂර් ඝනකම් - Rs. 25
  {
    name: 'ස්ප්රින්ග් වොෂර් ඝනකම්',
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
    description: 'ස්ප්‍රින්ග් වොෂර් ඝනකම් / සනකම් (Spring Washer Heavy/Thick) - රු. 25'
  },
  // 19. 1/2 ස්විච් ඇණ - Rs. 6
  {
    name: '1/2 ස්විච් ඇණ',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 6,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1/2 ස්විච් ඇණ (Switch Screw 1/2") - රු. 6'
  },
  // 20. 1 1/2 ස්විච් ඇණ - Rs. 15
  {
    name: '1 1/2 ස්විච් ඇණ',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/2 ස්විච් ඇණ (Switch Screw 1 1/2") - රු. 15'
  },
  // 21. 2 ස්විච් ඇණ - Rs. 20
  {
    name: '2 ස්විච් ඇණ',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 20,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2 ස්විච් ඇණ (Switch Screw 2") - රු. 20'
  },
  // 22. 1 ස්විච් ඇණ - Rs. 10
  {
    name: '1 ස්විච් ඇණ',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 0,
    reorderLevel: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 ස්විච් ඇණ (Switch Screw 1") - රු. 10'
  },
  // 23. සුදු යකඩ මල් ඇණ 3/4 - Rs. 35
  {
    name: 'සුදු යකඩ මල් ඇණ 3/4',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 35,
    qty: 0,
    reorderLevel: 30,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සුදු යකඩ මල් ඇණ 3/4 (Stainless Steel Decorative Screw 3/4") - රු. 35'
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

  console.log('\n🎉 Batch 6 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
