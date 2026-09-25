const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const itemsToProcess = [
  // 1. 14 x 160 ඩ්රිල් කටු | 5 | -
  {
    name: '14 x 160 ඩ්රිල් කටු',
    matchNames: ['14 x 160 ඩ්රිල් කටු', '14x160 ඩ්රිල් කටු', '14 x 160 Drill Bit', '14 x 160 Drill bit'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '14 x 160 ඩ්රිල් කටු (Qty: 5)'
  },
  // 2. 8 x 150 / 210 ඩ්රිල් කටු | 5 | Rs. 750
  {
    name: '8 x 150 / 210 ඩ්රිල් කටු',
    matchNames: ['8 x 150 / 210 ඩ්රිල් කටු', '8x150/210 ඩ්රිල් කටු', '8 x 150/210 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 750,
    description: '8 x 150 / 210 ඩ්රිල් කටු (රු. 750 | Qty: 5)'
  },
  // 3. 10 x 210 ඩ්රිල් කටු | 5 | Rs. 750
  {
    name: '10 x 210 ඩ්රිල් කටු',
    matchNames: ['10 x 210 ඩ්රිල් කටු', '10x210 ඩ්රිල් කටු', '10 x 210 Drill bit'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 750,
    description: '10 x 210 ඩ්රිල් කටු (රු. 750 | Qty: 5)'
  },
  // 4. 10 x 100 x 160 ඩ්රිල් කටු | 4 | RS. 590
  {
    name: '10 x 100 x 160 ඩ්රිල් කටු',
    matchNames: ['10 x 100 x 160 ඩ්රිල් කටු', '10x100x160 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 590,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 590,
    description: '10 x 100 x 160 ඩ්රිල් කටු (රු. 590 | Qty: 4)'
  },
  // 5. 8 x 100 x 160 ඩ්රිල් කටු | 5 | RS. 650
  {
    name: '8 x 100 x 160 ඩ්රිල් කටු',
    matchNames: ['8 x 100 x 160 ඩ්රිල් කටු', '8x100x160 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 650,
    description: '8 x 100 x 160 ඩ්රිල් කටු (රු. 650 | Qty: 5)'
  },
  // 6. 14 x 210 ඩ්රිල් කටු | 4 | RS. 925
  {
    name: '14 x 210 ඩ්රිල් කටු',
    matchNames: ['14 x 210 ඩ්රිල් කටු', '14x210 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 925,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 925,
    description: '14 x 210 ඩ්රිල් කටු (රු. 925 | Qty: 4)'
  },
  // 7. 12 x 210 ඩ්රිල් කටු | 5 | RS. 750
  {
    name: '12 x 210 ඩ්රිල් කටු',
    matchNames: ['12 x 210 ඩ්රිල් කටු', '12x210 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 750,
    description: '12 x 210 ඩ්රිල් කටු (රු. 750 | Qty: 5)'
  },
  // 8. 12 x 100 x 160 ඩ්රිල් කටු | 4 | RS. 750
  {
    name: '12 x 100 x 160 ඩ්රිල් කටු',
    matchNames: ['12 x 100 x 160 ඩ්රිල් කටු', '12x100x160 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 750,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 750,
    description: '12 x 100 x 160 ඩ්රිල් කටු (රු. 750 | Qty: 4)'
  },
  // 9. 17 x 280 x 25 ඩ්රිල් කටු | 5 | RS. 780
  {
    name: '17 x 280 x 25 ඩ්රිල් කටු',
    matchNames: ['17 x 280 x 25 ඩ්රිල් කටු', '17x280x25 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 780,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 780,
    description: '17 x 280 x 25 ඩ්රිල් කටු (රු. 780 | Qty: 5)'
  },
  // 10. 14 x 200 ඩ්රිල් කටු | 2 | RS. 725
  {
    name: '14 x 200 ඩ්රිල් කටු',
    matchNames: ['14 x 200 ඩ්රිල් කටු', '14x200 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 725,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 725,
    description: '14 x 200 ඩ්රිල් කටු (රු. 725 | Qty: 2)'
  },
  // 11. 14 x 250 ඩ්රිල් කටු | 6 | RS. 650
  {
    name: '14 x 250 ඩ්රිල් කටු',
    matchNames: ['14 x 250 ඩ්රිල් කටු', '14x250 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 650,
    qty: 6,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 650,
    description: '14 x 250 ඩ්රිල් කටු (රු. 650 | Qty: 6)'
  },
  // 12. 18 x 300 ඩ්රිල් කටු | 4 | RS. 1200
  {
    name: '18 x 300 ඩ්රිල් කටු',
    matchNames: ['18 x 300 ඩ්රිල් කටු', '18x300 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 1200,
    description: '18 x 300 ඩ්රිල් කටු (රු. 1,200 | Qty: 4)'
  },
  // 13. 16 x 300 ඩ්රිල් කටු | 15 | RS. 950
  {
    name: '16 x 300 ඩ්රිල් කටු',
    matchNames: ['16 x 300 ඩ්රිල් කටු', '16x300 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 950,
    qty: 15,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 950,
    description: '16 x 300 ඩ්රිල් කටු (රු. 950 | Qty: 15)'
  },
  // 14. 3/8" ඩ්රිල් කටු | 5 | RS. 310
  {
    name: '3/8" ඩ්රිල් කටු',
    matchNames: ['3/8" ඩ්රිල් කටු', '3/8 ඩ්රිල් කටු', '3/8" Drill Bit', '3/8 Drill Bit'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 310,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 310,
    description: '3/8" ඩ්රිල් කටු (රු. 310 | Qty: 5)'
  },
  // 15. 1/2" ඩ්රිල් කටු | 5 | RS. 375
  {
    name: '1/2" ඩ්රිල් කටු',
    matchNames: ['1/2" ඩ්රිල් කටු', '1/2 ඩ්රිල් කටු', '1/2" Drill Bit', '1/2 Drill Bit'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 375,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 375,
    description: '1/2" ඩ්රිල් කටු (රු. 375 | Qty: 5)'
  },
  // 16. 1/4" ඩ්රිල් කටු | 6 | RS. 180
  {
    name: '1/4" ඩ්රිල් කටු',
    matchNames: ['1/4" ඩ්රිල් කටු', '1/4 ඩ්රිල් කටු', '1/4" Drill Bit', '1/4 Drill Bit'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 180,
    qty: 6,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 180,
    description: '1/4" ඩ්රිල් කටු (රු. 180 | Qty: 6)'
  },
  // 17. 1/4 Borgh ඩ්රිල් කටු | 10 | RS. 120
  {
    name: '1/4" Borgh ඩ්රිල් කටු',
    matchNames: ['1/4" Borgh ඩ්රිල් කටු', '1/4 Borgh ඩ්රිල් කටු', '1/4" Bosch ඩ්රිල් කටු (Borgh)'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 120,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 120,
    description: '1/4" Borgh ඩ්රිල් කටු (රු. 120 | Qty: 10)'
  },
  // 18. 3/8 Borgh ඩ්රිල් කටු | 10 | RS. 275
  {
    name: '3/8" Borgh ඩ්රිල් කටු',
    matchNames: ['3/8" Borgh ඩ්රිල් කටු', '3/8 Borgh ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 275,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 275,
    description: '3/8" Borgh ඩ්රිල් කටු (රු. 275 | Qty: 10)'
  },
  // 19. 3/16 Borgh ඩ්රිල් කටු | 10 | RS. 165
  {
    name: '3/16" Borgh ඩ්රිල් කටු',
    matchNames: ['3/16" Borgh ඩ්රිල් කටු', '3/16 Borgh ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 165,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 165,
    description: '3/16" Borgh ඩ්රිල් කටු (රු. 165 | Qty: 10)'
  },
  // 20. 5/32 Borgh ඩ්රිල් කටු | 10 | RS. 75
  {
    name: '5/32" Borgh ඩ්රිල් කටු',
    matchNames: ['5/32" Borgh ඩ්රිල් කටු', '5/32 Borgh ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 75,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 75,
    description: '5/32" Borgh ඩ්රිල් කටු (රු. 75 | Qty: 10)'
  },
  // 21. 1/8 ඩ්රිල් කටු | 10 | RS. 50
  {
    name: '1/8" ඩ්රිල් කටු',
    matchNames: ['1/8" ඩ්රිල් කටු', '1/8 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 50,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 50,
    description: '1/8" ඩ්රිල් කටු (රු. 50 | Qty: 10)'
  },
  // 22. 5/32 ඩ්රිල් කටු | 16 | RS. 25
  {
    name: '5/32" ඩ්රිල් කටු',
    matchNames: ['5/32" ඩ්රිල් කටු', '5/32 ඩ්රිල් කටු'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 25,
    qty: 16,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 25,
    description: '5/32" ඩ්රිල් කටු (රු. 25 | Qty: 16)'
  },
  // 23. 5/8" ඩ්රිල් කටු | 1 | RS. 1300
  {
    name: '5/8" ඩ්රිල් කටු',
    matchNames: ['5/8" ඩ්රිල් කටු', '5/8 ඩ්රිල් කටු', '5/8" Drill Bit', '5/8 Drill Bit'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1300,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 1300,
    description: '5/8" ඩ්රිල් කටු (රු. 1,300 | Qty: 1)'
  }
];

function generateBarcode() {
  return '20' + Math.floor(Math.random() * 9999999999).toString().padStart(10, '0');
}

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

function processDatabase(dbPath) {
  return new Promise((resolve) => {
    if (!fs.existsSync(dbPath)) {
      console.log(`[SKIP] DB not found: ${dbPath}`);
      return resolve();
    }

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(`[ERROR] Cannot open ${dbPath}:`, err.message);
        return resolve();
      }
    });

    db.serialize(() => {
      let completed = 0;
      const total = itemsToProcess.length;

      itemsToProcess.forEach((item) => {
        const placeholders = item.matchNames.map(() => 'name = ?').join(' OR ');
        const checkSql = `SELECT id, name, qty, sellPrice, barcode FROM items WHERE ${placeholders}`;

        db.get(checkSql, item.matchNames, (err, existing) => {
          if (err) {
            console.error(`[ERROR] Checking "${item.name}":`, err.message);
          } else if (existing) {
            const updateSql = `
              UPDATE items
              SET name = ?, category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, qty = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ?
              WHERE id = ?
            `;
            db.run(
              updateSql,
              [
                item.name, item.category, item.subCategory, item.unit,
                item.costPrice, item.sellPrice, item.qty,
                item.packSize, item.packUnit, item.loosePrice, item.description,
                existing.id
              ],
              function (err) {
                if (err) {
                  console.error(`[ERROR] Updating ID ${existing.id}:`, err.message);
                } else {
                  console.log(`[UPDATE] ID ${existing.id}: "${existing.name}" -> "${item.name}" | Qty: ${item.qty} | Price: ${item.sellPrice}`);
                }
              }
            );
          } else {
            const barcode = generateBarcode();
            const insertSql = `
              INSERT INTO items (name, category, subCategory, unit, costPrice, sellPrice, qty, packSize, packUnit, loosePrice, barcode, description)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
              insertSql,
              [
                item.name, item.category, item.subCategory, item.unit,
                item.costPrice, item.sellPrice, item.qty,
                item.packSize, item.packUnit, item.loosePrice, barcode, item.description
              ],
              function (err) {
                if (err) {
                  console.error(`[ERROR] Inserting "${item.name}":`, err.message);
                } else {
                  console.log(`[INSERT] ID ${this.lastID}: "${item.name}" | Qty: ${item.qty} | Price: ${item.sellPrice} | Barcode: ${barcode}`);
                }
              }
            );
          }

          completed++;
          if (completed === total) {
            db.close(() => {
              console.log(`\n✅ Done: ${dbPath}\n`);
              resolve();
            });
          }
        });
      });
    });
  });
}

(async () => {
  for (const dbPath of dbPaths) {
    await processDatabase(dbPath);
  }
  console.log('🎉 All databases processed for Batch 47 (Drill Bits)!');
})();
