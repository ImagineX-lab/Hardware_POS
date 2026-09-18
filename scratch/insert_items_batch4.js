const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. උල් කටු | 11 | 200
  {
    name: 'උල් කටු',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 200,
    qty: 11,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'උල් කටු (Pointed Chisel) - රු. 200'
  },
  // 2. කන්න කටු 6" | 6 | 650
  {
    name: 'කන්න කටු 6"',
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
    description: 'කන්න කටු 6" (Corner / Cold Chisel 6") - රු. 650'
  },
  // 3. වයර් බ්රෂ් (Brush) 425 | 16 | 425
  {
    name: 'වයර් බ්රෂ් (Brush) 425',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'බුරුසු / Brush',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 425,
    qty: 16,
    reorderLevel: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'වයර් බ්‍රෂ් (Wire Brush) 425 - රු. 425'
  },
  // 4. බ්රෂ් Brush 450 | 5 | 450
  {
    name: 'බ්රෂ් Brush 450',
    category: 'සායම් හා රසායනික',
    subCategory: 'පින්සල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'පේන්ට් බ්‍රෂ් (Paint Brush) 450 - රු. 450'
  },
  // 5. බ්රෂ් Brush 480 | 10 | 480
  {
    name: 'බ්රෂ් Brush 480',
    category: 'සායම් හා රසායනික',
    subCategory: 'පින්සල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 480,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'පේන්ට් බ්‍රෂ් (Paint Brush) 480 - රු. 480'
  },
  // 6. රේක්ක තල 950 | 2 | 950
  {
    name: 'රේක්ක තල 950',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'රේක්ක තල (Rake Blade) 950 - රු. 950'
  },
  // 7. අත් මුල්ලු 350 | 3 | 350
  {
    name: 'අත් මුල්ලු 350',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 3,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අත් මුල්ලු (Hand Fork) 350 - රු. 350'
  },
  // 8. අත් මුල්ලු set | 2 | 950
  {
    name: 'අත් මුල්ලු set',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'set',
    costPrice: 0,
    sellPrice: 950,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'අත් මුල්ලු Set (Hand Fork Set) - රු. 950'
  },
  // 9. ලොකු මුල්ලු | 1 | 550
  {
    name: 'ලොකු මුල්ලු',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 1,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ලොකු මුල්ලු (Large Fork) - රු. 550'
  },
  // 10. කෑටපොල | 6 | 375
  {
    name: 'කෑටපොල',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 375,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'කැටපෝල (Catapult) - රු. 375'
  },
  // 11. Balancet තරාදි | 7 | 750
  {
    name: 'Balancet තරාදි',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිනුම් උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Balancet තරාදි (Spring Balance Scale) - රු. 750'
  },
  // 12. 975 තරාදි | 11 | 975
  {
    name: '975 තරාදි',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'මිනුම් උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 975,
    qty: 11,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'තරාදි 975 (Scale 975) - රු. 975'
  },
  // 13. මේසන් හැඳි 10" | 9 | 525
  {
    name: 'මේසන් හැඳි 10"',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 525,
    qty: 9,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'මේසන් හැඳි 10" (Masonry Trowel 10") - රු. 525'
  },
  // 14. 690 මේසන් හැඳි | 3 | 690
  {
    name: '690 මේසන් හැඳි',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 3,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'මේසන් හැඳි 690 (Masonry Trowel) - රු. 690'
  },
  // 15. 325 මේසන් හැඳි 6" | 5 | 325
  {
    name: '325 මේසන් හැඳි 6"',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 325,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'මේසන් හැඳි 6" (Masonry Trowel 6") - රු. 325'
  },
  // 16. 625 මේසන් හැඳි | 7 | 625
  {
    name: '625 මේසන් හැඳි',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 625,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'මේසන් හැඳි 625 (Masonry Trowel) - රු. 625'
  },
  // 17. 720 මේසන් හැඳි | 5 | 720
  {
    name: '720 මේසන් හැඳි',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 720,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'මේසන් හැඳි 720 (Masonry Trowel) - රු. 720'
  },
  // 18. 295 Brush (½") | 12 | 295
  {
    name: '295 Brush (½")',
    category: 'සායම් හා රසායනික',
    subCategory: 'පින්සල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 295,
    qty: 12,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Paint Brush 1/2" (295) - රු. 295'
  },
  // 19. 227 Brush (JAT) (½") | 12 | 227
  {
    name: '227 Brush (JAT) (½")',
    category: 'සායම් හා රසායනික',
    subCategory: 'පින්සල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 227,
    qty: 12,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT Paint Brush 1/2" (227) - රු. 227'
  },
  // 20. 575 Brush (Hayleys) 2" | 15 | 575
  {
    name: '575 Brush (Hayleys) 2"',
    category: 'සායම් හා රසායනික',
    subCategory: 'පින්සල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 575,
    qty: 15,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Hayleys Paint Brush 2" (575) - රු. 575'
  },
  // 21. 1044 Brush (JAT) 4"/100mm | 15 | 1044
  {
    name: '1044 Brush (JAT) 4"/100mm',
    category: 'සායම් හා රසායනික',
    subCategory: 'පින්සල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1044,
    qty: 15,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT Paint Brush 4" / 100mm (1044) - රු. 1,044'
  },
  // 22. 725 Brush (Hayleys) 2" | 15 | 725
  {
    name: '725 Brush (Hayleys) 2"',
    category: 'සායම් හා රසායනික',
    subCategory: 'පින්සල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 725,
    qty: 15,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Hayleys Paint Brush 2" (725) - රු. 725'
  },
  // 23. 380 Brush (Rich) 2" | 6 | 380
  {
    name: '380 Brush (Rich) 2"',
    category: 'සායම් හා රසායනික',
    subCategory: 'පින්සල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 380,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Rich Paint Brush 2" (380) - රු. 380'
  },
  // 24. poti හැඳි 580 | 17 | 580
  {
    name: 'poti හැඳි 580',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'පොටි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 580,
    qty: 17,
    reorderLevel: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'පොටි හැඳි (Putty Trowel) 580 - රු. 580'
  },
  // 25. පොටි හැඳි 760 | 1 | 760
  {
    name: 'පොටි හැඳි 760',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'පොටි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 760,
    qty: 1,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'පොටි හැඳි (Putty Trowel) 760 - රු. 760'
  },
  // 26. පොටි හැඳි 620 | 7 | 620
  {
    name: 'පොටි හැඳි 620',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'පොටි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 620,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'පොටි හැඳි (Putty Trowel) 620 - රු. 620'
  },
  // 27. ටයිල් හැඳි 490 | 6 | 490
  {
    name: 'ටයිල් හැඳි 490',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ටයිල් මොටාර්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 490,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ටයිල් හැඳි (Notched Tile Trowel) 490 - රු. 490'
  },
  // 28. ටයිල් හැඳි 650 | 2 | 650
  {
    name: 'ටයිල් හැඳි 650',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ටයිල් මොටාර්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ටයිල් හැඳි (Notched Tile Trowel) 650 - රු. 650'
  },
  // 29. (ලී) නියන් ½" | 4 | 420
  {
    name: '(ලී) නියන් ½"',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 420,
    qty: 4,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ලී නියන් 1/2" (Wood Chisel 1/2") - රු. 420'
  },
  // 30. (ලී) නියන් ¾" | 8 | 450
  {
    name: '(ලී) නියන් ¾"',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ලී නියන් 3/4" (Wood Chisel 3/4") - රු. 450'
  },
  // 31. (ලී) නියන් අගල" | 5 | 580
  {
    name: '(ලී) නියන් අගල"',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 580,
    qty: 5,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ලී නියන් අඟල 1" (Wood Chisel 1") - රු. 580'
  },
  // 32. නියන් 6mm | 5 | 750
  {
    name: 'නියන් 6mm',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 5,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නියන් 6mm (Wood Chisel 6mm) - රු. 750'
  },
  // 33. නියන් 12mm | 4 | 750
  {
    name: 'නියන් 12mm',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 4,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නියන් 12mm (Wood Chisel 12mm) - රු. 750'
  },
  // 34. නියන් 18mm | 2 | 725
  {
    name: 'නියන් 18mm',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 725,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නියන් 18mm (Wood Chisel 18mm) - රු. 725'
  },
  // 35. නියන් 25mm | 2 | 950
  {
    name: 'නියන් 25mm',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නියන් 25mm (Wood Chisel 25mm) - රු. 950'
  },
  // 36. නියන් තල | 4 | 350
  {
    name: 'නියන් තල',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 4,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නියන් තල (Chisel Blade) - රු. 350'
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

  console.log('\n🎉 Batch 4 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
