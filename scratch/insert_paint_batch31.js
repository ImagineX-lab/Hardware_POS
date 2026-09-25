const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. Seelar (Jack wood) J CHEM 500ml | 2 | 1300
  {
    name: 'Sealer (Jackwood) J CHEM 500ml',
    matchNames: [
      'Seelar (Jack wood) J CHEM 500ml',
      'Sealer (Jackwood) J CHEM 500ml',
      'Sealer (Jack wood) J CHEM 500ml',
      'Seelar (Jackwood) J CHEM 500ml',
      'jchem sealer jackwood 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1300,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Wood Sealer Jackwood 500ml (ජයකෙම් කොස් පැහැ සීලර් 500ml) - රු. 1,300'
  },
  // 2. Seelar (Teak) J CHEM 500ml | 3 | 1100
  {
    name: 'Sealer (Teak) J CHEM 500ml',
    matchNames: [
      'Seelar (Teak) J CHEM 500ml',
      'Sealer (Teak) J CHEM 500ml',
      'jchem sealer teak 500ml',
      'Seelar (Teak) JCHEM 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Wood Sealer Teak 500ml (ජයකෙම් තේක්ක පැහැ සීලර් 500ml) - රු. 1,100'
  },
  // 3. Seelar (Y) J CHEM 500ml | 1 | 1200
  {
    name: 'Sealer (Y) J CHEM 500ml',
    matchNames: [
      'Seelar (Y) J CHEM 500ml',
      'Sealer (Y) J CHEM 500ml',
      'jchem sealer (y) 500ml',
      'Seelar (Y) JCHEM 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Sanding Sealer (Y) 500ml (ජයකෙම් සීලර් 500ml) - රු. 1,200'
  },
  // 4. Seelar (Mho) J CHEM 500ml | 3 | 1300
  {
    name: 'Sealer (Mahogani) J CHEM 500ml',
    matchNames: [
      'Seelar (Mho) J CHEM 500ml',
      'Sealer (Mho) J CHEM 500ml',
      'Sealer (Mahogani) J CHEM 500ml',
      'Seelar (Mahogani) J CHEM 500ml',
      'jchem sealer mahogani 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1300,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Wood Sealer Mahogani 500ml (ජයකෙම් මහෝගනී පැහැ සීලර් 500ml) - රු. 1,300'
  },
  // 5. Varnish (Super) J CHEM 500ml | 1 | 1100
  {
    name: 'Varnish (Super) J CHEM 500ml',
    matchNames: [
      'Varnish (Super) J CHEM 500ml',
      'Varnish (Super) JCHEM 500ml',
      'jchem varnish super 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Super Varnish 500ml (ජයකෙම් සුපර් වාර්නිෂ් 500ml) - රු. 1,100'
  },
  // 6. Varnish (Teak) J CHEM 500ml | 5 | 1100
  {
    name: 'Varnish (Teak) J CHEM 500ml',
    matchNames: [
      'Varnish (Teak) J CHEM 500ml',
      'Varnish (Teak) JCHEM 500ml',
      'jchem varnish teak 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Varnish Teak 500ml (ජයකෙම් තේක්ක පැහැ වාර්නිෂ් 500ml) - රු. 1,100'
  },
  // 7. Varnish (Maho) J CHEM 500ml | 4 | 1100
  {
    name: 'Varnish (Mahogani) J CHEM 500ml',
    matchNames: [
      'Varnish (Maho) J CHEM 500ml',
      'Varnish (Mahogani) J CHEM 500ml',
      'Varnish (Mahogany) J CHEM 500ml',
      'jchem varnish maho 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Varnish Mahogani 500ml (ජයකෙම් මහෝගනී පැහැ වාර්නිෂ් 500ml) - රු. 1,100'
  },
  // 8. Varnish (J/W) J CHEM 500ml | 1 | 1200
  {
    name: 'Varnish (Jackwood) J CHEM 500ml',
    matchNames: [
      'Varnish (J/W) J CHEM 500ml',
      'Varnish (JW) J CHEM 500ml',
      'Varnish (Jackwood) J CHEM 500ml',
      'jchem varnish jackwood 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Varnish Jackwood 500ml (ජයකෙම් කොස් පැහැ වාර්නිෂ් 500ml) - රු. 1,200'
  },
  // 9. Varnish (Super) J CHEM 1L | 6 | 2200
  {
    name: 'Varnish (Super) J CHEM 1L',
    matchNames: [
      'Varnish (Super) J CHEM 1L',
      'Varnish (Super) JCHEM 1L',
      'Varnish (Super) J CHEM 1l',
      'jchem varnish super 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Super Varnish 1L (ජයකෙම් සුපර් වාර්නිෂ් 1L) - රු. 2,200'
  },
  // 10. Varnish (J/W) J CHEM 1L | 2 | 2300
  {
    name: 'Varnish (Jackwood) J CHEM 1L',
    matchNames: [
      'Varnish (J/W) J CHEM 1L',
      'Varnish (JW) J CHEM 1L',
      'Varnish (Jackwood) J CHEM 1L',
      'jchem varnish jackwood 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2300,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Varnish Jackwood 1L (ජයකෙම් කොස් පැහැ වාර්නිෂ් 1L) - රු. 2,300'
  },
  // 11. Varnish (Teak) J CHEM 1L | 3 | 2100
  {
    name: 'Varnish (Teak) J CHEM 1L',
    matchNames: [
      'Varnish (Teak) J CHEM 1L',
      'Varnish (Teak) JCHEM 1L',
      'jchem varnish teak 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2100,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'J CHEM Varnish Teak 1L (ජයකෙම් තේක්ක පැහැ වාර්නිෂ් 1L) - රු. 2,100'
  },
  // 12. Varnish (Teak) NEPTUNE 1L | 6 | 2500
  {
    name: 'Varnish (Teak) NEPTUNE 1L',
    matchNames: [
      'Varnish (Teak) NEPTUNE 1L',
      'Varnish (Teak) Neptune 1L',
      'neptune varnish teak 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Neptune Varnish Teak 1L (නෙප්චූන් තේක්ක පැහැ වාර්නිෂ් 1L) - රු. 2,500'
  },
  // 13. Varnish (Teak) NEPTUNE 500ml | 2 | 1400
  {
    name: 'Varnish (Teak) NEPTUNE 500ml',
    matchNames: [
      'Varnish (Teak) NEPTUNE 500ml',
      'Varnish (Teak) Neptune 500ml',
      'neptune varnish teak 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1400,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Neptune Varnish Teak 500ml (නෙප්චූන් තේක්ක පැහැ වාර්නිෂ් 500ml) - රු. 1,400'
  },
  // 14. Varnish (Maho) Robialac 1L | 2 | 2500
  {
    name: 'Varnish (Mahogani) Robbialac 1L',
    matchNames: [
      'Varnish (Maho) Robialac 1L',
      'Varnish (Maho) Robbialac 1L',
      'Varnish (Mahogani) Robbialac 1L',
      'robbialac varnish maho 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robbialac Varnish Mahogani 1L (රොබියලැක් මහෝගනී පැහැ වාර්නිෂ් 1L) - රු. 2,500'
  },
  // 15. Varnish (Maho) naturer paint 1L | 3 | 2200
  {
    name: 'Varnish (Mahogani) Nature Paint 1L',
    matchNames: [
      'Varnish (Maho) naturer paint 1L',
      'Varnish (Maho) nature paint 1L',
      'Varnish (Mahogani) Nature Paint 1L',
      'nature paint varnish maho 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Nature Paint Varnish Mahogani 1L (නේචර් පේන්ට් මහෝගනී පැහැ වාර්නිෂ් 1L) - රු. 2,200'
  },
  // 16. Varnish (Teak) naturer paint 1L | 1 | 2200
  {
    name: 'Varnish (Teak) Nature Paint 1L',
    matchNames: [
      'Varnish (Teak) naturer paint 1L',
      'Varnish (Teak) nature paint 1L',
      'Varnish (Teak) Nature Paint 1L',
      'nature paint varnish teak 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Nature Paint Varnish Teak 1L (නේචර් පේන්ට් තේක්ක පැහැ වාර්නිෂ් 1L) - රු. 2,200'
  },
  // 17. (B) ROYAL 400g | 2 | 1200
  {
    name: '(B) ROYAL 400g',
    matchNames: [
      '(B) ROYAL 400g',
      '(B) Royal 400g',
      'Royal (B) 400g',
      'royal b 400g',
      'Royal Putty 400g'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'Filler',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Royal Body Filler / Putty (B) 400g (රෝයල් පොටි 400g) - රු. 1,200'
  },
  // 18. (B) ROYAL 800g | 1 | 1600
  {
    name: '(B) ROYAL 800g',
    matchNames: [
      '(B) ROYAL 800g',
      '(B) Royal 800g',
      'Royal (B) 800g',
      'royal b 800g',
      'Royal Putty 800g'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'Filler',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1600,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Royal Body Filler / Putty (B) 800g (රෝයල් පොටි 800g) - රු. 1,600'
  },
  // 19. Catloy Top Cut 500ml | 2 | 1000
  {
    name: 'Catloy Top Cut 500ml',
    matchNames: [
      'Catloy Top Cut 500ml',
      'Cutloy Top Cut 500ml',
      'Catloy Top Cut 500 ml',
      'catloy top cut 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Catloy Top Cut Rubbing Compound 500ml (කැට්ලෝයි ටොප් කට් 500ml) - රු. 1,000'
  },
  // 20. Catloy Soft Cut 500g | 1 | 1000
  {
    name: 'Catloy Soft Cut 500g',
    matchNames: [
      'Catloy Soft Cut 500g',
      'Cutloy Soft Cut 500g',
      'Catloy Soft Cut 500 g',
      'catloy soft cut 500g'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Catloy Soft Cut Body Filler / Compound 500g (කැට්ලෝයි සොෆ්ට් කට් 500g) - රු. 1,000'
  },
  // 21. Epoxy Floor paint 1kg (R) | 3 | 5500
  {
    name: 'Epoxy Floor Paint 1kg (R)',
    matchNames: [
      'Epoxy Floor paint 1kg (R)',
      'Epoxy Floor Paint 1kg (R)',
      'Epoxy Floor Paint 1kg Red',
      'epoxy floor paint 1kg (r)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 5500,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Epoxy Floor Paint 1kg Red (ඉපොක්සි ෆ්ලෝ පේන්ට් 1kg රතු) - රු. 5,500'
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
      await run(
        `UPDATE items 
         SET name = ?, barcode = ?, category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, qty = ?, reorderLevel = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ?
         WHERE id = ?`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, existing.id]
      );
      console.log(`🔄 Updated item: ID ${existing.id} -> ${item.name} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice} | Barcode: ${barcode}`);
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

  console.log('\n🎉 Batch 31 Varnish, Sealer, Putty & Epoxy items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
