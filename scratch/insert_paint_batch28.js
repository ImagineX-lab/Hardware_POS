const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. purlac water based Red 1L | 13 | 2500
  {
    name: 'Purelac Water Based Red 1L',
    matchNames: [
      'Purelac Water Based Red 1L',
      'purlac water based Red 1L',
      'purlac water based Red 1l',
      'purelac water based red 1l',
      'purlac (WB) Red 1L',
      'Purelac (WB) Red 1L',
      'purlac WB Red 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 13,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Water Based Paint Red 1L (පියුර්ලැක් වෝටර් බේස් රතු සායම් 1L) - රු. 2,500'
  },
  // 2. Reoluxe water based Red 1L | 5 | 2500
  {
    name: 'Reoluxe Water Based Red 1L',
    matchNames: [
      'Reoluxe Water Based Red 1L',
      'Reoluxe water based Red 1L',
      'reoluxe water based red 1l',
      'Reoluxe (WB) Red 1L',
      'Reoluxe WB Red 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Water Based Paint Red 1L (රියෝලක්ස් වෝටර් බේස් රතු සායම් 1L) - රු. 2,500'
  },
  // 3. Superlac water based Red 1L | 4 | 2000
  {
    name: 'Superlac Water Based Red 1L',
    matchNames: [
      'Superlac Water Based Red 1L',
      'Superlac water based Red 1L',
      'superlac water based red 1l',
      'Superlac (WB) Red 1L',
      'Superlac WB Red 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Superlac Water Based Paint Red 1L (සුපර්ලැක් වෝටර් බේස් රතු සායම් 1L) - රු. 2,000'
  },
  // 4. Standard water based Brown | 3 | 2000
  {
    name: 'Standard Water Based Brown 1L',
    matchNames: [
      'Standard Water Based Brown 1L',
      'Standard water based Brown',
      'Standard water based Brown 1L',
      'standard water based brown 1l',
      'Standard (WB) Brown 1L',
      'Standard WB Brown 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Standard Water Based Paint Brown 1L (ස්ටෑන්ඩර්ඩ් වෝටර් බේස් දුඹුරු සායම් 1L) - රු. 2,000'
  },
  // 5. Standard water based Red | 1 | 2000
  {
    name: 'Standard Water Based Red 1L',
    matchNames: [
      'Standard Water Based Red 1L',
      'Standard water based Red',
      'Standard water based Red 1L',
      'standard water based red 1l',
      'Standard (WB) Red 1L',
      'Standard WB Red 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Standard Water Based Paint Red 1L (ස්ටෑන්ඩර්ඩ් වෝටර් බේස් රතු සායම් 1L) - රු. 2,000'
  },
  // 6. Superlac Green (WB) 1L | 3 | 2000
  {
    name: 'Superlac Green (WB) 1L',
    matchNames: [
      'Superlac Green (WB) 1L',
      'Superlac Green (WB) 1l',
      'Superlac Water Based Green 1L',
      'superlac green wb 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Superlac Water Based Paint Green 1L (සුපර්ලැක් වෝටර් බේස් කොළ සායම් 1L) - රු. 2,000'
  },
  // 7. Standard Black (WB) 500ml | 5 | 1100
  {
    name: 'Standard Black (WB) 500ml',
    matchNames: [
      'Standard Black (WB) 500ml',
      'Standard Black (WB) 500 ml',
      'Standard Water Based Black 500ml',
      'standard black wb 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Standard Water Based Paint Black 500ml (ස්ටෑන්ඩර්ඩ් වෝටර් බේස් කළු සායම් 500ml) - රු. 1,100'
  },
  // 8. Standard Green (WB) 500ml | 6 | 1100
  {
    name: 'Standard Green (WB) 500ml',
    matchNames: [
      'Standard Green (WB) 500ml',
      'Standard Green (WB) 500 ml',
      'Standard Water Based Green 500ml',
      'standard green wb 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Standard Water Based Paint Green 500ml (ස්ටෑන්ඩර්ඩ් වෝටර් බේස් කොළ සායම් 500ml) - රු. 1,100'
  },
  // 9. purlac (WB) Red 500ml | 16 | 1200
  {
    name: 'Purelac (WB) Red 500ml',
    matchNames: [
      'Purelac (WB) Red 500ml',
      'purlac (WB) Red 500ml',
      'purlac (WB) Red 500 ml',
      'purelac wb red 500ml',
      'Purelac Water Based Red 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 16,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Water Based Paint Red 500ml (පියුර්ලැක් වෝටර් බේස් රතු සායම් 500ml) - රු. 1,200'
  },
  // 10. Standard Red 500ml | 45 | 1100
  {
    name: 'Standard Red 500ml',
    matchNames: [
      'Standard Red 500ml',
      'Standard Red 500 ml',
      'standard red 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 45,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Standard Paint Red 500ml (ස්ටෑන්ඩර්ඩ් රතු සායම් 500ml) - රු. 1,100'
  },
  // 11. Opel Red 500ml | 1 | 1100
  {
    name: 'Opel Red 500ml',
    matchNames: [
      'Opel Red 500ml',
      'Opel Red 500 ml',
      'opel red 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Opel Paint Red 500ml (ඔපල් රතු සායම් 500ml) - රු. 1,100'
  },
  // 12. Superlac Red 500ml | 1 | 1100
  {
    name: 'Superlac Red 500ml',
    matchNames: [
      'Superlac Red 500ml',
      'Superlac Red 500 ml',
      'superlac red 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Superlac Paint Red 500ml (සුපර්ලැක් රතු සායම් 500ml) - රු. 1,100'
  },
  // 13. Reoluxe Red 500ml | 3 | 1500
  {
    name: 'Reoluxe Red 500ml',
    matchNames: [
      'Reoluxe Red 500ml',
      'Reoluxe Red 500 ml',
      'reoluxe red 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluxe Paint Red 500ml (රියෝලක්ස් රතු සායම් 500ml) - රු. 1,500'
  },
  // 14. KSS Red 500ml | 1 | 1200
  {
    name: 'KSS Red 500ml',
    matchNames: [
      'KSS Red 500ml',
      'KSS Red 500 ml',
      'kss red 500ml'
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
    description: 'KSS Paint Red 500ml (KSS රතු සායම් 500ml) - රු. 1,200'
  },
  // 15. QD nature paint black 1L | 4 | 2000
  {
    name: 'QD Nature Paint Black 1L',
    matchNames: [
      'QD Nature Paint Black 1L',
      'QD nature paint black 1L',
      'QD nature paint black 1l',
      'qd nature paint black 1l',
      'Nature Paint Black 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'QD Nature Paint Black 1L (QD නේචර් කළු සායම් 1L) - රු. 2,000'
  },
  // 16. QD nature paint black 500ml | 1 | 1100
  {
    name: 'QD Nature Paint Black 500ml',
    matchNames: [
      'QD Nature Paint Black 500ml',
      'QD nature paint black 500ml',
      'QD nature paint black 500 ml',
      'qd nature paint black 500ml',
      'Nature Paint Black 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'QD Nature Paint Black 500ml (QD නේචර් කළු සායම් 500ml) - රු. 1,100'
  },
  // 17. QP nature paint (B/W) 1L | 1 | 2000
  {
    name: 'QP Nature Paint (B/W) 1L',
    matchNames: [
      'QP Nature Paint (B/W) 1L',
      'QP nature paint  (B/W) 1L',
      'QP nature paint (B/W) 1L',
      'QD nature paint (B/W) 1L',
      'QP Nature Paint B/W 1L',
      'qp nature paint b/w 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'QP Nature Paint Brilliant White 1L (QP නේචර් B/W සායම් 1L) - රු. 2,000'
  },
  // 18. QD Robbialac black 500ml | 1 | 1200
  {
    name: 'QD Robbialac Black 500ml',
    matchNames: [
      'QD Robbialac Black 500ml',
      'QD Robbialac black 500ml',
      'QD Robbialac black 500 ml',
      'qd robbialac black 500ml',
      'Robbialac QD Black 500ml'
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
    description: 'QD Robbialac Paint Black 500ml (QD රොබියලැක් කළු සායම් 500ml) - රු. 1,200'
  },
  // 19. QD Kasai Red 1L | 2 | 2500
  {
    name: 'QD Kasai Red 1L',
    matchNames: [
      'QD Kasai Red 1L',
      'QD Kasai Red 1l',
      'qd kasai red 1l',
      'Kasai Red 1L'
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
    description: 'QD Kasai Paint Red 1L (QD කසායි රතු සායම් 1L) - රු. 2,500'
  },
  // 20. QD Royal (B/W) 1L | 2 | 2500
  {
    name: 'QD Royal (B/W) 1L',
    matchNames: [
      'QD Royal (B/W) 1L',
      'QD Royal (B/W) 1l',
      'QD Royal B/W 1L',
      'qd royal b/w 1l',
      'Royal QD (B/W) 1L'
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
    description: 'QD Royal Paint Brilliant White 1L (QD රෝයල් B/W සායම් 1L) - රු. 2,500'
  },
  // 21. QD Reoluxe Black 1L | 2 | 2500
  {
    name: 'QD Reoluxe Black 1L',
    matchNames: [
      'QD Reoluxe Black 1L',
      'QD Reoluxe Black 1l',
      'qd reoluxe black 1l',
      'Reoluxe QD Black 1L'
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
    description: 'QD Reoluxe Paint Black 1L (QD රියෝලක්ස් කළු සායම් 1L) - රු. 2,500'
  },
  // 22. (R)Floor paint Red 1L | 11 | 2000
  {
    name: '(R) Floor Paint Red 1L',
    matchNames: [
      '(R) Floor Paint Red 1L',
      '(R)Floor paint Red 1L',
      '(R) Floor paint Red 1l',
      '(r)floor paint red 1l',
      'Floor Paint Red 1L',
      'Floor paint Red 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 11,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '(R) Floor Paint Red 1L (ෆ්ලෝ පේන්ට් රතු සායම් 1L) - රු. 2,000'
  },
  // 23. Floor paint Red 500ml | 11 | 1200
  {
    name: 'Floor Paint Red 500ml',
    matchNames: [
      'Floor Paint Red 500ml',
      'Floor paint Red 500ml',
      'Floor paint Red 500 ml',
      'floor paint red 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 11,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Floor Paint Red 500ml (ෆ්ලෝ පේන්ට් රතු සායම් 500ml) - රු. 1,200'
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

  console.log('\n🎉 Batch 28 Paint items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
