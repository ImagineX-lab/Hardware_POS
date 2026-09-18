const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 4 වවුල් සරනේරු - 50 - Rs. 220
  {
    name: '4 වවුල් සරනේරු',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 220,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '4" වවුල් සරනේරු (T-Hinge / Butterfly Hinge 4") - රු. 220'
  },
  // 2. 5 වවුල් සරනේරු - 50 - Rs. 275
  {
    name: '5 වවුල් සරනේරු',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 275,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '5" වවුල් සරනේරු (T-Hinge / Butterfly Hinge 5") - රු. 275'
  },
  // 3. 6 වවුල් සරනේරු - 10 - Rs. 325
  {
    name: '6 වවුල් සරනේරු',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 325,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '6" වවුල් සරනේරු (T-Hinge / Butterfly Hinge 6") - රු. 325'
  },
  // 4. 8 වවුල් සරනේරු - 6 - Rs. 450
  {
    name: '8 වවුල් සරනේරු',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '8" වවුල් සරනේරු (T-Hinge / Butterfly Hinge 8") - රු. 450'
  },
  // 5. 4 1/2 Makita Disk - 12 - Rs. 550
  {
    name: '4 1/2 Makita Disk',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 12,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Makita Cutting Disk 4 1/2" (මැකිටා ඩිස්ක් 4 1/2") - රු. 550'
  },
  // 6. 4 1/2 Diamond Disk PE+ (රු. 2100) - 2 - Rs. 2100
  {
    name: '4 1/2 Diamond Disk PE+ (රු. 2100)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2100,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'PE+ Diamond Cutting Disk 4 1/2" - රු. 2100'
  },
  // 7. 4 Diamond Disk PE+ (රු. 1587) - 4 - Rs. 1587
  {
    name: '4 Diamond Disk PE+ (රු. 1587)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1587,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'PE+ Diamond Cutting Disk 4" - රු. 1587'
  },
  // 8. 4 1/2 Diamond Disk PE+ (රු. 2150) - 10 - Rs. 2150
  {
    name: '4 1/2 Diamond Disk PE+ (රු. 2150)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2150,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'PE+ Diamond Cutting Disk 4 1/2" - රු. 2150'
  },
  // 9. 4 Diamond Disk PE+ (රු. 1467) - 20 - Rs. 1467
  {
    name: '4 Diamond Disk PE+ (රු. 1467)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1467,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'PE+ Diamond Cutting Disk 4" - රු. 1467'
  },
  // 10. 4 1/2 115mm Disk Star - 5 - Rs. 650
  {
    name: '4 1/2 115mm Disk Star',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Star Cutting Disk 4 1/2" / 115mm (ස්ටාර් ඩිස්ක් 115mm) - රු. 650'
  },
  // 11. 4 105mm Disk - 1 - Rs. 725
  {
    name: '4 105mm Disk',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 725,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Cutting Disk 4" / 105mm (ඩිස්ක් 4" 105mm) - රු. 725'
  },
  // 12. 4 Bosan Disk - 20 - Rs. 720
  {
    name: '4 Bosan Disk',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 720,
    qty: 20,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Bosan Cutting Disk 4" (බෝසන් ඩිස්ක් 4") - රු. 720'
  },
  // 13. 4 1/2 Grinding wheel (H) - 2 - Rs. 400
  {
    name: '4 1/2 Grinding wheel (H)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 400,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Grinding Wheel 4 1/2" H (ග්‍රයින්ඩර් වීල් 4 1/2") - රු. 400'
  },
  // 14. 4 1/2 PET Disk (N) - 2 - Rs. 350
  {
    name: '4 1/2 PET Disk (N)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'PET Cutting Disk 4 1/2" N (පෙට් ඩිස්ක් 4 1/2") - රු. 350'
  },
  // 15. 4 1/2 PET Disk (H) - 2 - Rs. 550
  {
    name: '4 1/2 PET Disk (H)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'PET Cutting Disk 4 1/2" H (පෙට් ඩිස්ක් 4 1/2") - රු. 550'
  },
  // 16. Rotation Disk - 1 - Rs. 750
  {
    name: 'Rotation Disk',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Rotation Disk (රොටේෂන් ඩිස්ක්) - රු. 750'
  },
  // 17. 4 Segmented Disk - 2 - Rs. 750
  {
    name: '4 Segmented Disk',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Segmented Diamond Disk 4" (සෙග්මන්ට් ඩිස්ක් 4") - රු. 750'
  },
  // 18. 4 1/2 PET Cutting wheel - 18 - Rs. 250
  {
    name: '4 1/2 PET Cutting wheel',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 18,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'PET Cutting Wheel 4 1/2" (පෙට් කටින් වීල් 4 1/2") - රු. 250'
  },
  // 19. 4 1/2 Cutting wheel - 36 - Rs. 150
  {
    name: '4 1/2 Cutting wheel',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 36,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Cutting Wheel 4 1/2" (කටින් වීල් 4 1/2") - රු. 150'
  },
  // 20. 4 Cutting wheel - 87 - Rs. 100
  {
    name: '4 Cutting wheel',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 100,
    qty: 87,
    reorderLevel: 15,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Cutting Wheel 4" (කටින් වීල් 4") - රු. 100'
  },
  // 21. 4.3/8 ලී කපන Disk PE+ - 12 - Rs. 660
  {
    name: '4.3/8 ලී කපන Disk PE+',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 660,
    qty: 12,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'PE+ Wood Cutting Disk 4 3/8" (ලී කපන ඩිස්ක් PE+) - රු. 660'
  },
  // 22. 4 1/2 ලී කපන Disk - 5 - Rs. 550
  {
    name: '4 1/2 ලී කපන Disk',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wood Cutting Disk 4 1/2" (ලී කපන ඩිස්ක් 4 1/2") - රු. 550'
  },
  // 23. 4 ලී කපන Disk (PE+) - 6 - Rs. 689
  {
    name: '4 ලී කපන Disk (PE+)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 689,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'PE+ Wood Cutting Disk 4" (ලී කපන ඩිස්ක් PE+ 4") - රු. 689'
  },
  // 24. 115mm ලී කපන Disk (GMT) - 2 - Rs. 550
  {
    name: '115mm ලී කපන Disk (GMT)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'GMT Wood Cutting Disk 115mm (ලී කපන ඩිස්ක් GMT 115mm) - රු. 550'
  },
  // 25. 115mm ලී කපන 380 Disk - 30 - Rs. 580
  {
    name: '115mm ලී කපන 380 Disk',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 580,
    qty: 30,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wood Cutting Disk 115mm 380 (ලී කපන ඩිස්ක් 115mm) - රු. 580'
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

  console.log('\n🎉 Batch 12 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
