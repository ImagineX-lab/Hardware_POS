const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 8 යතුර | 2 | 175
  {
    name: '8 යතුර (Spanner)',
    matchNames: [
      '8 යතුර',
      '8 යතුර (Spanner)',
      '8 Spanner',
      '8mm Spanner',
      '8mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 175,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '8mm Spanner / Wrench (8 යතුර) - රු. 175'
  },
  // 2. 10 යතුර | 3 | 250
  {
    name: '10 යතුර (Spanner)',
    matchNames: [
      '10 යතුර',
      '10 යතුර (Spanner)',
      '10 Spanner',
      '10mm Spanner',
      '10mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '10mm Spanner / Wrench (10 යතුර) - රු. 250'
  },
  // 3. 12 යතුර | 1 | 300
  {
    name: '12 යතුර (Spanner)',
    matchNames: [
      '12 යතුර',
      '12 යතුර (Spanner)',
      '12 Spanner',
      '12mm Spanner',
      '12mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 300,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '12mm Spanner / Wrench (12 යතුර) - රු. 300'
  },
  // 4. 13 යතුර | 5 | 350
  {
    name: '13 යතුර (Spanner)',
    matchNames: [
      '13 යතුර',
      '13 යතුර (Spanner)',
      '13 Spanner',
      '13mm Spanner',
      '13mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '13mm Spanner / Wrench (13 යතුර) - රු. 350'
  },
  // 5. 14 යතුර | 8 | 350
  {
    name: '14 යතුර (Spanner)',
    matchNames: [
      '14 යතුර',
      '14 යතුර (Spanner)',
      '14 Spanner',
      '14mm Spanner',
      '14mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '14mm Spanner / Wrench (14 යතුර) - රු. 350'
  },
  // 6. 16 යතුර | 4 | 450
  {
    name: '16 යතුර (Spanner)',
    matchNames: [
      '16 යතුර',
      '16 යතුර (Spanner)',
      '16 Spanner',
      '16mm Spanner',
      '16mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '16mm Spanner / Wrench (16 යතුර) - රු. 450'
  },
  // 7. 17 යතුර | 1 | 550
  {
    name: '17 යතුර (Spanner)',
    matchNames: [
      '17 යතුර',
      '17 යතුර (Spanner)',
      '17 Spanner',
      '17mm Spanner',
      '17mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '17mm Spanner / Wrench (17 යතුර) - රු. 550'
  },
  // 8. 18 යතුර | 9 | 450
  {
    name: '18 යතුර (Spanner)',
    matchNames: [
      '18 යතුර',
      '18 යතුර (Spanner)',
      '18 Spanner',
      '18mm Spanner',
      '18mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 9,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '18mm Spanner / Wrench (18 යතුර) - රු. 450'
  },
  // 9. 19 යතුර | 6 | 600
  {
    name: '19 යතුර (Spanner)',
    matchNames: [
      '19 යතුර',
      '19 යතුර (Spanner)',
      '19 Spanner',
      '19mm Spanner',
      '19mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 600,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '19mm Spanner / Wrench (19 යතුර) - රු. 600'
  },
  // 10. 22 යතුර | 5 | 750
  {
    name: '22 යතුර (Spanner)',
    matchNames: [
      '22 යතුර',
      '22 යතුර (Spanner)',
      '22 Spanner',
      '22mm Spanner',
      '22mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '22mm Spanner / Wrench (22 යතුර) - රු. 750'
  },
  // 11. 17 යතුර (Ratchet) | 2 | 1250
  {
    name: '17 යතුර (Ratchet)',
    matchNames: [
      '17 යතුර (Ratchet)',
      '17 යතුර Ratchet',
      '17mm Ratchet Spanner',
      '17 Ratchet Spanner',
      '17 ratchet යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1250,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '17mm Ratchet Spanner (17 රැචට් යතුර) - රු. 1,250'
  },
  // 12. 14 යතුර (Ratchet) | 2 | 1050
  {
    name: '14 යතුර (Ratchet)',
    matchNames: [
      '14 යතුර (Ratchet)',
      '14 යතුර Ratchet',
      '14mm Ratchet Spanner',
      '14 Ratchet Spanner',
      '14 ratchet යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '14mm Ratchet Spanner (14 රැචට් යතුර) - රු. 1,050'
  },
  // 13. 24 යතුර | 3 | 790
  {
    name: '24 යතුර (Spanner)',
    matchNames: [
      '24 යතුර',
      '24 යතුර (Spanner)',
      '24 Spanner',
      '24mm Spanner',
      '24mm යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 790,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '24mm Spanner / Wrench (24 යතුර) - රු. 790'
  },
  // 14. 12 යතුර (Ratchet) | 2 | 990
  {
    name: '12 යතුර (Ratchet)',
    matchNames: [
      '12 යතුර (Ratchet)',
      '12 යතුර Ratchet',
      '12mm Ratchet Spanner',
      '12 Ratchet Spanner',
      '12 ratchet යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 990,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '12mm Ratchet Spanner (12 රැචට් යතුර) - රු. 990'
  },
  // 15. 10 යතුර (Ratchet) | 1 | 950
  {
    name: '10 යතුර (Ratchet)',
    matchNames: [
      '10 යතුර (Ratchet)',
      '10 යතුර Ratchet',
      '10mm Ratchet Spanner',
      '10 Ratchet Spanner',
      '10 ratchet යතුර'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '10mm Ratchet Spanner (10 රැචට් යතුර) - රු. 950'
  },
  // 16. 16 x 17 යතුර | 1 | 450
  {
    name: '16 x 17 යතුර (Spanner)',
    matchNames: [
      '16 x 17 යතුර',
      '16 x 17 යතුර (Spanner)',
      '16x17 යතුර',
      '16 x 17 Spanner',
      '16x17 Spanner'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '16 x 17 Double End Spanner (16 x 17 දෙපැත්ත යතුර) - රු. 450'
  },
  // 17. 22 x 22 යතුර | 1 | 550
  {
    name: '22 x 22 යතුර (Spanner)',
    matchNames: [
      '22 x 22 යතුර',
      '22 x 22 යතුර (Spanner)',
      '22x22 යතුර',
      '22 x 22 Spanner',
      '22x22 Spanner'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '22 x 22 Spanner (22 x 22 යතුර) - රු. 550'
  },
  // 18. 18 x 19 යතුර | 1 | 500
  {
    name: '18 x 19 යතුර (Spanner)',
    matchNames: [
      '18 x 19 යතුර',
      '18 x 19 යතුර (Spanner)',
      '18x19 යතුර',
      '18 x 19 Spanner',
      '18x19 Spanner'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 500,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '18 x 19 Double End Spanner (18 x 19 දෙපැත්ත යතුර) - රු. 500'
  },
  // 19. 6 x 7 යතුර | 2 | 200
  {
    name: '6 x 7 යතුර (Spanner)',
    matchNames: [
      '6 x 7 යතුර',
      '6 x 7 යතුර (Spanner)',
      '6x7 යතුර',
      '6 x 7 Spanner',
      '6x7 Spanner'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '6 x 7 Double End Spanner (6 x 7 දෙපැත්ත යතුර) - රු. 200'
  },
  // 20. 14 x 15 යතුර | 1 | 350
  {
    name: '14 x 15 යතුර (Spanner)',
    matchNames: [
      '14 x 15 යතුර',
      '14 x 15 යතුර (Spanner)',
      '14x15 යතුර',
      '14 x 15 Spanner',
      '14x15 Spanner'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '14 x 15 Double End Spanner (14 x 15 දෙපැත්ත යතුර) - රු. 350'
  },
  // 21. කුරුස යතුර (12,13,14) | 2 | 550
  {
    name: 'කුරුස යතුර (12,13,14)',
    matchNames: [
      'කුරුස යතුර (12,13,14)',
      'කුරුස යතුර',
      'කුරුස යතුර (12, 13, 14)',
      'Cross Spanner (12,13,14)',
      'Cross Spanner'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Cross Spanner (12, 13, 14) (කුරුස යතුර 12, 13, 14) - රු. 550'
  },
  // 22. Y යතුර (13,14,17) | 1 | 375
  {
    name: 'Y යතුර (13,14,17)',
    matchNames: [
      'Y යතුර (13,14,17)',
      'Y යතුර',
      'Y යතුර (13, 14, 17)',
      'Y Spanner (13,14,17)',
      'Y Spanner',
      'Y Type Spanner'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 375,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Y-Type 3-Way Spanner (13, 14, 17) (Y ආකාරයේ යතුර 13, 14, 17) - රු. 375'
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

  console.log('\n🎉 Batch 37 Spanner/Wrench items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
