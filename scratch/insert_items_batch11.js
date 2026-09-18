const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 1 Sun box - 40 - Rs. 150
  {
    name: '1 Sun box',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 40,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 Sunken Box / 1 Gang Switch Box (1 සන් බොක්ස්) - රු. 150'
  },
  // 2. 2 Sun box - 50 - Rs. 300
  {
    name: '2 Sun box',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 300,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2 Sunken Box / 2 Gang Switch Box (2 සන් බොක්ස්) - රු. 300'
  },
  // 3. 3 Sun box - 60 - Rs. 450
  {
    name: '3 Sun box',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 60,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3 Sunken Box / 3 Gang Switch Box (3 සන් බොක්ස්) - රු. 450'
  },
  // 4. 4 Sun box - 50 - Rs. 600
  {
    name: '4 Sun box',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 600,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '4 Sunken Box / 4 Gang Switch Box (4 සන් බොක්ස්) - රු. 600'
  },
  // 5. Junction box - 10 - Rs. 150
  {
    name: 'Junction box',
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
    description: 'Junction Box (ජන්ක්ෂන් බොක්ස්) - රු. 150'
  },
  // 6. Lever Spray (150) - 20 - Rs. 150
  {
    name: 'Lever Spray (150)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Lever Trigger Spray (ලීවර් ස්ප්‍රේ) 150 - රු. 150'
  },
  // 7. Lever Spray (620) - 2 - Rs. 620
  {
    name: 'Lever Spray (620)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 620,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Lever Spray Pressure (ලීවර් ස්ප්‍රේ) 620 - රු. 620'
  },
  // 8. Baishi Spray (KPL) - 3 - Rs. 225
  {
    name: 'Baishi Spray (KPL)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 225,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Baishi Spray KPL (බායිෂි ස්ප්‍රේ) - රු. 225'
  },
  // 9. ෂන Spray - 3 - Rs. 430
  {
    name: 'ෂන Spray',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 430,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ෂන ස්ප්‍රේ (Shana Spray) - රු. 430'
  },
  // 10. බටකොල ඇන්ටෙන - 5 - Rs. 2950
  {
    name: 'බටකොල ඇන්ටෙන',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2950,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බටකොළ ඇන්ටෙනාව (Batakola TV Antenna) - රු. 2950'
  },
  // 11. shawer මල් පොඩි - 14 - Rs. 150
  {
    name: 'shawer මල් පොඩි',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'ටැප්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 14,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ෂවර් මල් පොඩි (Shower Rose Small) - රු. 150'
  },
  // 12. shawer මල් ලොකු - 28 - Rs. 75
  {
    name: 'shawer මල් ලොකු',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'ටැප්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 75,
    qty: 28,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ෂවර් මල් ලොකු (Shower Rose Large) - රු. 75'
  },
  // 13. shawer මල් 75 - 2 - Rs. 75
  {
    name: 'shawer මල් 75',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'ටැප්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 75,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ෂවර් මල් 75 (Shower Rose 75) - රු. 75'
  },
  // 14. shawer මල් 120 - 30 - Rs. 120
  {
    name: 'shawer මල් 120',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'ටැප්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 120,
    qty: 30,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ෂවර් මල් 120 (Shower Rose 120) - රු. 120'
  },
  // 15. shawer මල් 750 - 1 - Rs. 750
  {
    name: 'shawer මල් 750',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'ටැප්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ෂවර් මල් 750 (Shower Head 750) - රු. 750'
  },
  // 16. shawer මල් නිකල් Set - 1 - Rs. 1625
  {
    name: 'shawer මල් නිකල් Set',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'ටැප්',
    unit: 'set',
    costPrice: 0,
    sellPrice: 1625,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'set',
    loosePrice: 0,
    description: 'ෂවර් මල් නිකල් සෙට් (Shower Head Nickel Set) - රු. 1625'
  },
  // 17. අල්මාරි lock - 50 - Rs. 365
  {
    name: 'අල්මාරි lock',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 365,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අල්මාරි ලොක් (Cupboard Lock) - රු. 365'
  },
  // 18. අල්මාරි lock 1100 - 11 - Rs. 1100
  {
    name: 'අල්මාරි lock 1100',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 11,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අල්මාරි ලොක් 1100 (Cupboard Lock 1100) - රු. 1100'
  },
  // 19. කොමඩ් පියන් - 7 - Rs. 1750
  {
    name: 'කොමඩ් පියන්',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'දොරවල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'කොමඩ් පියන (Commode Seat Cover) - රු. 1750'
  },
  // 20. Plastic box (සුදු) - 3 - Rs. 200
  {
    name: 'Plastic box (සුදු)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 200,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ප්ලාස්ටික් බොක්ස් සුදු (Plastic Box White) - රු. 200'
  },
  // 21. Face sheel - 3 - Rs. 275
  {
    name: 'Face sheel',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 275,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ෆේස් ෂීල්ඩ් (Safety Face Shield) - රු. 275'
  },
  // 22. ගලි grating - 5 - Rs. 450
  {
    name: 'ගලි grating',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'පයිප්ප හා සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ගලි ග්‍රේටින් (Gully Grating / Drain Cover) - රු. 450'
  },
  // 23. මී පෙට්ටි - 7 - Rs. 650
  {
    name: 'මී පෙට්ටි',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'මී පෙට්ටි (Bee Box / Trap Box) - රු. 650'
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

  console.log('\n🎉 Batch 11 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
