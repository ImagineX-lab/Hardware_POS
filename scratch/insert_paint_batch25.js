const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. Multilac 1L b/w | 1 | Rs.1750/-
  {
    name: 'Multilac 1l B/W',
    matchNames: ['Multilac 1l B/W', 'Multilac 1L b/w', 'Multilac 1L B/W'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac 1L Brilliant White Paint - රු. 1,750'
  },
  // 2. (w) Multilac 4L True gold (Weather Guard) | 2 | Rs.4000/-
  {
    name: '(W) Multilac 4l True Gold (Weather Guard)',
    matchNames: ['(W) Multilac 4l True Gold (Weather Guard)', '(w) Multilac 4L True gold (Weather Guard)', 'Multilac 4L True gold (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 4L True Gold Paint - රු. 4,000'
  },
  // 3. (w) Multilac 4L spice(Weather Guard) | 1 | Rs.4000/-
  {
    name: '(W) Multilac 4l Spice (Weather Guard)',
    matchNames: ['(W) Multilac 4l Spice (Weather Guard)', '(w) Multilac 4L spice(Weather Guard)', 'Multilac 4L spice (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 4L Spice Paint - රු. 4,000'
  },
  // 4. (w) Multilac 4L cyan(Weather Guard) | 1 | Rs.4000/-
  {
    name: '(W) Multilac 4l Cyan (Weather Guard)',
    matchNames: ['(W) Multilac 4l Cyan (Weather Guard)', '(w) Multilac 4L cyan(Weather Guard)', 'Multilac 4L cyan (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 4L Cyan Paint - රු. 4,000'
  },
  // 5. (w) Multilac 4L roast red(Weather Guard) | 1 | Rs.4000/-
  {
    name: '(W) Multilac 4l Roast Red (Weather Guard)',
    matchNames: ['(W) Multilac 4l Roast Red (Weather Guard)', '(w) Multilac 4L roast red(Weather Guard)', 'Multilac 4L roast red (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 4L Roast Red Paint - රු. 4,000'
  },
  // 6. (w) Multilac 4L Heritage Red(Weather Guard) | 2 + 1 = 3 | Rs.4000/-
  {
    name: '(W) Multilac 4l Heritage Red (Weather Guard)',
    matchNames: ['(W) Multilac 4l Heritage Red (Weather Guard)', '(w) Multilac 4L Heritage Red(Weather Guard)', '(w) Multilac 4L Heritage red(Weather Guard)', 'Multilac 4L Heritage Red (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 4L Heritage Red Paint - රු. 4,000'
  },
  // 7. (w) Multilac 4L Bubble gum(Weather Guard) | 1 | Rs.4000/-
  {
    name: '(W) Multilac 4l Bubble Gum (Weather Guard)',
    matchNames: ['(W) Multilac 4l Bubble Gum (Weather Guard)', '(w) Multilac 4L Bubble gum(Weather Guard)', 'Multilac 4L Bubble gum (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 4L Bubble Gum Paint - රු. 4,000'
  },
  // 8. (w) Multilac 4L Amazon(Weather Guard) | 2 | Rs.4000/-
  {
    name: '(W) Multilac 4l Amazon (Weather Guard)',
    matchNames: ['(W) Multilac 4l Amazon (Weather Guard)', '(w) Multilac 4L Amazon(Weather Guard)', 'Multilac 4L Amazon (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 4L Amazon Paint - රු. 4,000'
  },
  // 9. (w) Multilac 4L purple rain(Weather Guard) | 2 | Rs.4000/-
  {
    name: '(W) Multilac 4l Purple Rain (Weather Guard)',
    matchNames: ['(W) Multilac 4l Purple Rain (Weather Guard)', '(w) Multilac 4L purple rain(Weather Guard)', 'Multilac 4L purple rain (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 4L Purple Rain Paint - රු. 4,000'
  },
  // 10. (w) Multilac 4L rain Dance(Weather Guard) | 3 | Rs.4000/-
  {
    name: '(W) Multilac 4l Rain Dance (Weather Guard)',
    matchNames: ['(W) Multilac 4l Rain Dance (Weather Guard)', '(w) Multilac 4L rain Dance(Weather Guard)', 'Multilac 4L rain Dance (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 4L Rain Dance Paint - රු. 4,000'
  },
  // 11. (w) Multilac 4L popy red(Weather Guard) | 4 | Rs.4000/-
  {
    name: '(W) Multilac 4l Poppy Red (Weather Guard)',
    matchNames: ['(W) Multilac 4l Poppy Red (Weather Guard)', '(w) Multilac 4L popy red(Weather Guard)', 'Multilac 4L popy red (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 4L Poppy Red Paint - රු. 4,000'
  },
  // 12. (w)Multilac 1L Orange Lantern (Weather Guard) | 1 | Rs.1000/-
  {
    name: '(W) Multilac 1l Orange Lantern (Weather Guard)',
    matchNames: ['(W) Multilac 1l Orange Lantern (Weather Guard)', '(w)Multilac 1L Orange Lantern (Weather Guard)', '(w) Multilac 1L Orange Lantern (Weather Guard)'],
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
    description: 'Multilac Weather Guard 1L Orange Lantern Paint - රු. 1,000'
  },
  // 13. (w)Multilac 1L rain Dance(Weather Guard) | 1 | Rs.1000/-
  {
    name: '(W) Multilac 1l Rain Dance (Weather Guard)',
    matchNames: ['(W) Multilac 1l Rain Dance (Weather Guard)', '(w)Multilac 1L rain Dance(Weather Guard)', '(w) Multilac 1L rain Dance (Weather Guard)'],
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
    description: 'Multilac Weather Guard 1L Rain Dance Paint - රු. 1,000'
  },
  // 14. (w)Multilac 1L Cameo pink(Weather Guard) | 2 | Rs.1000/-
  {
    name: '(W) Multilac 1l Cameo Pink (Weather Guard)',
    matchNames: ['(W) Multilac 1l Cameo Pink (Weather Guard)', '(w)Multilac 1L Cameo pink(Weather Guard)', '(w) Multilac 1L Cameo pink (Weather Guard)'],
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
    description: 'Multilac Weather Guard 1L Cameo Pink Paint - රු. 1,000'
  },
  // 15. (w)Multilac 1L True Gold(Weather Guard) | 4 | Rs.1000/-
  {
    name: '(W) Multilac 1l True Gold (Weather Guard)',
    matchNames: ['(W) Multilac 1l True Gold (Weather Guard)', '(w)Multilac 1L True Gold(Weather Guard)', '(w) Multilac 1L True Gold (Weather Guard)'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1000,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multilac Weather Guard 1L True Gold Paint - රු. 1,000'
  },
  // 16. (w)Multilac 1L September Dawn(Weather Guard) | 3 | Rs.1000/-
  {
    name: '(W) Multilac 1l September Dawn (Weather Guard)',
    matchNames: ['(W) Multilac 1l September Dawn (Weather Guard)', '(w)Multilac 1L September Dawn(Weather Guard)', '(w) Multilac 1L September Dawn (Weather Guard)'],
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
    description: 'Multilac Weather Guard 1L September Dawn Paint - රු. 1,000'
  },
  // 17. (w)Multilac 1L puple rain(Weather Guard) | 1 | Rs.1000/-
  {
    name: '(W) Multilac 1l Purple Rain (Weather Guard)',
    matchNames: ['(W) Multilac 1l Purple Rain (Weather Guard)', '(w)Multilac 1L puple rain(Weather Guard)', '(w) Multilac 1L purple rain (Weather Guard)'],
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
    description: 'Multilac Weather Guard 1L Purple Rain Paint - රු. 1,000'
  },
  // 18. (w)Multilac 1L Cyan(Weather Guard) | 3 | Rs.1000/-
  {
    name: '(W) Multilac 1l Cyan (Weather Guard)',
    matchNames: ['(W) Multilac 1l Cyan (Weather Guard)', '(w)Multilac 1L Cyan(Weather Guard)', '(w) Multilac 1L Cyan (Weather Guard)'],
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
    description: 'Multilac Weather Guard 1L Cyan Paint - රු. 1,000'
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

  console.log('\n🎉 Batch 25 Paint items updated/added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
