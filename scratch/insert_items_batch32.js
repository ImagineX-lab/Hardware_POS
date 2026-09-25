const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. ZINC ALLOY | 7 | RS. 1750
  {
    name: 'Zinc Alloy Door Lock',
    matchNames: [
      'Zinc Alloy Door Lock',
      'ZINC ALLOY',
      'Zinc Alloy',
      'Zinc Alloy lock',
      'zinc alloy lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Zinc Alloy Door Lock (සින්ක් ඇලෝයි දොර ලොක්) - රු. 1,750'
  },
  // 2. High Quality door look | 2 | RS. 1950
  {
    name: 'High Quality Door Lock',
    matchNames: [
      'High Quality Door Lock',
      'High Quality door look',
      'High Quality door lock',
      'high quality door lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1950,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'High Quality Door Lock (හයි කොලිටි දොර ලොක්) - රු. 1,950'
  },
  // 3. Advanced out Side (Mvp | 1 | RS. 950
  {
    name: 'Advanced Outside Lock (MVP)',
    matchNames: [
      'Advanced Outside Lock (MVP)',
      'Advanced out Side (Mvp',
      'Advanced out Side (MVP)',
      'Advanced Outside MVP lock',
      'advanced out side mvp'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Advanced Outside Lock MVP (දොර ලොක් MVP) - රු. 950'
  },
  // 4. A.L.A LAXMI | 3 | RS. 2750
  {
    name: 'A.L.A Laxmi Lock',
    matchNames: [
      'A.L.A Laxmi Lock',
      'A.L.A LAXMI',
      'ALA LAXMI',
      'ALA Laxmi Lock',
      'ala laxmi lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2750,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'A.L.A Laxmi Door Lock (A.L.A ලක්ෂ්මී දොර ලොක්) - රු. 2,750'
  },
  // 5. KPL lock | 2 | RS. 2100
  {
    name: 'KPL Door Lock',
    matchNames: [
      'KPL Door Lock',
      'KPL lock',
      'KPL Lock',
      'kpl lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2100,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'KPL Door Lock (KPL දොර ලොක්) - රු. 2,100'
  },
  // 6. UNION lock | 1 | RS. 3900
  {
    name: 'Union Door Lock',
    matchNames: [
      'Union Door Lock',
      'UNION lock',
      'UNION Lock',
      'union lock',
      'Union Lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3900,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Union Door Lock (යූනියන් දොර ලොක්) - රු. 3,900'
  },
  // 7. Razer lock | 1 | RS. 2450
  {
    name: 'Razer Door Lock',
    matchNames: [
      'Razer Door Lock',
      'Razer lock',
      'Razer Lock',
      'razer lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2450,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Razer Door Lock (රේසර් දොර ලොක්) - රු. 2,450'
  },
  // 8. ONION | 1 | RS. 2250
  {
    name: 'Onion Door Lock',
    matchNames: [
      'Onion Door Lock',
      'ONION',
      'ONION lock',
      'Onion lock',
      'onion lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2250,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Onion Door Lock (ඔනියන් දොර ලොක්) - රු. 2,250'
  },
  // 9. Skore lock | 3 | RS. 3250
  {
    name: 'Skore Door Lock',
    matchNames: [
      'Skore Door Lock',
      'Skore lock',
      'Skore Lock',
      'skore lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3250,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Skore Door Lock (ස්කෝර් දොර ලොක්) - රු. 3,250'
  },
  // 10. CORONEL lock | 3 | RS. 1550
  {
    name: 'Coronel Door Lock',
    matchNames: [
      'Coronel Door Lock',
      'CORONEL lock',
      'CORONEL Lock',
      'coronel lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1550,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Coronel Door Lock (කොරොනෙල් දොර ලොක්) - රු. 1,550'
  },
  // 11. BELIZZA lock | 1 | RS. 6700
  {
    name: 'Belizza Door Lock Set',
    matchNames: [
      'Belizza Door Lock Set',
      'BELIZZA lock',
      'BELIZZA Lock',
      'Belizza lock',
      'belizza lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 6700,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Belizza Door Handle Lock Set (බෙලිසා දොර හැන්ඩ්ල් ලොක් සෙට්) - රු. 6,700'
  },
  // 12. SQIEK lock | 6 | RS. 3750
  {
    name: 'SQIEK Door Lock',
    matchNames: [
      'SQIEK Door Lock',
      'SQIEK lock',
      'SQIEK Lock',
      'sqiek lock',
      'Sqiek lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3750,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'SQIEK Door Lock (SQIEK දොර ලොක්) - රු. 3,750'
  },
  // 13. Razar Set lock | 4 | RS. 3510
  {
    name: 'Razar Door Lock Set',
    matchNames: [
      'Razar Door Lock Set',
      'Razar Set lock',
      'Razer Set lock',
      'Razar lock set',
      'razar set lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3510,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Razar Door Handle Lock Set (රේසර් හැන්ඩ්ල් ලොක් සෙට්) - රු. 3,510'
  },
  // 14. Jormen lock set | 2 | RS. 3600
  {
    name: 'Jormen Door Lock Set',
    matchNames: [
      'Jormen Door Lock Set',
      'Jormen lock set',
      'Jormen lock',
      'jormen lock set'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3600,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Jormen Door Lock Set (ජෝර්මන් දොර ලොක් සෙට්) - රු. 3,600'
  },
  // 15. Booz lock | 1 | RS. 5700
  {
    name: 'Booz Door Lock Set',
    matchNames: [
      'Booz Door Lock Set',
      'Booz lock',
      'Booz Lock',
      'booz lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 5700,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Booz Door Lock Set (බූස් දොර ලොක් සෙට්) - රු. 5,700'
  },
  // 16. G.J.S lock | 2 | RS. 5250
  {
    name: 'G.J.S Door Lock Set',
    matchNames: [
      'G.J.S Door Lock Set',
      'G.J.S lock',
      'GJS lock',
      'G.J.S Lock',
      'g.j.s lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 5250,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'G.J.S Door Lock Set (GJS දොර ලොක් සෙට්) - රු. 5,250'
  },
  // 17. Rich world | 1 | RS. 4950
  {
    name: 'Rich World Door Lock Set',
    matchNames: [
      'Rich World Door Lock Set',
      'Rich world',
      'Rich World',
      'Rich World lock',
      'rich world lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4950,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Rich World Door Lock Set (රිච් වර්ල්ඩ් දොර ලොක් සෙට්) - රු. 4,950'
  },
  // 18. REXEL lock | 1 | RS. 2280
  {
    name: 'Rexel Door Lock',
    matchNames: [
      'Rexel Door Lock',
      'REXEL lock',
      'REXEL Lock',
      'Rexel lock',
      'rexel lock'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2280,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Rexel Door Lock (රෙක්සෙල් දොර ලොක්) - රු. 2,280'
  },
  // 19. Drawer lock | 1 | RS. 395
  {
    name: 'Drawer Lock',
    matchNames: [
      'Drawer Lock',
      'Drawer lock',
      'drawer lock',
      'ඩ්‍රෝවර් ලොක්',
      'දෙච්චි ලොක්'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 395,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Drawer Lock (ඩ්‍රෝවර් / මේස ලාච්චු ලොක්) - රු. 395'
  },
  // 20. EPI FIX Gum | 8 | RS. 1220
  {
    name: 'Epi Fix Gum',
    matchNames: [
      'Epi Fix Gum',
      'EPI FIX Gum',
      'Epifix Gum',
      'epi fix gum',
      'epifix'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1220,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Epi Fix Epoxy Adhesive Gum (එපි ෆික්ස් ගම්) - රු. 1,220'
  },
  // 21. Elephant Gum | 4 | RS. 1100
  {
    name: 'Elephant Gum',
    matchNames: [
      'Elephant Gum',
      'elephant gum',
      'ඇලිෆන්ට් ගම්',
      'Elephant Contact Adhesive'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1100,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Elephant Adhesive Gum (ඇලිෆන්ට් ගම්) - රු. 1,100'
  },
  // 22. කොප්පි ඇණ 1 1/2" | 50 | RS. 7
  {
    name: '1 1/2" කොප්පි ඇණ',
    matchNames: [
      '1 1/2" කොප්පි ඇණ',
      'කොප්පි ඇණ 1 1/2"',
      'කොප්පි ඇණ 1 1/2',
      '1 1/2 කොප්පි ඇණ',
      '1.5" කොප්පි ඇණ'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 7,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/2" කොප්පි ඇණ (1 1/2" Round Head Nails / Copper Nails) - රු. 7'
  },
  // 23. කොප්පි ඇණ 2 | 50 | RS. 10
  {
    name: '2" කොප්පි ඇණ',
    matchNames: [
      '2" කොප්පි ඇණ',
      'කොප්පි ඇණ 2"',
      'කොප්පි ඇණ 2',
      '2 කොප්පි ඇණ'
    ],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 50,
    reorderLevel: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2" කොප්පි ඇණ (2" Round Head Nails / Copper Nails) - රු. 10'
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
    let existing = null;
    for (const matchName of item.matchNames) {
      existing = await get('SELECT id, name, qty, sellPrice, barcode FROM items WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))', [matchName]);
      if (existing) break;
    }

    if (existing) {
      let barcode = (existing.barcode || '').trim();
      if (!barcode) {
        barcode = generateBarcode(existingBarcodes);
      }
      await run(
        `UPDATE items 
         SET name = ?, barcode = ?, category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, qty = ?, reorderLevel = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ?
         WHERE id = ?`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, existing.id]
      );
      console.log(`🔄 Updated item: ID ${existing.id} -> ${item.name} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice} | Barcode: ${barcode}`);
      updated++;
    } else {
      const barcode = generateBarcode(existingBarcodes);
      const res = await run(
        `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, packSize, packUnit, loosePrice, description, image, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, Date.now()]
      );
      console.log(`✅ Added new item: ID ${res.lastID} -> ${item.name} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice} | Barcode: ${barcode}`);
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

  console.log('\n🎉 Batch 32 Door Locks, Gum & Koppi Nails items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
