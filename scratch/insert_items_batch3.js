const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. අඩු මිටි 1290 | 3 | Rs. 1290
  {
    name: 'අඩු මිටි 1290',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1290,
    qty: 3,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අඩු මිටි (Claw Hammer) 1290 - රු. 1,290'
  },
  // 2. අඩු මිටි 1750 | 2 | Rs. 1750
  {
    name: 'අඩු මිටි 1750',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අඩු මිටි (Claw Hammer) 1750 - රු. 1,750'
  },
  // 3. අඩු මිටි 750 | 5 | Rs. 750
  {
    name: 'අඩු මිටි 750',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අඩු මිටි (Claw Hammer) 750 - රු. 750'
  },
  // 4. අඩු මිටි 1100 | 4 | Rs. 1100
  {
    name: 'අඩු මිටි 1100',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අඩු මිටි (Claw Hammer) 1100 - රු. 1,100'
  },
  // 5. බෝල අඩු මිටි 475 | 2 | Rs. 475
  {
    name: 'බෝල අඩු මිටි 475',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 475,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බෝල අඩු මිටි (Ball Claw Hammer) 475 - රු. 475'
  },
  // 6. අඩු මිටි 450 | 2 | Rs. 450
  {
    name: 'අඩු මිටි 450',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අඩු මිටි (Claw Hammer) 450 - රු. 450'
  },
  // 7. අඩු මිටි 1650 | 4 | Rs. 1650
  {
    name: 'අඩු මිටි 1650',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1650,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අඩු මිටි (Claw Hammer) 1650 - රු. 1,650'
  },
  // 8. අඩු මිටි 375 | 3 | Rs. 375
  {
    name: 'අඩු මිටි 375',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 375,
    qty: 3,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අඩු මිටි (Claw Hammer) 375 - රු. 375'
  },
  // 9. රබර් බෝල මිටි 550 | Total Qty: 2 (1+1) | Rs. 550
  {
    name: 'රබර් බෝල මිටි 550',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'රබර් බෝල මිටි (Rubber Mallet / Ball Hammer) 550 - රු. 550'
  },
  // 10. රබර් බෝල මිටි 950 | 2 | Rs. 950
  {
    name: 'රබර් බෝල මිටි 950',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'රබර් බෝල මිටි 950 - රු. 950'
  },
  // 11. රබර් බෝල මිටි 750 | 2 | Rs. 750
  {
    name: 'රබර් බෝල මිටි 750',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'රබර් බෝල මිටි 750 - රු. 750'
  },
  // 12. රබර් බෝල මිටි 250 | 1 | Rs. 250
  {
    name: 'රබර් බෝල මිටි 250',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිටි / Hammers',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 1,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'රබර් බෝල මිටි 250 - රු. 250'
  },
  // 13. CCl (0.5 mm² / 16 / 0.20mm) | 2 | Rs. 3250
  {
    name: 'CCl (0.5 mm² / 16 / 0.20mm)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 3250,
    qty: 2,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'm',
    loosePrice: 32.50,
    description: 'CCl Wire (0.5 mm² / 16 / 0.20mm) - රු. 3,250'
  },
  // 14. Plug Top (කොටු) | 33 | Rs. 510
  {
    name: 'Plug Top (කොටු)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 510,
    qty: 33,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Plug Top (කොටු / Square) - රු. 510'
  },
  // 15. Plug Top (රව්ම්) | 30 | Rs. 250
  {
    name: 'Plug Top (රව්ම්)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 30,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Plug Top (රව්ම් / Round) - රු. 250'
  },
  // 16. Adaptor | 40 | Rs. 75
  {
    name: 'Adaptor',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 75,
    qty: 40,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Electrical Plug Adaptor - රු. 75'
  },
  // 17. holder (කළු) | 30 | Rs. 75
  {
    name: 'holder (කළු)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 75,
    qty: 30,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Bulb Holder (කළු / Black) - රු. 75'
  },
  // 18. holder (Batten holder) සුදු | 30 | Rs. 110
  {
    name: 'holder (Batten holder) සුදු',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 110,
    qty: 30,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Batten Bulb Holder (සුදු / White) - රු. 110'
  },
  // 19. holder (සුදු) | 50 | Rs. 200
  {
    name: 'holder (සුදු)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 200,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Bulb Holder (සුදු / White) - රු. 200'
  },
  // 20. ISO holder (සුදු) | 20 | Rs. 150
  {
    name: 'ISO holder (සුදු)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ISO Bulb Holder (සුදු / White) - රු. 150'
  },
  // 21. සීලිං රෝස් | 10 | Rs. 150
  {
    name: 'සීලිං රෝස්',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'සීලිං රෝස් (Ceiling Rose) - රු. 150'
  },
  // 22. 120 holder (සුදු) | 60 | Rs. 120
  {
    name: '120 holder (සුදු)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 120,
    qty: 60,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '120 Bulb Holder (සුදු) - රු. 120'
  },
  // 23. Bed Side Switch | 20 | Rs. 120
  {
    name: 'Bed Side Switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 120,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Bed Side Switch (ඇඳ අසල ස්විචය) - රු. 120'
  },
  // 24. Multi Shocket (කොටු) | 20 | Rs. 850
  {
    name: 'Multi Shocket (කොටු)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 850,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multi Socket (කොටු / Square) - රු. 850'
  },
  // 25. Multi Shocket (සුදු) | 20 | Rs. 250
  {
    name: 'Multi Shocket (සුදු)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multi Socket (සුදු / White) - රු. 250'
  },
  // 26. Power Cable | 3 | Rs. 750
  {
    name: 'Power Cable',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 3,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Power Cable - රු. 750'
  },
  // 27. ජොයින්ට් හෝල්ඩර් | 10 | Rs. 250
  {
    name: 'ජොයින්ට් හෝල්ඩර්',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ජොයින්ට් හෝල්ඩර් (Joint Holder) - රු. 250'
  },
  // 28. holder (Batten holder) කළු | 20 | Rs. 60
  {
    name: 'holder (Batten holder) කළු',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 60,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Batten Bulb Holder (කළු / Black) - රු. 60'
  },
  // 29. ටෙස්ටර් 125 | 10 | Rs. 125
  {
    name: 'ටෙස්ටර් 125',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 125,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Electrical Tester 125 - රු. 125'
  },
  // 30. 220 ටෙස්ටර් | 8 | Rs. 220
  {
    name: '220 ටෙස්ටර්',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 220,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '220 Electrical Tester - රු. 220'
  },
  // 31. plastic Terminal | 50 | Rs. 45
  {
    name: 'plastic Terminal',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 45,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Plastic Terminal Connector - රු. 45'
  },
  // 32. ඩ්රිල් චක් key | 20 | Rs. 250
  {
    name: 'ඩ්රිල් චක් key',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ඩ්රිල් චක් Key (Drill Chuck Key) - රු. 250'
  }
];

function generateBarcode(existingBarcodes) {
  for (let attempts = 0; attempts < 200; attempts++) {
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

  console.log('\n🎉 Batch 3 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
