const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. Purelac 4L fairytale | 1 + 6 = 7 | 4000/-
  {
    name: 'Pure Lac 4l Fairy Tale',
    matchNames: ['Pure Lac 4l Fairy Tale', 'Purelac 4L fairytale', 'Purelac 4L fairy tale'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Pure Lac 4L Fairy Tale Paint - රු. 4,000'
  },
  // 2. Purelac 4L Lime fizz | 7 | 4000/-
  {
    name: 'Pure Lac 4l Lime Fizz',
    matchNames: ['Pure Lac 4l Lime Fizz', 'Purelac 4L Lime fizz'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Pure Lac 4L Lime Fizz Paint - රු. 4,000'
  },
  // 3. Multilac 4L B/w | 7 | 6000/-
  {
    name: 'Multilac 4l B/W',
    matchNames: ['Multilac 4l B/W', 'Multilac 4L B/w'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 6000,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 4L Brilliant White Paint - රු. 6,000'
  },
  // 4. Multilac 4L Boat Race | 1 | 3000/-
  {
    name: 'Multilac 4l Boat Race',
    matchNames: ['Multilac 4l Boat Race', 'Multilac 4L Boat Race'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 4L Boat Race Paint - රු. 3,000'
  },
  // 5. Multilac 4LTurquoise | 2 | 3000/-
  {
    name: 'Multilac 4l Turquoise',
    matchNames: ['Multilac 4l Turquoise', 'Multilac 4L Turquoise', 'Multilac 4LTurquoise'],
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
    description: 'Multilac 4L Turquoise Paint - රු. 3,000'
  },
  // 6. Multilac 4L Happy Day | 2 | 3000/-
  {
    name: 'Multilac 4l Happy Day',
    matchNames: ['Multilac 4l Happy Day', 'Multilac 4L Happy Day'],
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
    description: 'Multilac 4L Happy Day Paint - රු. 3,000'
  },
  // 7. Multilac 4L Classic purple | 2 | 3000/-
  {
    name: 'Multilac 4l Classic Purple',
    matchNames: ['Multilac 4l Classic Purple', 'Multilac 4L Classic purple', 'Multilac 4L Classic purple2'],
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
    description: 'Multilac 4L Classic Purple Paint - රු. 3,000'
  },
  // 8. Multilac 4L Deep pool | 2 | 3000/-
  {
    name: 'Multilac 4l Deep Pool',
    matchNames: ['Multilac 4l Deep Pool', 'Multilac 4L Deep pool'],
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
    description: 'Multilac 4L Deep Pool Paint - රු. 3,000'
  },
  // 9. Multilac 4L Orchid | 2 | 3000/-
  {
    name: 'Multilac 4l Orchid',
    matchNames: ['Multilac 4l Orchid', 'Multilac 4L Orchid'],
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
    description: 'Multilac 4L Orchid Paint - රු. 3,000'
  },
  // 10. Multilac 1L Deep pool | 2 | 1000/-
  {
    name: 'Multilac 1l Deep Pool',
    matchNames: ['Multilac 1l Deep Pool', 'Multilac 1L Deep pool'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L Deep Pool Paint - රු. 1,000'
  },
  // 11. Multilac 1L fairy Tale | 1 | 1000/-
  {
    name: 'Multilac 1l Fairy Tale',
    matchNames: ['Multilac 1l Fairy Tale', 'Multilac 1L fairy Tale'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L Fairy Tale Paint - රු. 1,000'
  },
  // 12. Multilac 1L Happy Day | 2 | 1000/-
  {
    name: 'Multilac 1l Happy Day',
    matchNames: ['Multilac 1l Happy Day', 'Multilac 1L Happy Day'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L Happy Day Paint - රු. 1,000'
  },
  // 13. Multilac 1L Classic purple | 2 | 1000/-
  {
    name: 'Multilac 1l Classic Purple',
    matchNames: ['Multilac 1l Classic Purple', 'Multilac 1L Classic purple'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L Classic Purple Paint - රු. 1,000'
  },
  // 14. Multilac 1L September Down | 1 | 1000/-
  {
    name: 'Multilac 1l September Dawn',
    matchNames: ['Multilac 1l September Dawn', 'Multilac 1L September Down', 'Multilac 1l September Down'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L September Dawn Paint - රු. 1,000'
  },
  // 15. Multilac 1L Summer | 2 | 1000/-
  {
    name: 'Multilac 1l Summer',
    matchNames: ['Multilac 1l Summer', 'Multilac 1L Summer'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L Summer Paint - රු. 1,000'
  },
  // 16. Multilac 1L Easter egg | 1 | 1000/-
  {
    name: 'Multilac 1l Easter Egg',
    matchNames: ['Multilac 1l Easter Egg', 'Multilac 1L Easter egg'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L Easter Egg Paint - රු. 1,000'
  },
  // 17. Multilac 1L Camel | 1 | 1000/-
  {
    name: 'Multilac 1l Camel',
    matchNames: ['Multilac 1l Camel', 'Multilac 1L Camel'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L Camel Paint - රු. 1,000'
  },
  // 18. Multilac 1LTurmeric | 3 | 1000/-
  {
    name: 'Multilac 1l Turmeric',
    matchNames: ['Multilac 1l Turmeric', 'Multilac 1L Turmeric', 'Multilac 1LTurmeric'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L Turmeric Paint - රු. 1,000'
  },
  // 19. Multilac 1L hawaii Blue | 1 | 1000/-
  {
    name: 'Multilac 1l Hawaii Blue',
    matchNames: ['Multilac 1l Hawaii Blue', 'Multilac 1L hawaii Blue'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L Hawaii Blue Paint - රු. 1,000'
  },
  // 20. Dulux 1L Seacoral | 1 | 500/-
  {
    name: 'Dulux 1l Seacoral',
    matchNames: ['Dulux 1l Seacoral', 'Dulux 1L Seacoral'],
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
    description: 'Dulux 1L Seacoral Paint - රු. 500'
  },
  // 21. Easter egg 1L | 1 | 500/-
  {
    name: 'Easter Egg 1l Paint',
    matchNames: ['Easter Egg 1l Paint', 'Easter egg 1L', 'Easter Egg 1l'],
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
    description: 'Easter Egg 1L Paint - රු. 500'
  },
  // 22. sandstone 1L | 1 | 500/-
  {
    name: 'Sandstone 1l Paint',
    matchNames: ['Sandstone 1l Paint', 'sandstone 1L', 'Sandstone 1l'],
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
    description: 'Sandstone 1L Paint - රු. 500'
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

  console.log('\n🎉 Batch 24 Paint items updated/added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
