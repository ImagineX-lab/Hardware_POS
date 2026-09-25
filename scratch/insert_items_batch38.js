const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 8x10" Shelf Braket 1 DOZ / PAIR | 2 box | 180
  {
    name: '8" x 10" Shelf Bracket (Pair)',
    matchNames: [
      '8" x 10" Shelf Bracket (Pair)',
      '8x10" Shelf Braket 1 DOZ / PAIR',
      '8x10" Shelf Braket',
      '8x10 Shelf Bracket',
      '8x10 Shelf Braket'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'box',
    costPrice: 0,
    sellPrice: 180,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pair',
    loosePrice: 0,
    description: '8" x 10" Shelf Bracket (Pair / Doz) (රාක්ක බ්‍රැකට් 8" x 10") - රු. 180'
  },
  // 2. 10x12" Shelf Braket 1 DOZ / PAIR | 2 box | 200
  {
    name: '10" x 12" Shelf Bracket (Pair)',
    matchNames: [
      '10" x 12" Shelf Bracket (Pair)',
      '10x12" Shelf Braket 1 DOZ / PAIR',
      '10x12" Shelf Braket',
      '10x12 Shelf Bracket',
      '10x12 Shelf Braket'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'box',
    costPrice: 0,
    sellPrice: 200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pair',
    loosePrice: 0,
    description: '10" x 12" Shelf Bracket (Pair / Doz) (රාක්ක බ්‍රැකට් 10" x 12") - රු. 200'
  },
  // 3. 6x8" Shelf Braket 1 DOZ / PAIR | 2 box | 110
  {
    name: '6" x 8" Shelf Bracket (Pair)',
    matchNames: [
      '6" x 8" Shelf Bracket (Pair)',
      '6x8" Shelf Braket 1 DOZ / PAIR',
      '6x8" Shelf Braket',
      '6x8 Shelf Bracket',
      '6x8 Shelf Braket'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'box',
    costPrice: 0,
    sellPrice: 110,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pair',
    loosePrice: 0,
    description: '6" x 8" Shelf Bracket (Pair / Doz) (රාක්ක බ්‍රැකට් 6" x 8") - රු. 110'
  },
  // 4. 4x5" Shelf Braket 1 DOZ / PAIR | 1 box | 75
  {
    name: '4" x 5" Shelf Bracket (Pair)',
    matchNames: [
      '4" x 5" Shelf Bracket (Pair)',
      '4x5" Shelf Braket 1 DOZ / PAIR',
      '4x5" Shelf Braket',
      '4x5 Shelf Bracket',
      '4x5 Shelf Braket'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'box',
    costPrice: 0,
    sellPrice: 75,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pair',
    loosePrice: 0,
    description: '4" x 5" Shelf Bracket (Pair / Doz) (රාක්ක බ්‍රැකට් 4" x 5") - රු. 75'
  },
  // 5. Comad horse (950) | 3 | 950
  {
    name: 'Commode Hose (950)',
    matchNames: [
      'Commode Hose (950)',
      'Comad horse (950)',
      'comad horse (950)',
      'Commode Hose 950',
      'Commode Spray Hose'
    ],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'හෝස් (Hose)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Commode Spray / Bidet Hose (කොමඩ් හෝස්) - රු. 950'
  },
  // 6. පොඩි ABC Box | 5 | 100
  {
    name: 'පොඩි ABC Box',
    matchNames: [
      'පොඩි ABC Box',
      'පොඩි ABC box',
      'Small ABC Box',
      'ABC Box (Small)'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 100,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Small ABC Electrical Enclosure Box (පොඩි ABC බොක්ස්) - රු. 100'
  },
  // 7. ABC 500 Box | 2 | 950
  {
    name: 'ABC 500 Box',
    matchNames: [
      'ABC 500 Box',
      'ABC 500 box',
      'ABC 500'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC 500 Breaker / Enclosure Box (ABC 500 බොක්ස්) - රු. 950'
  },
  // 8. ABC polycrom Box (10) | 5 | 1660
  {
    name: 'ABC Polychrom Box (10 Way)',
    matchNames: [
      'ABC Polychrom Box (10 Way)',
      'ABC polycrom Box (10)',
      'ABC polycrom box (10)',
      'ABC Polychrom 10'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1660,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC Polychrom MCB Distribution Box 10-Way (ABC පොලික්‍රොම් බොක්ස් 10) - රු. 1,660'
  },
  // 9. ABC 900 | 2 | 1750
  {
    name: 'ABC 900 Box',
    matchNames: [
      'ABC 900 Box',
      'ABC 900',
      'ABC 900 box'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC 900 Enclosure Box (ABC 900 බොක්ස්) - රු. 1,750'
  },
  // 10. ABC polycrom Box (16) | 3 | 2280
  {
    name: 'ABC Polychrom Box (16 Way)',
    matchNames: [
      'ABC Polychrom Box (16 Way)',
      'ABC polycrom Box (16)',
      'ABC polycrom box (16)',
      'ABC Polychrom 16'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2280,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC Polychrom MCB Distribution Box 16-Way (ABC පොලික්‍රොම් බොක්ස් 16) - රු. 2,280'
  },
  // 11. ABC pline | 2 | 1950
  {
    name: 'ABC Plain Box',
    matchNames: [
      'ABC Plain Box',
      'ABC pline',
      'ABC Pline',
      'ABC Plain'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1950,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC Plain Enclosure Box (ABC ප්ලේන් බොක්ස්) - රු. 1,950'
  },
  // 12. ABC ORANGE Box (10) | 2 | 2460
  {
    name: 'ABC Orange Box (10 Way)',
    matchNames: [
      'ABC Orange Box (10 Way)',
      'ABC ORANGE Box (10)',
      'ABC orange box (10)',
      'ABC Orange 10'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2460,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC Orange Distribution Box 10-Way (ABC ඔරේන්ජ් බොක්ස් 10) - රු. 2,460'
  },
  // 13. ABC polyCrom Box (12) | 2 | 2750
  {
    name: 'ABC Polychrom Box (12 Way)',
    matchNames: [
      'ABC Polychrom Box (12 Way)',
      'ABC polyCrom Box (12)',
      'ABC polycrom box (12)',
      'ABC Polychrom 12'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2750,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC Polychrom MCB Distribution Box 12-Way (ABC පොලික්‍රොම් බොක්ස් 12) - රු. 2,750'
  },
  // 14. ABC polycrom Box (15) | 1 | 2950
  {
    name: 'ABC Polychrom Box (15 Way)',
    matchNames: [
      'ABC Polychrom Box (15 Way)',
      'ABC polycrom Box (15)',
      'ABC polycrom box (15)',
      'ABC Polychrom 15'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2950,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC Polychrom MCB Distribution Box 15-Way (ABC පොලික්‍රොම් බොක්ස් 15) - රු. 2,950'
  },
  // 15. ABC PLATINUM Box | 2 | 2100
  {
    name: 'ABC Platinum Box',
    matchNames: [
      'ABC Platinum Box',
      'ABC PLATINUM Box',
      'ABC platinum box',
      'ABC Platinum'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2100,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC Platinum Enclosure Box (ABC ප්ලැටිනම් බොක්ස්) - රු. 2,100'
  },
  // 16. ABC ORANGE Box (18) | 1 | 4650
  {
    name: 'ABC Orange Box (18 Way)',
    matchNames: [
      'ABC Orange Box (18 Way)',
      'ABC ORANGE Box (18)',
      'ABC orange box (18)',
      'ABC Orange 18'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4650,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC Orange Distribution Box 18-Way (ABC ඔරේන්ජ් බොක්ස් 18) - රු. 4,650'
  },
  // 17. ABC ORANGE Box (23) | 1 | 7110
  {
    name: 'ABC Orange Box (23 Way)',
    matchNames: [
      'ABC Orange Box (23 Way)',
      'ABC ORANGE Box (23)',
      'ABC orange box (23)',
      'ABC Orange 23'
    ],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 7110,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ABC Orange Distribution Box 23-Way (ABC ඔරේන්ජ් බොක්ස් 23) - රු. 7,110'
  },
  // 18. වේවැල් roll | 2 | 250
  {
    name: 'වේවැල් Roll',
    matchNames: [
      'වේවැල් Roll',
      'වේවැල් roll',
      'Wewal Roll',
      'Cane Roll'
    ],
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 250,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'roll',
    loosePrice: 0,
    description: 'Cane / Wewal Binding Roll (වේවැල් රෝල්) - රු. 250'
  },
  // 19. වැටවල් කොකු (කොළ) | 5kg | 1kg -> 750
  {
    name: 'වැටවල් කොකු (කොළ)',
    matchNames: [
      'වැටවල් කොකු (කොළ)',
      'වැටවල් කොකු කොළ',
      'Fence Hooks Green',
      'Green Fence Hooks'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'kg',
    costPrice: 0,
    sellPrice: 750,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'kg',
    loosePrice: 750,
    description: 'Green Fence J-Hooks (වැටවල් කොකු කොළ 1kg) - රු. 750/kg'
  },
  // 20. Tile කපන | 2 | 2150
  {
    name: 'Tile කපන (Tile Cutter)',
    matchNames: [
      'Tile කපන (Tile Cutter)',
      'Tile කපන',
      'tile කපන',
      'Tile Cutter',
      'ටයිල් කපන'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2150,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Tile Cutter (ටයිල් කපන උපකරණය / තලය) - රු. 2,150'
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

  console.log('\n🎉 Batch 38 items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
