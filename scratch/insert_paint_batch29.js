const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. purlac floor paint 200ml (B) | 3 | 600
  {
    name: 'Purelac Floor Paint 200ml (B)',
    matchNames: [
      'Purelac Floor Paint 200ml (B)',
      'purlac floor paint 200ml (B)',
      'purlac floor paint 200ml (b)',
      'purelac floor paint 200ml (b)',
      'Purelac Floor Paint 200ml (Black)',
      'Purelac Floor Paint 200ml (Brown)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 600,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Floor Paint 200ml (B) (පියුර්ලැක් ෆ්ලෝ පේන්ට් 200ml) - රු. 600'
  },
  // 2. Robbialac floor coat 200ml (B) | 3 | 150
  {
    name: 'Robbialac Floor Coat 200ml (B)',
    matchNames: [
      'Robbialac Floor Coat 200ml (B)',
      'Robbialac floor coat 200ml (B)',
      'robbialac floor coat 200ml (b)',
      'Robbialac Floor Coat 200ml (Black)',
      'Robbialac Floor Coat 200ml (Brown)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robbialac Floor Coat 200ml (B) (රොබියලැක් ෆ්ලෝ කෝට් 200ml) - රු. 150'
  },
  // 3. Reoluxe floor paint 200ml (G) | 5 | 600
  {
    name: 'Reoluxe Floor Paint 200ml (G)',
    matchNames: [
      'Reoluxe Floor Paint 200ml (G)',
      'Reoluxe floor paint 200ml (G)',
      'reoluxe floor paint 200ml (g)',
      'Reoluxe Floor Paint 200ml (Green)',
      'Reoluxe Floor Paint 200ml Green'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 600,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Floor Paint 200ml Green (රියෝලක්ස් ෆ්ලෝ පේන්ට් 200ml කොළ) - රු. 600'
  },
  // 4. (R) 500ml Reoluxe floor paint | 1 | 1200
  {
    name: '(R) 500ml Reoluxe Floor Paint',
    matchNames: [
      '(R) 500ml Reoluxe Floor Paint',
      '(R) 500ml Reoluxe floor paint',
      'Reoluxe Floor Paint 500ml (R)',
      'reoluxe floor paint 500ml (r)',
      'Reoluxe Floor Paint 500ml Red',
      'Reoluxe Floor Paint 500ml (Red)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Floor Paint 500ml Red (රියෝලක්ස් ෆ්ලෝ පේන්ට් 500ml රතු) - රු. 1,200'
  },
  // 5. (B) 500ml JCHEM floor paint | 6 | 1200
  {
    name: '(B) 500ml JCHEM Floor Paint',
    matchNames: [
      '(B) 500ml JCHEM Floor Paint',
      '(B) 500ml JCHEM floor paint',
      'JCHEM Floor Paint 500ml (B)',
      'jchem floor paint 500ml (b)',
      'JCHEM Floor Paint 500ml (Black)',
      'JCHEM Floor Paint 500ml (Brown)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JCHEM Floor Paint 500ml (B) (ජයකෙම් ෆ්ලෝ පේන්ට් 500ml) - රු. 1,200'
  },
  // 6. (R) 500ml JCHEM floor paint | 18 | 1200
  {
    name: '(R) 500ml JCHEM Floor Paint',
    matchNames: [
      '(R) 500ml JCHEM Floor Paint',
      '(R) 500ml JCHEM floor paint',
      'JCHEM Floor Paint 500ml (R)',
      'jchem floor paint 500ml (r)',
      'JCHEM Floor Paint 500ml Red',
      'JCHEM Floor Paint 500ml (Red)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 18,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JCHEM Floor Paint 500ml Red (ජයකෙම් ෆ්ලෝ පේන්ට් 500ml රතු) - රු. 1,200'
  },
  // 7. (G) 500ml Reoluxe floor paint | 3 | 1200
  {
    name: '(G) 500ml Reoluxe Floor Paint',
    matchNames: [
      '(G) 500ml Reoluxe Floor Paint',
      '(G) 500ml Reoluxe floor paint',
      'Reoluxe Floor Paint 500ml (G)',
      'reoluxe floor paint 500ml (g)',
      'Reoluxe Floor Paint 500ml Green',
      'Reoluxe Floor Paint 500ml (Green)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Floor Paint 500ml Green (රියෝලක්ස් ෆ්ලෝ පේන්ට් 500ml කොළ) - රු. 1,200'
  },
  // 8. (R) 200ml KSS floor paint | 1 | 500
  {
    name: '(R) 200ml KSS Floor Paint',
    matchNames: [
      '(R) 200ml KSS Floor Paint',
      '(R) 200ml KSS floor paint',
      'KSS Floor Paint 200ml (R)',
      'kss floor paint 200ml (r)',
      'KSS Floor Paint 200ml Red',
      'KSS Floor Paint 200ml (Red)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'KSS Floor Paint 200ml Red (KSS ෆ්ලෝ පේන්ට් 200ml රතු) - රු. 500'
  },
  // 9. (R) 500ml Multilac floor paint | 5 | 1400
  {
    name: '(R) 500ml Multilac Floor Paint',
    matchNames: [
      '(R) 500ml Multilac Floor Paint',
      '(R) 500ml Multilac floor paint',
      'Multilac Floor Paint 500ml (R)',
      'multilac floor paint 500ml (r)',
      'Multilac Floor Paint 500ml Red',
      'Multilac Floor Paint 500ml (Red)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1400,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Floor Paint 500ml Red (මල්ටිලැක් ෆ්ලෝ පේන්ට් 500ml රතු) - රු. 1,400'
  },
  // 10. (G) 500ml Multilac floor paint | 1 | 1400
  {
    name: '(G) 500ml Multilac Floor Paint',
    matchNames: [
      '(G) 500ml Multilac Floor Paint',
      '(G) 500ml Multilac floor paint',
      'Multilac Floor Paint 500ml (G)',
      'multilac floor paint 500ml (g)',
      'Multilac Floor Paint 500ml Green',
      'Multilac Floor Paint 500ml (Green)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1400,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Floor Paint 500ml Green (මල්ටිලැක් ෆ්ලෝ පේන්ට් 500ml කොළ) - රු. 1,400'
  },
  // 11. (B) 1L JCHEM floor paint | 11 | 2500
  {
    name: '(B) 1L JCHEM Floor Paint',
    matchNames: [
      '(B) 1L JCHEM Floor Paint',
      '(B) 1L JCHEM floor paint',
      'JCHEM Floor Paint 1L (B)',
      'jchem floor paint 1l (b)',
      'JCHEM Floor Paint 1L (Black)',
      'JCHEM Floor Paint 1L (Brown)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 11,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JCHEM Floor Paint 1L (B) (ජයකෙම් ෆ්ලෝ පේන්ට් 1L) - රු. 2,500'
  },
  // 12. (R) 1L JCHEM floor paint | 2 | 2500
  {
    name: '(R) 1L JCHEM Floor Paint',
    matchNames: [
      '(R) 1L JCHEM Floor Paint',
      '(R) 1L JCHEM floor paint',
      'JCHEM Floor Paint 1L (R)',
      'jchem floor paint 1l (r)',
      'JCHEM Floor Paint 1L Red',
      'JCHEM Floor Paint 1L (Red)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JCHEM Floor Paint 1L Red (ජයකෙම් ෆ්ලෝ පේන්ට් 1L රතු) - රු. 2,500'
  },
  // 13. (B) 1L JCHEM floor paint | 3 | 2450
  {
    name: '(B) 1L JCHEM Floor Paint (2)',
    matchNames: [
      '(B) 1L JCHEM Floor Paint (2)',
      '(B) 1L JCHEM floor paint (2)',
      '(B) 1L JCHEM floor paint (2450)',
      'JCHEM Floor Paint 1L (B) (2)',
      'jchem floor paint 1l (b) (2)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2450,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JCHEM Floor Paint 1L (B) (ජයකෙම් ෆ්ලෝ පේන්ට් 1L) - රු. 2,450'
  },
  // 14. (R) 1L Hailco floor paint | 1 | 2500
  {
    name: '(R) 1L Hailco Floor Paint',
    matchNames: [
      '(R) 1L Hailco Floor Paint',
      '(R) 1L Hailco floor paint',
      'Hailco Floor Paint 1L (R)',
      'hailco floor paint 1l (r)',
      'Hailco Floor Paint 1L Red',
      'Hailco Floor Paint 1L (Red)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Hailco Floor Paint 1L Red (හේල්කෝ ෆ්ලෝ පේන්ට් 1L රතු) - රු. 2,500'
  },
  // 15. (R) 1L opel floor paint | 2 | 2500
  {
    name: '(R) 1L Opel Floor Paint',
    matchNames: [
      '(R) 1L Opel Floor Paint',
      '(R) 1L opel floor paint',
      'Opel Floor Paint 1L (R)',
      'opel floor paint 1l (r)',
      'Opel Floor Paint 1L Red',
      'Opel Floor Paint 1L (Red)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Opel Floor Paint 1L Red (ඔපල් ෆ්ලෝ පේන්ට් 1L රතු) - රු. 2,500'
  },
  // 16. (R) 1L Multilac floor paint | 2 | 3000
  {
    name: '(R) 1L Multilac Floor Paint',
    matchNames: [
      '(R) 1L Multilac Floor Paint',
      '(R) 1L Multilac floor paint',
      'Multilac Floor Paint 1L (R)',
      'multilac floor paint 1l (r)',
      'Multilac Floor Paint 1L Red',
      'Multilac Floor Paint 1L (Red)'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Floor Paint 1L Red (මල්ටිලැක් ෆ්ලෝ පේන්ට් 1L රතු) - රු. 3,000'
  },
  // 17. (B) 1L Robbialac floor paint A/c black | 2 | 2500
  {
    name: '(B) 1L Robbialac Floor Paint A/C Black',
    matchNames: [
      '(B) 1L Robbialac Floor Paint A/C Black',
      '(B) 1L Robbialac floor paint A/c black',
      '(B) 1L Robbialac floor paint A/C black',
      'Robbialac Floor Paint 1L A/C Black',
      'robbialac floor paint 1l a/c black',
      'Robbialac Floor Paint 1L AC Black'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robbialac Floor Paint 1L A/C Black (රොබියලැක් ෆ්ලෝ පේන්ට් 1L A/C කළු) - රු. 2,500'
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

  console.log('\n🎉 Batch 29 Floor Paint items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
