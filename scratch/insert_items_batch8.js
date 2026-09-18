const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. රෝල් ප්ලග් 5, 6 - 100 - Rs. 3
  {
    name: 'රෝල් ප්ලග් 5, 6',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'රෝල් ප්ලග් 5, 6 (Wall / Rawl Plug No. 5, 6) - රු. 3'
  },
  // 2. රෝල් ප්ලග් 7, 8 - 100 - Rs. 5
  {
    name: 'රෝල් ප්ලග් 7, 8',
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
    description: 'රෝල් ප්ලග් 7, 8 (Wall / Rawl Plug No. 7, 8) - රු. 5'
  },
  // 3. රෝල් ප්ලග් 10, 15 - 100 - Rs. 15
  {
    name: 'රෝල් ප්ලග් 10, 15',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'රෝල් ප්ලග් 10, 15 (Wall / Rawl Plug No. 10, 15) - රු. 15'
  },
  // 4. රෝල් ප්ලග් 12 - 100 - Rs. 20
  {
    name: 'රෝල් ප්ලග් 12',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 20,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'රෝල් ප්ලග් 12 (Wall / Rawl Plug No. 12) - රු. 20'
  },
  // 5. French polish 750ml - 4 - Rs. 1585
  {
    name: 'French polish 750ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1585,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'French Polish 750ml (ෆ්‍රෙන්ච් පොලිෂ් 750ml) - රු. 1585'
  },
  // 6. Thinner Super 750ml - 5 - Rs. 875
  {
    name: 'Thinner Super 750ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'ටිනර්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 875,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Thinner Super 750ml (ටිනර් සුපර් 750ml) - රු. 875'
  },
  // 7. Thinner Super 180ml - 19 - Rs. 270
  {
    name: 'Thinner Super 180ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'ටිනර්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 270,
    qty: 19,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Thinner Super 180ml (ටිනර් සුපර් 180ml) - රු. 270'
  },
  // 8. Brasso 100ml - 1 - Rs. 440
  {
    name: 'Brasso 100ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 440,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Brasso Metal Polish 100ml (බ්‍රැසෝ 100ml) - රු. 440'
  },
  // 9. Mahogany polish 180ml - 1 - Rs. 525
  {
    name: 'Mahogany polish 180ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 525,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Mahogany Polish 180ml (මහෝගනී පොලිෂ් 180ml) - රු. 525'
  },
  // 10. ග්රීස් 900g - 1 - Rs. 2050
  {
    name: 'ග්රීස් 900g',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'තෙල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2050,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ග්‍රීස් 900g (Grease 900g) - රු. 2050'
  },
  // 11. ග්රීස් 500g - 2 - Rs. 1080
  {
    name: 'ග්රීස් 500g',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'තෙල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1080,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ග්‍රීස් 500g (Grease 500g) - රු. 1080'
  },
  // 12. ග්රීස් 50g - 11 - Rs. 220
  {
    name: 'ග්රීස් 50g',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'තෙල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 220,
    qty: 11,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ග්‍රීස් 50g (Grease 50g) - රු. 220'
  },
  // 13. ග්රීස් 100g - 10 - Rs. 320
  {
    name: 'ග්රීස් 100g',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'තෙල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 320,
    qty: 10,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ග්‍රීස් 100g (Grease 100g) - රු. 320'
  },
  // 14. Thinner Super 375ml - 1 - Rs. 490
  {
    name: 'Thinner Super 375ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'ටිනර්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 490,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Thinner Super 375ml (ටිනර් සුපර් 375ml) - රු. 490'
  },
  // 15. Terpentine (Colormax) 750ml - 5 - Rs. 620
  {
    name: 'Terpentine (Colormax) 750ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'ටිනර්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 620,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ටර්පන්ටයින් (Terpentine Colormax 750ml) - රු. 620'
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

  console.log('\n🎉 Batch 8 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
