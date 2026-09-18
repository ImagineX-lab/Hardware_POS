const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. Kevilton 3 gang switch - 21 - Rs. 950
  {
    name: 'Kevilton 3 gang switch',
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
    description: 'Kevilton 3 Gang 1 Way Switch (කෙවිල්ටන් 3 ගැන්ග් ස්විච්) - රු. 950'
  },
  // 2. Kevilton 4 gang switch - 21 - Rs. 1200
  {
    name: 'Kevilton 4 gang switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 21,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton 4 Gang 1 Way Switch (කෙවිල්ටන් 4 ගැන්ග් ස්විච්) - රු. 1200'
  },
  // 3. Kevilton 5 gang switch - 13 - Rs. 1550
  {
    name: 'Kevilton 5 gang switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1550,
    qty: 13,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton 5 Gang 1 Way Switch (කෙවිල්ටන් 5 ගැන්ග් ස්විච්) - රු. 1550'
  },
  // 4. Bell Switch (Krypton) - 2 - Rs. 1050
  {
    name: 'Bell Switch (Krypton)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Krypton Bell Press Switch (ක්‍රිප්ටන් බෙල් ස්විච්) - රු. 1050'
  },
  // 5. Krypton plug base 13A 1 gang - 9 - Rs. 1200
  {
    name: 'Krypton plug base 13A 1 gang',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 9,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Krypton 13A 1 Gang Plug Base Socket (ක්‍රිප්ටන් 13A ප්ලග් බේස්) - රු. 1200'
  },
  // 6. Krypton 1 gang switch - 3 - Rs. 740
  {
    name: 'Krypton 1 gang switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 740,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Krypton 1 Gang Switch (ක්‍රිප්ටන් 1 ගැන්ග් ස්විච්) - රු. 740'
  },
  // 7. Krypton 2 gang switch - 7 - Rs. 1050
  {
    name: 'Krypton 2 gang switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Krypton 2 Gang Switch (ක්‍රිප්ටන් 2 ගැන්ග් ස්විච්) - රු. 1050'
  },
  // 8. Krypton 3 gang switch - 8 - Rs. 1240
  {
    name: 'Krypton 3 gang switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1240,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Krypton 3 Gang Switch (ක්‍රිප්ටන් 3 ගැන්ග් ස්විච්) - රු. 1240'
  },
  // 9. Krypton 4 gang switch - 8 - Rs. 1710
  {
    name: 'Krypton 4 gang switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1710,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Krypton 4 Gang Switch (ක්‍රිප්ටන් 4 ගැන්ග් ස්විච්) - රු. 1710'
  },
  // 10. Kevilton bell switch - 13 - Rs. 343
  {
    name: 'Kevilton bell switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 343,
    qty: 13,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton Bell Press Switch (කෙවිල්ටන් බෙල් ස්විච්) - රු. 343'
  },
  // 11. Motor switch - 2 - Rs. 2100
  {
    name: 'Motor switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2100,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Water Motor Switch / Starter (මෝටර් ස්විච්) - රු. 2100'
  },
  // 12. Fan Switch 950 - 2 - Rs. 950
  {
    name: 'Fan Switch 950',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Fan Speed Switch 950 (ෆෑන් ස්විච් 950) - රු. 950'
  },
  // 13. Orange රෝටරි Switch - 2 - Rs. 2340
  {
    name: 'Orange රෝටරි Switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2340,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange Rotary Changeover Switch (ඔරේන්ජ් රෝටරි ස්විච්) - රු. 2340'
  },
  // 14. Orange Flip Switch (main) - 1 - Rs. 0
  {
    name: 'Orange Flip Switch (main)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange Main Flip Switch / Isolator (ඔරේන්ජ් මේන් ෆ්ලිප් ස්විච්)'
  },
  // 15. Foot valve (Anton) 2" - 8 - Rs. 1900
  {
    name: 'Foot valve (Anton) 2"',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1900,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Anton Foot Valve 2" (ඇන්ටන් ෆුට් වෑල් 2") - රු. 1900'
  },
  // 16. Foot valve (DLT) 1 1/2" - 1 - Rs. 950
  {
    name: 'Foot valve (DLT) 1 1/2"',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'DLT Foot Valve 1 1/2" (DLT ෆුට් වෑල් 1 1/2") - රු. 950'
  },
  // 17. Foot valve (Flow Tech) 1" - 11 - Rs. 650
  {
    name: 'Foot valve (Flow Tech) 1"',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 11,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Flow Tech Foot Valve 1" (ෆ්ලෝටෙක් ෆුට් වෑල් 1") - රු. 650'
  },
  // 18. Foot valve (Yala) 1" - 3 - Rs. 625
  {
    name: 'Foot valve (Yala) 1"',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 625,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Yala Foot Valve 1" (යාල ෆුට් වෑල් 1") - රු. 625'
  },
  // 19. Foot valve (ERA) 1" - 6 - Rs. 690
  {
    name: 'Foot valve (ERA) 1"',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ERA Foot Valve 1" (ERA ෆුට් වෑල් 1") - රු. 690'
  },
  // 20. 1 Union (Super pvc) - 8 - Rs. 450
  {
    name: '1 Union (Super pvc)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Super PVC Union Socket 1" (1" යුනියන් Super PVC) - රු. 450'
  },
  // 21. 1 Union (S-lon) - 8 - Rs. 565
  {
    name: '1 Union (S-lon)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 565,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'S-lon Union Socket 1" (1" යුනියන් S-lon) - රු. 565'
  },
  // 22. 3/4 union (XP) - 4 - Rs. 290
  {
    name: '3/4 union (XP)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 290,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'XP Union Socket 3/4" (3/4" යුනියන් XP) - රු. 290'
  },
  // 23. 1 foot valve (S-lon) - 9 - Rs. 915
  {
    name: '1 foot valve (S-lon)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 915,
    qty: 9,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'S-lon Foot Valve 1" (1" ෆුට් වෑල් S-lon) - රු. 915'
  },
  // 24. 1 foot valve (Kevin) - 5 - Rs. 650
  {
    name: '1 foot valve (Kevin)',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'වෑල් (Valves)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevin Foot Valve 1" (1" ෆුට් වෑල් කෙවින්) - රු. 650'
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

  console.log('\n🎉 Batch 14 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
