const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. Delphi 250ml - 1 - Rs. 1330
  {
    name: 'Delphi 250ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1330,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Delphi Brake Fluid 250ml (ඩෙල්ෆි බ්‍රේක් ඔයිල් 250ml) - රු. 1330'
  },
  // 2. Delphi 500ml - 4 - Rs. 2400
  {
    name: 'Delphi 500ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2400,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Delphi Brake Fluid 500ml (ඩෙල්ෆි බ්‍රේක් ඔයිල් 500ml) - රු. 2400'
  },
  // 3. Hirupathi brake oil 250ml - 3 - Rs. 580
  {
    name: 'Hirupathi brake oil 250ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 580,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Hirupathi Brake Oil 250ml (හිරුපති බ්‍රේක් ඔයිල් 250ml) - රු. 580'
  },
  // 4. Hirupathi brake oil 100ml - 1 - Rs. 300
  {
    name: 'Hirupathi brake oil 100ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 300,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Hirupathi Brake Oil 100ml (හිරුපති බ්‍රේක් ඔයිල් 100ml) - රු. 300'
  },
  // 5. lubricant 100ml (BS-40) - 5 - Rs. 375
  {
    name: 'lubricant 100ml (BS-40)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'තෙල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 375,
    qty: 5,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'BS-40 Lubricant Spray 100ml (ලුබ්රිකන්ට් ස්ප්‍රේ BS-40 100ml) - රු. 375'
  },
  // 6. lubricant 200ml (BS-40) - 2 - Rs. 475
  {
    name: 'lubricant 200ml (BS-40)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'තෙල්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 475,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'BS-40 Lubricant Spray 200ml (ලුබ්රිකන්ට් ස්ප්‍රේ BS-40 200ml) - රු. 475'
  },
  // 7. dash tile cleaner 500ml - 5 - Rs. 400
  {
    name: 'dash tile cleaner 500ml',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 400,
    qty: 5,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Dash Tile Cleaner 500ml (ඩෑෂ් ටයිල් ක්ලීනර් 500ml) - රු. 400'
  },
  // 8. මැජික් පවුඩර් 30g - 5 - Rs. 150
  {
    name: 'මැජික් පවුඩර් 30g',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 5,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'මැජික් පවුඩර් 30g (Magic Powder Cleaning 30g) - රු. 150'
  },
  // 9. Dezolo max Clorex 100ml - 5 - Rs. 130
  {
    name: 'Dezolo max Clorex 100ml',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 130,
    qty: 5,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Dezolo Max Clorex 100ml (ඩෙසොලෝ මැක්ස් ක්ලෝරෙක්ස් 100ml) - රු. 130'
  },
  // 10. Dezolo max Clorex 225ml - 2 - Rs. 220
  {
    name: 'Dezolo max Clorex 225ml',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 220,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Dezolo Max Clorex 225ml (ඩෙසොලෝ මැක්ස් ක්ලෝරෙක්ස් 225ml) - රු. 220'
  },
  // 11. Dezolo max Clorex 500ml - 3 - Rs. 330
  {
    name: 'Dezolo max Clorex 500ml',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 330,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Dezolo Max Clorex 500ml (ඩෙසොලෝ මැක්ස් ක්ලෝරෙක්ස් 500ml) - රු. 330'
  },
  // 12. Morteen - 1 - Rs. 1100
  {
    name: 'Morteen',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Mortein Insect Killer Spray (මෝටීන් ස්ප්‍රේ) - රු. 1100'
  },
  // 13. HIT - 3 - Rs. 790
  {
    name: 'HIT',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 790,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'HIT Insect Killer Spray (හිට් කෘමිනාශක ස්ප්‍රේ) - රු. 790'
  },
  // 14. lysol 200ml - 3 - Rs. 250
  {
    name: 'lysol 200ml',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Lysol Disinfectant 200ml (ලයිසෝල් 200ml) - රු. 250'
  },
  // 15. lysol 500ml - 3 - Rs. 500
  {
    name: 'lysol 500ml',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 500,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Lysol Disinfectant 500ml (ලයිසෝල් 500ml) - රු. 500'
  },
  // 16. Car wash 500ml - 1 - Rs. 490
  {
    name: 'Car wash 500ml',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 490,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Car Wash Shampoo 500ml (කාර් වොෂ් 500ml) - රු. 490'
  },
  // 17. Harpic 200ml - 2 - Rs. 265
  {
    name: 'Harpic 200ml',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 265,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Harpic Toilet Cleaner 200ml (හාපික් 200ml) - රු. 265'
  },
  // 18. Harpic 500ml - 2 - Rs. 480
  {
    name: 'Harpic 500ml',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 480,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Harpic Toilet Cleaner 500ml (හාපික් 500ml) - රු. 480'
  },
  // 19. Lysol Glass Cleaner 250ml - 1 - Rs. 375
  {
    name: 'Lysol Glass Cleaner 250ml',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 375,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Lysol Glass Cleaner 250ml (ලයිසෝල් වීදුරු පිරිසිදුකාරක 250ml) - රු. 375'
  },
  // 20. Glass Cleaner 200ml - 3 - Rs. 340
  {
    name: 'Glass Cleaner 200ml',
    category: 'ගෘහ උපකරණ',
    subCategory: 'පිරිසිදුකාරක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 340,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Glass Cleaner Spray 200ml (වීදුරු පිරිසිදුකාරක 200ml) - රු. 340'
  },
  // 21. Flex Tape - 1 - Rs. 250
  {
    name: 'Flex Tape',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ටේප්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Flex Waterproof Tape (ෆ්ලෙක්ස් ටේප්) - රු. 250'
  },
  // 22. 1 x 2 1/2 Double Bush - 4 - Rs. 750
  {
    name: '1 x 2 1/2 Double Bush',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1" x 2 1/2" Double Bush (ඩබල් බුෂ් 1" x 2 1/2") - රු. 750'
  },
  // 23. 1 1/4 x 2 Double Bush - 4 - Rs. 1300
  {
    name: '1 1/4 x 2 Double Bush',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1300,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/4" x 2" Double Bush (ඩබල් බුෂ් 1 1/4" x 2") - රු. 1300'
  },
  // 24. 1 1/4 x 3 Double Bush - 4 - Rs. 1100
  {
    name: '1 1/4 x 3 Double Bush',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/4" x 3" Double Bush (ඩබල් බුෂ් 1 1/4" x 3") - රු. 1100'
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

  console.log('\n🎉 Batch 9 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
