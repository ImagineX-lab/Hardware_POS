const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. Clear horse 5/8" | අඩි 100 | අඩි 1 -> RS 50
  {
    name: 'Clear horse 5/8"',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'හෝස් (Hose)',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 5000,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'ft',
    loosePrice: 50,
    description: 'Clear Horse 5/8" (100ft Roll) - රෝල = රු. 5000 / අඩි 1 = රු. 50'
  },
  // 2. Clear horse 3/4" | අඩි 100 | අඩි 1 -> RS 70
  {
    name: 'Clear horse 3/4"',
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'හෝස් (Hose)',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 7000,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'ft',
    loosePrice: 70,
    description: 'Clear Horse 3/4" (100ft Roll) - රෝල = රු. 7000 / අඩි 1 = රු. 70'
  },
  // 3. KevilTon braker 6A | 24 | RS. 810
  {
    name: 'Kevilton Braker 6A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 810,
    qty: 24,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton Circuit Breaker 6A (කෙවිල්ටන් බ්‍රේකර් 6A) - රු. 810'
  },
  // 4. kevilton braker 20A | 10 | RS. 810
  {
    name: 'Kevilton Braker 20A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 810,
    qty: 10,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton Circuit Breaker 20A (කෙවිල්ටන් බ්‍රේකර් 20A) - රු. 810'
  },
  // 5. ORANGE braker 20A | 4 | RS. 825
  {
    name: 'Orange Braker 20A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 825,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange Circuit Breaker 20A (ඔරේන්ජ් බ්‍රේකර් 20A) - රු. 825'
  },
  // 6. Safetaa braker 20A | 5 | RS. 650
  {
    name: 'Safetaa Braker 20A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Safetaa Circuit Breaker 20A (සේෆ්ටා බ්‍රේකර් 20A) - රු. 650'
  },
  // 7. Safetaa braker 32A | 5 | RS. 650
  {
    name: 'Safetaa Braker 32A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Safetaa Circuit Breaker 32A (සේෆ්ටා බ්‍රේකර් 32A) - රු. 650'
  },
  // 8. Aelifv main Switch 40A | 4 | RS. 1200
  {
    name: 'Aelifv Main Switch 40A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Aelifv Main Switch 40A (මේන් ස්විච් 40A) - රු. 1200'
  },
  // 9. CHINT braker 20A | 4 | RS. 1050
  {
    name: 'CHINT Braker 20A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'CHINT Circuit Breaker 20A (චින්ට් බ්‍රේකර් 20A) - රු. 1050'
  },
  // 10. CHINT braker 32A | 2 | RS. 1050
  {
    name: 'CHINT Braker 32A',
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
    description: 'CHINT Circuit Breaker 32A (චින්ට් බ්‍රේකර් 32A) - රු. 1050'
  },
  // 11. ORANGE braker 16A | 8 | RS. 770
  {
    name: 'Orange Braker 16A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 770,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange Circuit Breaker 16A (ඔරේන්ජ් බ්‍රේකර් 16A) - රු. 770'
  },
  // 12. ORANGE braker 6A | 5 | RS. 770
  {
    name: 'Orange Braker 6A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 770,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange Circuit Breaker 6A (ඔරේන්ජ් බ්‍රේකර් 6A) - රු. 770'
  },
  // 13. ORANGE braker 32A | 3 | RS. 1070
  {
    name: 'Orange Braker 32A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1070,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange Circuit Breaker 32A (ඔරේන්ජ් බ්‍රේකර් 32A) - රු. 1070'
  },
  // 14. Krypton 20A | 12 | RS. 980
  {
    name: 'Krypton Braker 20A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 980,
    qty: 12,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Krypton Circuit Breaker 20A (ක්‍රිප්ටන් බ්‍රේකර් 20A) - රු. 980'
  },
  // 15. Krypton 10A | 2 | RS. 980
  {
    name: 'Krypton Braker 10A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 980,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Krypton Circuit Breaker 10A (ක්‍රිප්ටන් බ්‍රේකර් 10A) - රු. 980'
  },
  // 16. ACL 10A | 4 | RS. 700
  {
    name: 'ACL Braker 10A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 700,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ACL Circuit Breaker 10A (ACL බ්‍රේකර් 10A) - රු. 700'
  },
  // 17. KEVILTON 10A | 2 | RS. 1125
  {
    name: 'Kevilton Braker 10A',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1125,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton Circuit Breaker 10A (කෙවිල්ටන් බ්‍රේකර් 10A) - රු. 1125'
  },
  // 18. KEVILTON Trip switch | 2 | RS. 6335
  {
    name: 'Kevilton Trip Switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 6335,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton Trip Switch / RCCB (කෙවිල්ටන් ට්‍රිප් ස්විච්) - රු. 6335'
  },
  // 19. KEVILTON main Switch | 2 | RS. 2500
  {
    name: 'Kevilton Main Switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Kevilton Main Switch / Isolator (කෙවිල්ටන් මේන් ස්විච්) - රු. 2500'
  },
  // 20. Orson Trip switch | 4 | RS. 2250
  {
    name: 'Orson Trip Switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2250,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orson Trip Switch / RCCB (ඕසන් ට්‍රිප් ස්විච්) - රු. 2250'
  },
  // 21. Wusley main switch | 4 | RS. 1960
  {
    name: 'Wusley Main Switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1960,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Wusley Main Switch / Isolator (වස්ලි මේන් ස්විච්) - රු. 1960'
  },
  // 22. ORANGE Trip Switch (5) | 7 | RS. 7475
  {
    name: 'Orange Trip Switch (5)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 7475,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange Trip Switch (5) / RCCB (ඔරේන්ජ් ට්‍රිප් ස්විච් 5) - රු. 7475'
  },
  // 23. ORANGE Trip switch (life) | 3 | RS. 9280
  {
    name: 'Orange Trip Switch (Life)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 9280,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Orange Trip Switch (Life) / RCCB (ඔරේන්ජ් ලයිෆ් ට්‍රිප් ස්විච්) - රු. 9280'
  },
  // 24. CHINT Trip Switch | 3 | RS. 7950
  {
    name: 'CHINT Trip Switch',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 7950,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'CHINT Trip Switch / RCCB (චින්ට් ට්‍රිප් ස්විච්) - රු. 7950'
  },
  // 25. braker 6A (Nomal) | 2 | RS. 500
  {
    name: 'Braker 6A (Normal)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 500,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Circuit Breaker 6A Normal (නෝමල් බ්‍රේකර් 6A) - රු. 500'
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
      console.log(`✅ Added new item: ID ${res.lastID} -> ${item.name} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice} | Loose: Rs. ${item.loosePrice} | Barcode: ${barcode}`);
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

  console.log('\n🎉 Batch 20 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
