const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 1 1/2 x 3 pin bush - 4 - Rs. 1500
  {
    name: '1 1/2 x 3 pin bush',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/2" x 3" Pin Bush (පින් බුෂ් 1 1/2" x 3") - රු. 1500'
  },
  // 2. 3/4 x 1 1/2 Double bush - 4 - Rs. 550
  {
    name: '3/4 x 1 1/2 Double bush',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3/4" x 1 1/2" Double Bush (ඩබල් බුෂ් 3/4" x 1 1/2") - රු. 550'
  },
  // 3. 1 x 3 Double bush - 4 - Rs. 1050
  {
    name: '1 x 3 Double bush',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1" x 3" Double Bush (ඩබල් බුෂ් 1" x 3") - රු. 1050'
  },
  // 4. 1 x 2 Double bush - 20 - Rs. 550
  {
    name: '1 x 2 Double bush',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1" x 2" Double Bush (ඩබල් බුෂ් 1" x 2") - රු. 550'
  },
  // 5. 3/4 x 2 1/2 Double bush - 4 - Rs. 350
  {
    name: '3/4 x 2 1/2 Double bush',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3/4" x 2 1/2" Double Bush (ඩබල් බුෂ් 3/4" x 2 1/2") - රු. 350'
  },
  // 6. 3/4 x 2 Double bush - 4 - Rs. 500
  {
    name: '3/4 x 2 Double bush',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 500,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3/4" x 2" Double Bush (ඩබල් බුෂ් 3/4" x 2") - රු. 500'
  },
  // 7. Aerosol paint spray (B) - 2 - Rs. 980
  {
    name: 'Aerosol paint spray (B)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 980,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Aerosol Spray Paint Black (ස්ප්‍රේ පේන්ට් බ්ලැක්) - රු. 980'
  },
  // 8. Hallale paint spray (M) - 3 - Rs. 1190
  {
    name: 'Hallale paint spray (M)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 1190,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Hallale Paint Spray (හල්ලාල් ස්ප්‍රේ පේන්ට්) - රු. 1190'
  },
  // 9. Spray paint (Fresh green) - 1 - Rs. 1350
  {
    name: 'Spray paint (Fresh green)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 1350,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint Fresh Green (ස්ප්‍රේ පේන්ට් ෆ්‍රෙෂ් ග්‍රීන්) - රු. 1350'
  },
  // 10. Spray paint (Gem green) - 2 - Rs. 1190
  {
    name: 'Spray paint (Gem green)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 1190,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint Gem Green (ස්ප්‍රේ පේන්ට් ජෙම් ග්‍රීන්) - රු. 1190'
  },
  // 11. Spray paint (Bright gold) - 2 - Rs. 980
  {
    name: 'Spray paint (Bright gold)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 980,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint Bright Gold (ස්ප්‍රේ පේන්ට් බ්‍රයිට් ගෝල්ඩ්) - රු. 980'
  },
  // 12. Spray paint (Gold) - 1 - Rs. 1200
  {
    name: 'Spray paint (Gold)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 1200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint Gold (ස්ප්‍රේ පේන්ට් ගෝල්ඩ්) - රු. 1200'
  },
  // 13. Spray paint (18k Gold) - 1 - Rs. 1400
  {
    name: 'Spray paint (18k Gold)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 1400,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint 18k Gold (ස්ප්‍රේ පේන්ට් 18k ගෝල්ඩ්) - රු. 1400'
  },
  // 14. Spray paint (Red) - 2 - Rs. 950
  {
    name: 'Spray paint (Red)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 950,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint Red (ස්ප්‍රේ පේන්ට් රතු) - රු. 950'
  },
  // 15. Spray paint (Canary yellow) - 2 - Rs. 950
  {
    name: 'Spray paint (Canary yellow)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 950,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint Canary Yellow (ස්ප්‍රේ පේන්ට් කහ) - රු. 950'
  },
  // 16. Spray paint (Matt white) - 3 - Rs. 950
  {
    name: 'Spray paint (Matt white)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 950,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint Matt White (ස්ප්‍රේ පේන්ට් මැට් වයිට්) - රු. 950'
  },
  // 17. Spray paint (Grey) - 1 - Rs. 1350
  {
    name: 'Spray paint (Grey)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 1350,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint Grey (ස්ප්‍රේ පේන්ට් අළු පැහැ) - රු. 1350'
  },
  // 18. Spray paint (L-04) Y - 1 - Rs. 525
  {
    name: 'Spray paint (L-04) Y',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 525,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint L-04 Yellow (ස්ප්‍රේ පේන්ට් L-04) - රු. 525'
  },
  // 19. Spray paint (Chrome) - 1 - Rs. 980
  {
    name: 'Spray paint (Chrome)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 980,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint Chrome (ස්ප්‍රේ පේන්ට් ක්‍රෝම්) - රු. 980'
  },
  // 20. Spray paint (Navy blue) - 2 - Rs. 1525
  {
    name: 'Spray paint (Navy blue)',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'can',
    costPrice: 0,
    sellPrice: 1525,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Spray Paint Navy Blue (ස්ප්‍රේ පේන්ට් නේවි බ්ලූ) - රු. 1525'
  },
  // 21. Tap connecter - 50 - Rs. 80
  {
    name: 'Tap connecter',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'ටැප්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 80,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Tap Connector (ටැප් කනෙක්ටර්) - රු. 80'
  },
  // 22. Horse shoket (පොඩි) - 20 - Rs. 75
  {
    name: 'Horse shoket (පොඩි)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'හෝස් (Hose)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 75,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'හෝස් සොකට් පොඩි (Hose Socket Small) - රු. 75'
  },
  // 23. Horse shoket (ලොකු) - 20 - Rs. 160
  {
    name: 'Horse shoket (ලොකු)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'හෝස් (Hose)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 160,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'හෝස් සොකට් ලොකු (Hose Socket Large) - රු. 160'
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

  console.log('\n🎉 Batch 10 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
