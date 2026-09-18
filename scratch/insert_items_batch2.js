const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. ග්රයින්ඩර් Tool kit | 6 | Rs. 375
  {
    name: 'ග්රයින්ඩර් Tool kit',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 375,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ග්රයින්ඩර් Tool kit - රු. 375'
  },
  // 2. ඩ්රිල් චක් Tool | 6 | Rs. 1100
  {
    name: 'ඩ්රිල් චක් Tool',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ඩ්රිල් චක් Tool (Drill Chuck Tool) - රු. 1,100'
  },
  // 3. ප්ලාස්ටික් තාච්චි | 20 | Rs. 200
  {
    name: 'ප්ලාස්ටික් තාච්චි',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 200,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ප්ලාස්ටික් තාච්චි - රු. 200'
  },
  // 4. රබර් plate | 10 | Rs. 300
  {
    name: 'රබර් plate',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 300,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'රබර් plate - රු. 300'
  },
  // 5. නීන්න තැටි | 2 | Rs. 350
  {
    name: 'නීන්න තැටි',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නීන්න තැටි - රු. 350'
  },
  // 6. Safety goggles | 5 | Rs. 350
  {
    name: 'Safety goggles',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ආරක්ෂිත උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Safety goggles - රු. 350'
  },
  // 7. Safety goggles (සුදු) | 10 | Rs. 210
  {
    name: 'Safety goggles (සුදු)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ආරක්ෂිත උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 210,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Safety goggles (සුදු) - රු. 210'
  },
  // 8. Kobe මෝටර් (0.5Hp) | 1 | Rs. 19500
  {
    name: 'Kobe මෝටර් (0.5Hp)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වතුර මෝටර්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 19500,
    qty: 1,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kobe වතුර මෝටර් (0.5Hp) - රු. 19,500'
  },
  // 9. Kobe මෝටර් (1.0Hp) | 1 | Rs. 29500
  {
    name: 'Kobe මෝටර් (1.0Hp)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වතුර මෝටර්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 29500,
    qty: 1,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kobe වතුර මෝටර් (1.0Hp) - රු. 29,500'
  },
  // 10. වතුර ස්ප්රේ | 20 | Rs. 275
  {
    name: 'වතුර ස්ප්රේ',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 275,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'වතුර ස්ප්රේ (Water Spray) - රු. 275'
  },
  // 11. විල්බර්රොව් රෝද | 3 | Rs. 1300
  {
    name: 'විල්බර්රොව් රෝද',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'විල්බැරැක්ක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1300,
    qty: 3,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'විල්බර්රොව් රෝද (නෝමල්) - රු. 1,300'
  },
  // 12. විල්බර්රොව් රෝද (කොටු) | 3 | Rs. 1750
  {
    name: 'විල්බර්රොව් රෝද (කොටු)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'විල්බැරැක්ක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 3,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'විල්බර්රොව් රෝද (කොටු / කොන්ක්‍රීට්) - රු. 1,750'
  },
  // 13. බයිසිකල් හැන්ඩ්ල් | 1 | Rs. 4100
  {
    name: 'බයිසිකල් හැන්ඩ්ල්',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4100,
    qty: 1,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බයිසිකල් හැන්ඩ්ල් (Bicycle Handle) - රු. 4,100'
  },
  // 14. බයිසිකල් mothgarde Tool | 1 | Rs. 2200
  {
    name: 'බයිසිකල් mothgarde Tool',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 1,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බයිසිකල් Mudguard (mothgarde) Tool - රු. 2,200'
  },
  // 15. බයිසිකල් Haddle | 3 | Rs. 1250
  {
    name: 'බයිසිකල් Haddle',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1250,
    qty: 3,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බයිසිකල් Haddle (සෑදල / හැන්ඩ්ල්) - රු. 1,250'
  },
  // 16. DSI tubes (26 x 2.00 / 2.125) | 3 | Rs. 1100
  {
    name: 'DSI tubes (26 x 2.00 / 2.125)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'DSI Bicycle Tube (26 x 2.00 / 2.125) - රු. 1,100'
  },
  // 17. DSI tubes (28 x 1 1/2) | 6 | Rs. 1100
  {
    name: 'DSI tubes (28 x 1 1/2)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'DSI Bicycle Tube (28 x 1 1/2) - රු. 1,100'
  },
  // 18. DSI tubes (24 x 1.75 / 2.125) | 5 | Rs. 1100
  {
    name: 'DSI tubes (24 x 1.75 / 2.125)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'DSI Bicycle Tube (24 x 1.75 / 2.125) - රු. 1,100'
  },
  // 19. DSI tubes (26 x 1.50 / 2.25) | 5 | Rs. 1200
  {
    name: 'DSI tubes (26 x 1.50 / 2.25)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'DSI Bicycle Tube (26 x 1.50 / 2.25) - රු. 1,200'
  },
  // 20. DSI tubes (12 1/2 x 1.75 x 2 1/4) | 5 | Rs. 650
  {
    name: 'DSI tubes (12 1/2 x 1.75 x 2 1/4)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'DSI Bicycle Tube (12 1/2 x 1.75 x 2 1/4) - රු. 650'
  },
  // 21. DSI tubes (18 x 1.75 / 2.125) | 3 | Rs. 1100
  {
    name: 'DSI tubes (18 x 1.75 / 2.125)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'DSI Bicycle Tube (18 x 1.75 / 2.125) - රු. 1,100'
  },
  // 22. DSI tubes (14 x 1.75 / 2.125) | 3 | Rs. 1150
  {
    name: 'DSI tubes (14 x 1.75 / 2.125)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1150,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'DSI Bicycle Tube (14 x 1.75 / 2.125) - රු. 1,150'
  },
  // 23. බයිසිකල් lock | 11 | Rs. 450
  {
    name: 'බයිසිකල් lock',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 11,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බයිසිකල් Lock - රු. 450'
  },
  // 24. බයිසිකල් Compornante | 3 | Rs. 2750
  {
    name: 'බයිසිකල් Compornante',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2750,
    qty: 3,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බයිසිකල් Component kit - රු. 2,750'
  },
  // 25. බයිසිකල් paddle ජෝඩු | 5 | Rs. 790
  {
    name: 'බයිසිකල් paddle ජෝඩු',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pair',
    costPrice: 0,
    sellPrice: 790,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බයිසිකල් Pedal (පැඩල්) ජෝඩු - රු. 790'
  },
  // 26. හැන්ඩ්ල් set ජෝඩු | 2 | Rs. 390
  {
    name: 'හැන්ඩ්ල් set ජෝඩු',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pair',
    costPrice: 0,
    sellPrice: 390,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'හැන්ඩ්ල් Set (Grips) ජෝඩු - රු. 390'
  },
  // 27. බයිසිකල් paddle හොද | 3 | Rs. 1480
  {
    name: 'බයිසිකල් paddle හොද',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pair',
    costPrice: 0,
    sellPrice: 1480,
    qty: 3,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බයිසිකල් Pedal (හොද වර්ගය) ජෝඩු - රු. 1,480'
  },
  // 28. B. B Cup | 8 | Rs. 550
  {
    name: 'B. B Cup',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'B. B Cup (Bottom Bracket Cup - බයිසිකල්) - රු. 550'
  },
  // 29. බයිසිකල් Axle | 4 | Rs. 650
  {
    name: 'බයිසිකල් Axle',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බයිසිකල් Axle (ඇක්සල්) - රු. 650'
  },
  // 30. බයිසිකල් hub pair | 2 | Rs. 1850
  {
    name: 'බයිසිකල් hub pair',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pair',
    costPrice: 0,
    sellPrice: 1850,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'බයිසිකල් Hub Pair (හබ් ජෝඩු) - රු. 1,850'
  },
  // 31. free wheel (බයිසිකල්) | 6 | Rs. 650
  {
    name: 'free wheel (බයිසිකල්)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Free Wheel (බයිසිකල් ෆ්‍රී වීල්) - රු. 650'
  },
  // 32. Chain 850 | 5 | Rs. 850
  {
    name: 'Chain 850',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 850,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Bicycle Chain 850 - රු. 850'
  },
  // 33. Chain 550 | 4 | Rs. 550
  {
    name: 'Chain 550',
    category: 'ගෘහ උපකරණ',
    subCategory: 'බයිසිකල් උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Bicycle Chain 550 - රු. 550'
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

  console.log('\n🎉 Batch 2 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
