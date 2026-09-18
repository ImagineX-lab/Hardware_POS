const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 8" Ancor bolte කොකු - 7 - Rs. 130
  {
    name: '8" Ancor bolte කොකු',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 130,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt Hook 8" (ඇන්කර් බෝල්ට් කොකු 8") - රු. 130'
  },
  // 2. 10" Ancor bolte කොකු - 30 - Rs. 140
  {
    name: '10" Ancor bolte කොකු',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 140,
    qty: 30,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt Hook 10" (ඇන්කර් බෝල්ට් කොකු 10") - රු. 140'
  },
  // 3. 1" Amano ඇණ (ලී) - 50 - Rs. 15
  {
    name: '1" Amano ඇණ (ලී)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Amano Wood Screw 1" (අමානෝ ලී ඇණ 1") - රු. 15'
  },
  // 4. 1 1/2" Amano ඇණ (ලී) - 50 - Rs. 18
  {
    name: '1 1/2" Amano ඇණ (ලී)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 18,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Amano Wood Screw 1 1/2" (අමානෝ ලී ඇණ 1 1/2") - රු. 18'
  },
  // 5. 2" Amano ඇණ (ලී) - 50 - Rs. 20
  {
    name: '2" Amano ඇණ (ලී)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 20,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Amano Wood Screw 2" (අමානෝ ලී ඇණ 2") - රු. 20'
  },
  // 6. 2 1/2" Amano ඇණ (ලී) - 50 - Rs. 25
  {
    name: '2 1/2" Amano ඇණ (ලී)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 25,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Amano Wood Screw 2 1/2" (අමානෝ ලී ඇණ 2 1/2") - රු. 25'
  },
  // 7. 3" Amano ඇණ (ලී) - 50 - Rs. 30
  {
    name: '3" Amano ඇණ (ලී)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 30,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Amano Wood Screw 3" (අමානෝ ලී ඇණ 3") - රු. 30'
  },
  // 8. 3 1/2" Amano ඇණ (ලී) 1kg-750 / 10kg - ඇණ 01=Rs. 35
  {
    name: '3 1/2" Amano ඇණ (ලී)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'kg',
    costPrice: 0,
    sellPrice: 750,
    qty: 10,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'kg',
    loosePrice: 35,
    description: 'Amano Wood Screw 3 1/2" (1kg = රු. 750 / තනි ඇණයක් = රු. 35)'
  },
  // 9. 4" Amano ඇණ (ලී) 1kg-750 / 10kg - ඇණ 01=Rs. 40
  {
    name: '4" Amano ඇණ (ලී)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'kg',
    costPrice: 0,
    sellPrice: 750,
    qty: 10,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'kg',
    loosePrice: 40,
    description: 'Amano Wood Screw 4" (1kg = රු. 750 / තනි ඇණයක් = රු. 40)'
  },
  // 10. 5" Amano ඇණ (ලී) 1kg-750 / 10kg - ඇණ 01=Rs. 45
  {
    name: '5" Amano ඇණ (ලී)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'kg',
    costPrice: 0,
    sellPrice: 750,
    qty: 10,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'kg',
    loosePrice: 45,
    description: 'Amano Wood Screw 5" (1kg = රු. 750 / තනි ඇණයක් = රු. 45)'
  },
  // 11. 6" Amano ඇණ (ලී) 1kg-750 / 10kg - ඇණ 01=Rs. 50
  {
    name: '6" Amano ඇණ (ලී)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'kg',
    costPrice: 0,
    sellPrice: 750,
    qty: 10,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'kg',
    loosePrice: 50,
    description: 'Amano Wood Screw 6" (1kg = රු. 750 / තනි ඇණයක් = රු. 50)'
  },
  // 12. 1" Amano ඇණ (යකඩ) - 50 - Rs. 15
  {
    name: '1" Amano ඇණ (යකඩ)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Amano Metal / Iron Screw 1" (අමානෝ යකඩ ඇණ 1") - රු. 15'
  },
  // 13. 1 1/2" Amano ඇණ (යකඩ) - 50 - Rs. 18
  {
    name: '1 1/2" Amano ඇණ (යකඩ)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 18,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Amano Metal / Iron Screw 1 1/2" (අමානෝ යකඩ ඇණ 1 1/2") - රු. 18'
  },
  // 14. 2" Amano ඇණ (යකඩ) - 50 - Rs. 20
  {
    name: '2" Amano ඇණ (යකඩ)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 20,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Amano Metal / Iron Screw 2" (අමානෝ යකඩ ඇණ 2") - රු. 20'
  },
  // 15. 3" Amano ඇණ (යකඩ) - 50 - Rs. 20
  {
    name: '3" Amano ඇණ (යකඩ)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 20,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Amano Metal / Iron Screw 3" (අමානෝ යකඩ ඇණ 3") - රු. 20'
  },
  // 16. 3 1/2" Amano ඇණ (යකඩ) - 50 - Rs. 35
  {
    name: '3 1/2" Amano ඇණ (යකඩ)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 35,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Amano Metal / Iron Screw 3 1/2" (අමානෝ යකඩ ඇණ 3 1/2") - රු. 35'
  },
  // 17. Crocodile clip - 6 - Rs. 375
  {
    name: 'Crocodile clip',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 375,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Crocodile Clip Battery / Test (ක්‍රොකඩයිල් ක්ලිප්) - රු. 375'
  },
  // 18. 450V AC Condencer - 10 - Rs. 275
  {
    name: '450V AC Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 275,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '450V AC Capacitor / Condenser (450V AC කන්ඩෙන්සර්) - රු. 275'
  },
  // 19. ගල් ගොඩ (Carborundum) - 2 - Rs. 750
  {
    name: 'ගල් ගොඩ (Carborundum)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Carborundum Sharpening Stone (කාබොරන්ඩම් කරගල් / ගල් ගොඩ) - රු. 750'
  },
  // 20. ගල් ගොඩ (Combination) - 6 - Rs. 650
  {
    name: 'ගල් ගොඩ (Combination)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Combination Sharpening Stone (කොම්බිනේෂන් කරගල් / ගල් ගොඩ) - රු. 650'
  },
  // 21. අන් මූම - 2 - Rs. 1250
  {
    name: 'අන් මූම',
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
    description: 'අන් මූම (Tool) - රු. 1250'
  },
  // 22. 100 uf Condencer - 4 - Rs. 950
  {
    name: '100 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '100uF Motor Capacitor / Condenser (100uF කන්ඩෙන්සර්) - රු. 950'
  },
  // 23. 200 uf Condencer - 2 - Rs. 1750
  {
    name: '200 uf Condencer',
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
    description: '200uF Motor Capacitor / Condenser (200uF කන්ඩෙන්සර්) - රු. 1750'
  },
  // 24. 400 uf Condencer - 3 - Rs. 1750
  {
    name: '400 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '400uF Motor Capacitor / Condenser (400uF කන්ඩෙන්සර්) - රු. 1750'
  },
  // 25. 200 uf Condencer(1050) - 5 - Rs. 1050
  {
    name: '200 uf Condencer(1050)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '200uF Capacitor / Condenser 1050 (200uF කන්ඩෙන්සර් 1050) - රු. 1050'
  },
  // 26. 60 uf Condencer - 3 - Rs. 1050
  {
    name: '60 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '60uF Motor Capacitor / Condenser (60uF කන්ඩෙන්සර්) - රු. 1050'
  },
  // 27. 500 uf Condencer - 2 - Rs. 1775
  {
    name: '500 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1775,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '500uF Motor Capacitor / Condenser (500uF කන්ඩෙන්සර්) - රු. 1775'
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

  console.log('\n🎉 Batch 16 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
