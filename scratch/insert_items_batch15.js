const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 1/2" Pvc ball valve (Plumtek) - 50 - Rs. 525
  {
    name: '1/2" Pvc ball valve (Plumtek)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 525,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Plumtek 1/2" PVC Ball Valve (ප්ලම්ටෙක් 1/2" බෝල් වෑල්) - රු. 525'
  },
  // 2. 1/2" Pvc ball valve (S-lon) - 10 - Rs. 445
  {
    name: '1/2" Pvc ball valve (S-lon)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 445,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'S-lon 1/2" PVC Ball Valve (එස්ලෝන් 1/2" බෝල් වෑල්) - රු. 445'
  },
  // 3. 1/2" Pvc ball valve (Arpico) - 15 - Rs. 450
  {
    name: '1/2" Pvc ball valve (Arpico)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 15,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Arpico 1/2" PVC Ball Valve (ආපිකෝ 1/2" බෝල් වෑල්) - රු. 450'
  },
  // 4. 1/2" Pvc ball valve (Super pvc) - 9 - Rs. 450
  {
    name: '1/2" Pvc ball valve (Super pvc)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 9,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Super PVC 1/2" Ball Valve (සුපර් PVC 1/2" බෝල් වෑල්) - රු. 450'
  },
  // 5. 1/2" Pvc ball valve (Yala) - 9 - Rs. 480
  {
    name: '1/2" Pvc ball valve (Yala)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 480,
    qty: 9,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Yala 1/2" PVC Ball Valve (යාල 1/2" බෝල් වෑල්) - රු. 480'
  },
  // 6. 1/2" Pvc ball valve (Aquasource) - 9 - Rs. 375
  {
    name: '1/2" Pvc ball valve (Aquasource)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 375,
    qty: 9,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Aquasource 1/2" PVC Ball Valve (ඇක්වාසෝස් 1/2" බෝල් වෑල්) - රු. 375'
  },
  // 7. 3/4" Pvc ball valve (Tulsj) - 1 - Rs. 520
  {
    name: '3/4" Pvc ball valve (Tulsj)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 520,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Tulsi 3/4" PVC Ball Valve (තුල්සි 3/4" බෝල් වෑල්) - රු. 520'
  },
  // 8. 1/2" Pvc ball valve (Fishdi) - 2 - Rs. 450
  {
    name: '1/2" Pvc ball valve (Fishdi)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Fishdi 1/2" PVC Ball Valve (ෆිෂ්ඩි 1/2" බෝල් වෑල්) - රු. 450'
  },
  // 9. 3/4" Pvc ball valve (ERA) - 2 - Rs. 650
  {
    name: '3/4" Pvc ball valve (ERA)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ERA 3/4" PVC Ball Valve (ERA 3/4" බෝල් වෑල්) - රු. 650'
  },
  // 10. 1" Pvc ball valve (Plumtek) - 9 - Rs. 950
  {
    name: '1" Pvc ball valve (Plumtek)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 9,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Plumtek 1" PVC Ball Valve (ප්ලම්ටෙක් 1" බෝල් වෑල්) - රු. 950'
  },
  // 11. 1" Pvc ball valve (Madhav) - 8 - Rs. 600
  {
    name: '1" Pvc ball valve (Madhav)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 600,
    qty: 8,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Madhav 1" PVC Ball Valve (මාධව් 1" බෝල් වෑල්) - රු. 600'
  },
  // 12. 1" Pvc ball valve (MD) - 1 - Rs. 480
  {
    name: '1" Pvc ball valve (MD)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 480,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'MD 1" PVC Ball Valve (MD 1" බෝල් වෑල්) - රු. 480'
  },
  // 13. 1" Pvc ball valve (Super pvc) - 3 - Rs. 575
  {
    name: '1" Pvc ball valve (Super pvc)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 575,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Super PVC 1" Ball Valve (සුපර් PVC 1" බෝල් වෑල්) - රු. 575'
  },
  // 14. 1" Pvc ball valve (Arpico) - 12 - Rs. 850
  {
    name: '1" Pvc ball valve (Arpico)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 850,
    qty: 12,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Arpico 1" PVC Ball Valve (ආපිකෝ 1" බෝල් වෑල්) - රු. 850'
  },
  // 15. 1 1/4" Pvc ball valve (Arpico) - 5 - Rs. 975
  {
    name: '1 1/4" Pvc ball valve (Arpico)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 975,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Arpico 1 1/4" PVC Ball Valve (ආපිකෝ 1 1/4" බෝල් වෑල්) - රු. 975'
  },
  // 16. 1 1/4" Pvc ball valve (S-lon) - 3 - Rs. 1240
  {
    name: '1 1/4" Pvc ball valve (S-lon)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1240,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'S-lon 1 1/4" PVC Ball Valve (එස්ලෝන් 1 1/4" බෝල් වෑල්) - රු. 1240'
  },
  // 17. 2" Pvc ball valve (Arpico) - 1 - Rs. 1850
  {
    name: '2" Pvc ball valve (Arpico)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1850,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Arpico 2" PVC Ball Valve (ආපිකෝ 2" බෝල් වෑල්) - රු. 1850'
  },
  // 18. 2" Pvc ball valve (Compact) - 1 - Rs. 1450
  {
    name: '2" Pvc ball valve (Compact)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1450,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Compact 2" PVC Ball Valve (කොම්පැක්ට් 2" බෝල් වෑල්) - රු. 1450'
  },
  // 19. 1/4" Ancor bolte ඇණ - 200 - Rs. 50
  {
    name: '1/4" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 50,
    qty: 200,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 1/4" (ඇන්කර් බෝල්ට් ඇණ 1/4") - රු. 50'
  },
  // 20. 5/16" Ancor bolte ඇණ - 100 - Rs. 65
  {
    name: '5/16" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 65,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 5/16" (ඇන්කර් බෝල්ට් ඇණ 5/16") - රු. 65'
  },
  // 21. 3/8" Ancor bolte ඇණ - 70 - Rs. 80
  {
    name: '3/8" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 80,
    qty: 70,
    reorderLevel: 15,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 3/8" (ඇන්කර් බෝල්ට් ඇණ 3/8") - රු. 80'
  },
  // 22. 1/2" Ancor bolte ඇණ - 30 - Rs. 120
  {
    name: '1/2" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 120,
    qty: 30,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 1/2" (ඇන්කර් බෝල්ට් ඇණ 1/2") - රු. 120'
  },
  // 23. 5/8" Ancor bolte ඇණ - 20 - Rs. 65
  {
    name: '5/8" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 65,
    qty: 20,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 5/8" (ඇන්කර් බෝල්ට් ඇණ 5/8") - රු. 65'
  },
  // 24. 3" Ancor bolte ඇණ - 64 - Rs. 120
  {
    name: '3" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 120,
    qty: 64,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 3" (ඇන්කර් බෝල්ට් ඇණ 3") - රු. 120'
  },
  // 25. 5" Ancor bolte ඇණ - 10 - Rs. 225
  {
    name: '5" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 225,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 5" (ඇන්කර් බෝල්ට් ඇණ 5") - රු. 225'
  },
  // 26. 4" Ancor bolte ඇණ - 3 - Rs. 150
  {
    name: '4" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 4" (ඇන්කර් බෝල්ට් ඇණ 4") - රු. 150'
  },
  // 27. 6" Ancor bolte ඇණ - 45 - Rs. 220
  {
    name: '6" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 220,
    qty: 45,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 6" (ඇන්කර් බෝල්ට් ඇණ 6") - රු. 220'
  },
  // 28. 2 1/2" Ancor bolte ඇණ - 4 - Rs. 80
  {
    name: '2 1/2" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 80,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 2 1/2" (ඇන්කර් බෝල්ට් ඇණ 2 1/2") - රු. 80'
  },
  // 29. 2" Ancor bolte ඇණ - 1 - Rs. 75
  {
    name: '2" Ancor bolte ඇණ',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 75,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anchor Bolt 2" (ඇන්කර් බෝල්ට් ඇණ 2") - රු. 75'
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

  console.log('\n🎉 Batch 15 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
