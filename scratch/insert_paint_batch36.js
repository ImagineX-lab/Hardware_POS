const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. EPIFIX (Resing) 230g | 5 | 1500
  {
    name: 'EPIFIX (Resin) 230g',
    matchNames: [
      'EPIFIX (Resin) 230g',
      'EPIFIX (Resing) 230g',
      'epifix (resing) 230g',
      'Epifix Resin 230g',
      'EPIFIX Resin 230g'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'EPIFIX Epoxy Resin 230g (එපිෆික්ස් ඉපොක්සි රෙසින් 230g) - රු. 1,500'
  },
  // 2. EPIFIX (Hardener) 230g | 4 | 1500
  {
    name: 'EPIFIX (Hardener) 230g',
    matchNames: [
      'EPIFIX (Hardener) 230g',
      'epifix (hardener) 230g',
      'Epifix Hardener 230g',
      'EPIFIX Hardener 230g'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'EPIFIX Epoxy Hardener 230g (එපිෆික්ස් හාඩ්නර් 230g) - රු. 1,500'
  },
  // 3. EPIFIX (Resing) 500g | 6 | 2750
  {
    name: 'EPIFIX (Resin) 500g',
    matchNames: [
      'EPIFIX (Resin) 500g',
      'EPIFIX (Resing) 500g',
      'epifix (resing) 500g',
      'Epifix Resin 500g',
      'EPIFIX Resin 500g'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2750,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'EPIFIX Epoxy Resin 500g (එපිෆික්ස් ඉපොක්සි රෙසින් 500g) - රු. 2,750'
  },
  // 4. EPIFIX (Hardener) 500g | 6 | 2750
  {
    name: 'EPIFIX (Hardener) 500g',
    matchNames: [
      'EPIFIX (Hardener) 500g',
      'epifix (hardener) 500g',
      'Epifix Hardener 500g',
      'EPIFIX Hardener 500g'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2750,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'EPIFIX Epoxy Hardener 500g (එපිෆික්ස් හාඩ්නර් 500g) - රු. 2,750'
  },
  // 5. Elephant (Resing) 230g | 5 | 1400
  {
    name: 'Elephant (Resin) 230g',
    matchNames: [
      'Elephant (Resin) 230g',
      'Elephant (Resing) 230g',
      'elephant (resing) 230g',
      'Elephant Resin 230g'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1400,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Elephant Epoxy Resin 230g (එලිෆන්ට් ඉපොක්සි රෙසින් 230g) - රු. 1,400'
  },
  // 6. Elephant (Hardener) 230g | 5 | 1400
  {
    name: 'Elephant (Hardener) 230g',
    matchNames: [
      'Elephant (Hardener) 230g',
      'elephant (hardener) 230g',
      'Elephant Hardener 230g'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1400,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Elephant Epoxy Hardener 230g (එලිෆන්ට් හාඩ්නර් 230g) - රු. 1,400'
  },
  // 7. Elephant (Resing) 1kg | 2 | 4700
  {
    name: 'Elephant (Resin) 1kg',
    matchNames: [
      'Elephant (Resin) 1kg',
      'Elephant (Resing) 1kg',
      'elephant (resing) 1kg',
      'Elephant Resin 1kg'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4700,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Elephant Epoxy Resin 1kg (එලිෆන්ට් ඉපොක්සි රෙසින් 1kg) - රු. 4,700'
  },
  // 8. Elephant (Hardner) 1kg | 2 | 4700
  {
    name: 'Elephant (Hardener) 1kg',
    matchNames: [
      'Elephant (Hardener) 1kg',
      'Elephant (Hardner) 1kg',
      'elephant (hardner) 1kg',
      'Elephant Hardener 1kg'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4700,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Elephant Epoxy Hardener 1kg (එලිෆන්ට් හාඩ්නර් 1kg) - රු. 4,700'
  },
  // 9. E/M (E/G) purlac 4L | 2 | 6000
  {
    name: 'E/M (E/G) Purelac 4L',
    matchNames: [
      'E/M (E/G) Purelac 4L',
      'E/M (E/G) purlac 4L',
      'e/m (e/g) purlac 4l',
      'Purelac E/M (E/G) 4L',
      'Purelac (E/G) 4L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 6000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Emulsion Paint (E/G) 4L (පියුර්ලැක් එමල්ෂන් සායම් 4L) - රු. 6,000'
  },
  // 10. E/M (R) Relose 4L | 2 | 7500
  {
    name: 'E/M (R) Reoluse 4L',
    matchNames: [
      'E/M (R) Reoluse 4L',
      'E/M (R) Relose 4L',
      'e/m (r) relose 4l',
      'E/M (R) Reoluxe 4L',
      'Reoluse E/M (R) 4L',
      'Reoluxe E/M (R) 4L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 7500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Emulsion Paint Red (R) 4L (රියෝලක්ස් එමල්ෂන් රතු සායම් 4L) - රු. 7,500'
  },
  // 11. JAT (A/W) Cleanning Coat 4L | 2 | 15000
  {
    name: 'JAT (A/W) Cleaning Coat 4L',
    matchNames: [
      'JAT (A/W) Cleaning Coat 4L',
      'JAT (A/W) Cleanning Coat 4L',
      'jat (a/w) cleanning coat 4l',
      'JAT Cleaning Coat (A/W) 4L',
      'JAT Cleanning Coat (A/W) 4L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT Cleaning Coat (A/W) 4L (JAT ක්ලීනින් කෝට් 4L) - රු. 15,000'
  },
  // 12. JAT (M) Cleanning Coat 4L | 1 | 15000
  {
    name: 'JAT (M) Cleaning Coat 4L',
    matchNames: [
      'JAT (M) Cleaning Coat 4L',
      'JAT (M) Cleanning Coat 4L',
      'jat (m) cleanning coat 4l',
      'JAT Cleaning Coat (M) 4L',
      'JAT Cleanning Coat (M) 4L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT Cleaning Coat (M) 4L (JAT ක්ලීනින් කෝට් 4L) - රු. 15,000'
  },
  // 13. JAT (H) Cleanning Coat 4L | 2 | 15000
  {
    name: 'JAT (H) Cleaning Coat 4L',
    matchNames: [
      'JAT (H) Cleaning Coat 4L',
      'JAT (H) Cleanning Coat 4L',
      'jat (h) cleanning coat 4l',
      'JAT Cleaning Coat (H) 4L',
      'JAT Cleanning Coat (H) 4L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT Cleaning Coat (H) 4L (JAT ක්ලීනින් කෝට් 4L) - රු. 15,000'
  },
  // 14. JAT (H) Cleanning Coat 1L | 2 | 4500
  {
    name: 'JAT (H) Cleaning Coat 1L',
    matchNames: [
      'JAT (H) Cleaning Coat 1L',
      'JAT (H) Cleanning Coat 1L',
      'jat (h) cleanning coat 1l',
      'JAT Cleaning Coat (H) 1L',
      'JAT Cleanning Coat (H) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT Cleaning Coat (H) 1L (JAT ක්ලීනින් කෝට් 1L) - රු. 4,500'
  },
  // 15. JAT (Mho) Cleanning Coat 1L | 3 | 4500
  {
    name: 'JAT (Mho) Cleaning Coat 1L',
    matchNames: [
      'JAT (Mho) Cleaning Coat 1L',
      'JAT (Mho) Cleanning Coat 1L',
      'jat (mho) cleanning coat 1l',
      'JAT Cleaning Coat Mahogani 1L',
      'JAT Cleanning Coat (Mho) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4500,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT Cleaning Coat Mahogani (Mho) 1L (JAT ක්ලීනින් කෝට් මහෝගනී 1L) - රු. 4,500'
  },
  // 16. JAT (A/W) Cleanning Coat 1L | 2 | 4500
  {
    name: 'JAT (A/W) Cleaning Coat 1L',
    matchNames: [
      'JAT (A/W) Cleaning Coat 1L',
      'JAT (A/W) Cleanning Coat 1L',
      'jat (a/w) cleanning coat 1l',
      'JAT Cleaning Coat (A/W) 1L',
      'JAT Cleanning Coat (A/W) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT Cleaning Coat (A/W) 1L (JAT ක්ලීනින් කෝට් 1L) - රු. 4,500'
  },
  // 17. Opel NC wood stain 1L (Teak) | 9 + 1 = 10 | 2200
  {
    name: 'Opel NC Wood Stain 1L (Teak)',
    matchNames: [
      'Opel NC Wood Stain 1L (Teak)',
      'Opel NC wood stain 1L (Teak)',
      'opel NC wood stain 1L (Teak)',
      'opel nc wood stain 1l (teak)',
      'Opel Wood Stain Teak 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 10, // 9 + 1 = 10
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Opel NC Wood Stain 1L Teak (ඔපෙල් NC වුඩ් ස්ටේන් තේක්ක 1L) - රු. 2,200'
  },
  // 18. SAYLACK 1L | 4 | 4000
  {
    name: 'Saylack 1L',
    matchNames: [
      'Saylack 1L',
      'SAYLACK 1L',
      'saylack 1l',
      'Sayerlack 1L',
      'SAYERLACK 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Saylack Wood Coating / Finish 1L (සේලැක් දැව ආලේපනය 1L) - රු. 4,000'
  },
  // 19. SAYLACK (JAT) 1L | 1 | 7500
  {
    name: 'Saylack (JAT) 1L',
    matchNames: [
      'Saylack (JAT) 1L',
      'SAYLACK (JAT) 1L',
      'saylack (jat) 1l',
      'Sayerlack (JAT) 1L',
      'SAYERLACK (JAT) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 7500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Saylack JAT Polyurethane Wood Finish 1L (සේලැක් JAT දැව ආලේපනය 1L) - රු. 7,500'
  },
  // 20. Titanium Dioxide 1kg | 5 | 2000
  {
    name: 'Titanium Dioxide 1kg',
    matchNames: [
      'Titanium Dioxide 1kg',
      'Titanium Dioxide 1Kg',
      'titanium dioxide 1kg',
      'Titanium 1kg',
      'Titanium Dioxide Powder 1kg'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Titanium Dioxide White Pigment Powder 1kg (ටයිටේනියම් ඩයොක්සයිඩ් 1kg) - රු. 2,000'
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

  console.log('\n🎉 Batch 36 Paint/Chemical/Wood Care items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
