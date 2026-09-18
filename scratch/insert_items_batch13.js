const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 4 Bosan ගල් Disk - 1 - Rs. 1050
  {
    name: '4 Bosan ගල් Disk',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Bosan Stone / Granite Cutting Disk 4" (බෝසන් ගල් ඩිස්ක් 4") - රු. 1050'
  },
  // 2. 4 1/2 Bosan ගල් Disk - 3 - Rs. 1050
  {
    name: '4 1/2 Bosan ගල් Disk',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Bosan Stone / Granite Cutting Disk 4 1/2" (බෝසන් ගල් ඩිස්ක් 4 1/2") - රු. 1050'
  },
  // 3. 4 1/2 Bosan රවුම් ගල් Disk - 3 - Rs. 1300
  {
    name: '4 1/2 Bosan රවුම් ගල් Disk',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1300,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Bosan Round Stone Disk 4 1/2" (බෝසන් රවුම් ගල් ඩිස්ක්) - රු. 1300'
  },
  // 4. Disk 750 (කපන) - 5 - Rs. 750
  {
    name: 'Disk 750 (කපන)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Cutting Disk 750 (කපන ඩිස්ක් 750) - රු. 750'
  },
  // 5. 7 Cutting wheel - 22 - Rs. 550
  {
    name: '7 Cutting wheel',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 22,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '7" Cutting Wheel (7" කටින් වීල්) - රු. 550'
  },
  // 6. 14 Cutting wheel - 14 - Rs. 1160
  {
    name: '14 Cutting wheel',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1160,
    qty: 14,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '14" Chop Saw Cutting Wheel (14" කටින් වීල්) - රු. 1160'
  },
  // 7. 180mm ලී කපන wheel - 4 - Rs. 1050
  {
    name: '180mm ලී කපන wheel',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '180mm Wood Cutting Blade (180mm ලී කපන වීල්) - රු. 1050'
  },
  // 8. 250mm ලී කපන wheel - 3 - Rs. 1980
  {
    name: '250mm ලී කපන wheel',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1980,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '250mm Wood Cutting Blade (250mm ලී කපන වීල්) - රු. 1980'
  },
  // 9. 10 ලී කපන wheel - 2 - Rs. 2450
  {
    name: '10 ලී කපන wheel',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2450,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '10" Wood Cutting Blade (10" ලී කපන වීල්) - රු. 2450'
  },
  // 10. 12 ලී කපන wheel - 2 - Rs. 3550
  {
    name: '12 ලී කපන wheel',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3550,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '12" Wood Cutting Blade (12" ලී කපන වීල්) - රු. 3550'
  },
  // 11. ප්රේටුල් අදින - 3 - Rs. 390
  {
    name: 'ප්රේටුල් අදින',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 390,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'පෙට්‍රල් අදින බට / පොම්පය (Manual Siphon / Petrol Suction Pump) - රු. 390'
  },
  // 12. 15A plug base - 8 - Rs. 750
  {
    name: '15A plug base',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 8,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '15A Plug Base Socket (15A ප්ලග් බේස්) - රු. 750'
  },
  // 13. Itel plug base 13A - 4 - Rs. 690
  {
    name: 'Itel plug base 13A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Itel 13A Plug Base Socket (අයිටෙල් 13A ප්ලග් බේස්) - රු. 690'
  },
  // 14. Fan Switch (Original) - 2 - Rs. 2445
  {
    name: 'Fan Switch (Original)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2445,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Fan Speed Controller / Switch Original (ෆෑන් ස්විච් ඔරිජිනල්) - රු. 2445'
  },
  // 15. Orange plug base 13A - 25 - Rs. 850
  {
    name: 'Orange plug base 13A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 850,
    qty: 25,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange 13A Plug Base (ඔරේන්ජ් 13A ප්ලග් බේස්) - රු. 850'
  },
  // 16. Akko Star plug base 13A - 10 - Rs. 750
  {
    name: 'Akko Star plug base 13A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Akko Star 13A Plug Base (අක්කෝ ස්ටාර් 13A ප්ලග් බේස්) - රු. 750'
  },
  // 17. Kevilton plug base 13A - 21 - Rs. 750
  {
    name: 'Kevilton plug base 13A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 21,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton 13A Plug Base (කෙවිල්ටන් 13A ප්ලග් බේස්) - රු. 750'
  },
  // 18. Orange one gang Switch - 18 - Rs. 350
  {
    name: 'Orange one gang Switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 18,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange 1 Gang 1 Way Switch (ඔරේන්ජ් 1 ගැන්ග් ස්විච්) - රු. 350'
  },
  // 19. Orange 2 gang Switch - 23 - Rs. 620
  {
    name: 'Orange 2 gang Switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 620,
    qty: 23,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange 2 Gang 1 Way Switch (ඔරේන්ජ් 2 ගැන්ග් ස්විච්) - රු. 620'
  },
  // 20. Orange 3 gang switch - 21 - Rs. 950
  {
    name: 'Orange 3 gang switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 21,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange 3 Gang 1 Way Switch (ඔරේන්ජ් 3 ගැන්ග් ස්විච්) - රු. 950'
  },
  // 21. Orange 4 gang switch - 19 - Rs. 1200
  {
    name: 'Orange 4 gang switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 19,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange 4 Gang 1 Way Switch (ඔරේන්ජ් 4 ගැන්ග් ස්විච්) - රු. 1200'
  },
  // 22. Orange Telephone Switch - 2 - Rs. 835
  {
    name: 'Orange Telephone Switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 835,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange Telephone RJ11 Socket (ඔරේන්ජ් ටෙලිෆෝන් සොකට්) - රු. 835'
  },
  // 23. Kevilton 1 gang switch - 10 - Rs. 350
  {
    name: 'Kevilton 1 gang switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton 1 Gang 1 Way Switch (කෙවිල්ටන් 1 ගැන්ග් ස්විච්) - රු. 350'
  },
  // 24. Kevilton 2 gang switch - 23 - Rs. 620
  {
    name: 'Kevilton 2 gang switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 620,
    qty: 23,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton 2 Gang 1 Way Switch (කෙවිල්ටන් 2 ගැන්ග් ස්විච්) - රු. 620'
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

  console.log('\n🎉 Batch 13 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
