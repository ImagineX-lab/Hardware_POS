const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. Superlac wood Coating (wallnut) 500ml - 5 - Rs. 2000
  {
    name: 'Superlac wood Coating (wallnut) 500ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'can',
    costPrice: 0,
    sellPrice: 2000,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'can',
    loosePrice: 0,
    description: 'Superlac Wood Coating Walnut 500ml (සුපර්ලැක් වුඩ් කෝටින් වෝල්නට් 500ml) - රු. 2000'
  },
  // 2. Superlac wood Coating (Buruma teak) 500ml - 3 - Rs. 2000
  {
    name: 'Superlac wood Coating (Buruma teak) 500ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'can',
    costPrice: 0,
    sellPrice: 2000,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'can',
    loosePrice: 0,
    description: 'Superlac Wood Coating Burma Teak 500ml (සුපර්ලැක් වුඩ් කෝටින් බුරුම තේක්ක 500ml) - රු. 2000'
  },
  // 3. Superlac wood Coating (mahogani) 500ml - 2 - Rs. 2000
  {
    name: 'Superlac wood Coating (mahogani) 500ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'can',
    costPrice: 0,
    sellPrice: 2000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'can',
    loosePrice: 0,
    description: 'Superlac Wood Coating Mahogany 500ml (සුපර්ලැක් වුඩ් කෝටින් මහෝගනී 500ml) - රු. 2000'
  },
  // 4. Superlac wood Coating (wallnut) 1L - 2 - Rs. 3000
  {
    name: 'Superlac wood Coating (wallnut) 1L',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'can',
    costPrice: 0,
    sellPrice: 3000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'can',
    loosePrice: 0,
    description: 'Superlac Wood Coating Walnut 1L (සුපර්ලැක් වුඩ් කෝටින් වෝල්නට් 1L) - රු. 3000'
  },
  // 5. Superlac wood Coating (Buruma teak) 1L - 3 - Rs. 3000
  {
    name: 'Superlac wood Coating (Buruma teak) 1L',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'can',
    costPrice: 0,
    sellPrice: 3000,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'can',
    loosePrice: 0,
    description: 'Superlac Wood Coating Burma Teak 1L (සුපර්ලැක් වුඩ් කෝටින් බුරුම තේක්ක 1L) - රු. 3000'
  },
  // 6. Superlac wood Coating (mahogani) 1L - 3 - Rs. 3000
  {
    name: 'Superlac wood Coating (mahogani) 1L',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'can',
    costPrice: 0,
    sellPrice: 3000,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'can',
    loosePrice: 0,
    description: 'Superlac Wood Coating Mahogany 1L (සුපර්ලැක් වුඩ් කෝටින් මහෝගනී 1L) - රු. 3000'
  },
  // 7. Superlac wood Coating (wallnut) 4L - 1 - Rs. 11500
  {
    name: 'Superlac wood Coating (wallnut) 4L',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'can',
    costPrice: 0,
    sellPrice: 11500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'can',
    loosePrice: 0,
    description: 'Superlac Wood Coating Walnut 4L (සුපර්ලැක් වුඩ් කෝටින් වෝල්නට් 4L) - රු. 11500'
  },
  // 8. Superlac wood Coating (Buruma teak) 4L - 1 - Rs. 11500
  {
    name: 'Superlac wood Coating (Buruma teak) 4L',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'can',
    costPrice: 0,
    sellPrice: 11500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'can',
    loosePrice: 0,
    description: 'Superlac Wood Coating Burma Teak 4L (සුපර්ලැක් වුඩ් කෝටින් බුරුම තේක්ක 4L) - රු. 11500'
  },
  // 9. Superlac wood Coating (mahogani) 4L - 1 - Rs. 11500
  {
    name: 'Superlac wood Coating (mahogani) 4L',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'can',
    costPrice: 0,
    sellPrice: 11500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'can',
    loosePrice: 0,
    description: 'Superlac Wood Coating Mahogany 4L (සුපර්ලැක් වුඩ් කෝටින් මහෝගනී 4L) - රු. 11500'
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
        [item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'can', item.loosePrice || 0, item.description, existing.id]
      );
      console.log(`🔄 Updated existing item: ID ${existing.id} -> ${item.name} (Qty: ${item.qty}, Price: Rs. ${item.sellPrice})`);
      updated++;
    } else {
      const barcode = generateBarcode(existingBarcodes);
      const res = await run(
        `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, packSize, packUnit, loosePrice, description, image, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'can', item.loosePrice || 0, item.description, Date.now()]
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

  console.log('\n🎉 Batch 18 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
