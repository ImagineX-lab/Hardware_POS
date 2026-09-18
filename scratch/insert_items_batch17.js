const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 25 uf Condencer (Rs. 750) - 1 - Rs. 750
  {
    name: '25 uf Condencer (Rs. 750)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '25uF Motor Capacitor / Condenser (25uF කන්ඩෙන්සර්) - රු. 750'
  },
  // 2. 10 uf Condencer - 2 - Rs. 690
  {
    name: '10 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 690,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '10uF Motor Capacitor / Condenser (10uF කන්ඩෙන්සර්) - රු. 690'
  },
  // 3. 25 uf Condencer (Rs. 950) - 6 - Rs. 950
  {
    name: '25 uf Condencer (Rs. 950)',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '25uF Motor Capacitor / Condenser (25uF කන්ඩෙන්සර්) - රු. 950'
  },
  // 4. 50 uf Condencer - 2 - Rs. 1150
  {
    name: '50 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1150,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '50uF Motor Capacitor / Condenser (50uF කන්ඩෙන්සර්) - රු. 1150'
  },
  // 5. 30 uf Condencer - 3 - Rs. 950
  {
    name: '30 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '30uF Motor Capacitor / Condenser (30uF කන්ඩෙන්සර්) - රු. 950'
  },
  // 6. 40 uf Condencer - 1 - Rs. 950
  {
    name: '40 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '40uF Motor Capacitor / Condenser (40uF කන්ඩෙන්සර්) - රු. 950'
  },
  // 7. 20 uf Condencer - 6 - Rs. 920
  {
    name: '20 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 920,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '20uF Motor Capacitor / Condenser (20uF කන්ඩෙන්සර්) - රු. 920'
  },
  // 8. 80 uf Condencer - 3 - Rs. 790
  {
    name: '80 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 790,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '80uF Motor Capacitor / Condenser (80uF කන්ඩෙන්සර්) - රු. 790'
  },
  // 9. 16 uf Condencer - 7 - Rs. 750
  {
    name: '16 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '16uF Motor Capacitor / Condenser (16uF කන්ඩෙන්සර්) - රු. 750'
  },
  // 10. 12 uf Condencer - 2 - Rs. 650
  {
    name: '12 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '12uF Motor Capacitor / Condenser (12uF කන්ඩෙන්සර්) - රු. 650'
  },
  // 11. 8 uf Condencer - 4 - Rs. 650
  {
    name: '8 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '8uF Motor Capacitor / Condenser (8uF කන්ඩෙන්සර්) - රු. 650'
  },
  // 12. 14 uf Condencer - 1 - Rs. 720
  {
    name: '14 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 720,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '14uF Motor Capacitor / Condenser (14uF කන්ඩෙන්සර්) - රු. 720'
  },
  // 13. 18 uf Condencer - 2 - Rs. 775
  {
    name: '18 uf Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 775,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '18uF Motor Capacitor / Condenser (18uF කන්ඩෙන්සර්) - රු. 775'
  },
  // 14. Galaxy plus Condencer - 1 - Rs. 750
  {
    name: 'Galaxy plus Condencer',
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Galaxy Plus Fan / Motor Capacitor (ගැලැක්සි ප්ලස් කන්ඩෙන්සර්) - රු. 750'
  },
  // 15. ක්ලෝරීන් කුඩු පැකට් - 10 - Rs. 160
  {
    name: 'ක්ලෝරීන් කුඩු පැකට්',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pkt',
    costPrice: 0,
    sellPrice: 160,
    qty: 10,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pkt',
    loosePrice: 0,
    description: 'ක්ලෝරීන් කුඩු පැකට් (Chlorine Powder Packet) - රු. 160'
  },
  // 16. කෝක්ටේල් කෝබා 100g - 33 - Rs. 180
  {
    name: 'කෝක්ටේල් කෝබා 100g',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pkt',
    costPrice: 0,
    sellPrice: 180,
    qty: 33,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pkt',
    loosePrice: 0,
    description: 'කෝක්ටේල් කෝබා 100g (Cocktail Koba Insecticide 100g) - රු. 180'
  },
  // 17. නිල් කුඩු පැකට් 100g - 15 - Rs. 130
  {
    name: 'නිල් කුඩු පැකට් 100g',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pkt',
    costPrice: 0,
    sellPrice: 130,
    qty: 15,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pkt',
    loosePrice: 0,
    description: 'නිල් කුඩු පැකට් 100g (Blue Powder Packet 100g) - රු. 130'
  },
  // 18. නිල්චින් කුඩු පැකට් 200g - 9 - Rs. 160
  {
    name: 'නිල්චින් කුඩු පැකට් 200g',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pkt',
    costPrice: 0,
    sellPrice: 160,
    qty: 9,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pkt',
    loosePrice: 0,
    description: 'නිල්චින් බ්ලීචින්ග් කුඩු පැකට් 200g (Bleaching Powder 200g) - රු. 160'
  },
  // 19. කුහුඹු නාශක පැකට් 100g - 29 - Rs. 230
  {
    name: 'කුහුඹු නාශක පැකට් 100g',
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pkt',
    costPrice: 0,
    sellPrice: 230,
    qty: 29,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pkt',
    loosePrice: 0,
    description: 'කුහුඹු නාශක කුඩු පැකට් 100g (Ant Killer Powder Packet 100g) - රු. 230'
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

  console.log('\n🎉 Batch 17 items added successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
