const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 100kg තරාදි | 1 | 3750
  {
    name: '100kg තරාදි',
    matchNames: ['100kg තරාදි', '100kg taradi', '100 kg taradi'],
    category: 'මෙවලම්',
    subCategory: 'මැනුම් මෙවලම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3750,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 2. ඉලෙක්ට්රික් තරාදි | 2 | 975
  {
    name: 'ඉලෙක්ට්රික් තරාදි',
    matchNames: ['ඉලෙක්ට්රික් තරාදි', 'electric taradi', 'electric tharadi'],
    category: 'මෙවලම්',
    subCategory: 'මැනුම් මෙවලම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 975,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 3. කොමොඩ් ඇණ set | 4 | 235
  {
    name: 'කොමොඩ් ඇණ Set',
    matchNames: ['කොමොඩ් ඇණ Set', 'කොමොඩ් ඇණ set', 'commode ana set', 'komodu ana'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'සනිටරි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 235,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 4. 1/2" ඩ්රිල් කටු (යකඩ) | 2 | 1550
  {
    name: '1/2" ඩ්රිල් කටු (යකඩ)',
    matchNames: ['1/2" ඩ්රිල් කටු (යකඩ)', '1/2 drill katu yakada', '1/2" drill bit iron'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1550,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 5. 11.5" ඩ්රිල් කටු (යකඩ) | 5 | 2200
  {
    name: '11.5" ඩ්රිල් කටු (යකඩ)',
    matchNames: ['11.5" ඩ්රිල් කටු (යකඩ)', '11.5" drill bit iron', '11.5 drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 6. 10.5" ඩ්රිල් කටු (යකඩ) | 7 | 1778
  {
    name: '10.5" ඩ්රිල් කටු (යකඩ)',
    matchNames: ['10.5" ඩ්රිල් කටු (යකඩ)', '10.5" drill bit iron', '10.5 drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1778,
    qty: 7,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 7. 16.5" ඩ්රිල් කටු (යකඩ) | 24 | 478
  {
    name: '16.5" ඩ්රිල් කටු (යකඩ)',
    matchNames: ['16.5" ඩ්රිල් කටු (යකඩ)', '16.5" drill bit iron', '16.5 drill katu yakada'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 478,
    qty: 24,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 8. 16.5" ඩ්රිල් කටු (යකඩ) PE+ | 13 | 725
  {
    name: '16.5" ඩ්රිල් කටු (යකඩ) PE+',
    matchNames: ['16.5" ඩ්රිල් කටු (යකඩ) PE+', '16.5" drill bit PE+', '16.5 drill katu PE+'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 725,
    qty: 13,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 9. 10x5/16" ඩ්රිල් කටු (යකඩ) | 11 | 475
  {
    name: '10x5/16" ඩ්රිල් කටු (යකඩ)',
    matchNames: ['10x5/16" ඩ්රිල් කටු (යකඩ)', '10x5/16 drill bit iron', '10x5/16 drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 475,
    qty: 11,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 10. 3/8" ඩ්රිල් කටු (යකඩ) PE+ | 5 | 1388
  {
    name: '3/8" ඩ්රිල් කටු (යකඩ) PE+',
    matchNames: ['3/8" ඩ්රිල් කටු (යකඩ) PE+', '3/8" drill bit PE+', '3/8 drill katu PE+'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1388,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 11. 3/8" ඩ්රිල් කටු (යකඩ) | 4 | 550
  {
    name: '3/8" ඩ්රිල් කටු (යකඩ)',
    matchNames: ['3/8" ඩ්රිල් කටු (යකඩ)', '3/8" drill bit iron', '3/8 drill katu yakada'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 12. 3 1/2" 10mm ඩ්රිල් කටු (යකඩ) | 5 | 1260
  {
    name: '3 1/2" 10mm ඩ්රිල් කටු (යකඩ)',
    matchNames: ['3 1/2" 10mm ඩ්රිල් කටු (යකඩ)', '3.5" 10mm drill bit', '3 1/2 10mm drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1260,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 13. 1/4" Aplus ඩ්රිල් කටු (යකඩ) | 6 | 490
  {
    name: '1/4" Aplus ඩ්රිල් කටු (යකඩ)',
    matchNames: ['1/4" Aplus ඩ්රිල් කටු (යකඩ)', '1/4" Aplus drill bit', '1/4 Aplus drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 490,
    qty: 6,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 14. 1/4" PE+ ඩ්රිල් කටු (යකඩ) | 7 | 707
  {
    name: '1/4" PE+ ඩ්රිල් කටු (යකඩ)',
    matchNames: ['1/4" PE+ ඩ්රිල් කටු (යකඩ)', '1/4" PE+ drill bit', '1/4 PE+ drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 707,
    qty: 7,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 15. 16.5" presto ඩ්රිල් කටු | 15 | 325
  {
    name: '16.5" Presto ඩ්රිල් කටු',
    matchNames: ['16.5" Presto ඩ්රිල් කටු', '16.5" presto drill bit', '16.5 presto drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 325,
    qty: 15,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 16. 1/4" Bosch ඩ්රිල් කටු | 10 | 275
  {
    name: '1/4" Bosch ඩ්රිල් කටු',
    matchNames: ['1/4" Bosch ඩ්රිල් කටු', '1/4" Bosch drill bit', '1/4 Bosch drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 275,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 17. 16.3" ඩ්රිල් කටු PE+ | 2 | 400
  {
    name: '16.3" ඩ්රිල් කටු PE+',
    matchNames: ['16.3" ඩ්රිල් කටු PE+', '16.3" drill bit PE+', '16.3 drill katu PE+'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 400,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 18. 32.5" ඩ්රිල් කටු PE+ | 10 | 280
  {
    name: '32.5" ඩ්රිල් කටු PE+',
    matchNames: ['32.5" ඩ්රිල් කටු PE+', '32.5" drill bit PE+', '32.5 drill katu PE+'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 280,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 19. 8.1" ඩ්රිල් කටු | 36 | 180
  {
    name: '8.1" ඩ්රිල් කටු',
    matchNames: ['8.1" ඩ්රිල් කටු', '8.1" drill bit', '8.1 drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 180,
    qty: 36,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 20. 1.5mm ඩ්රිල් කටු | 14 | 150
  {
    name: '1.5mm ඩ්රිල් කටු',
    matchNames: ['1.5mm ඩ්රිල් කටු', '1.5mm drill bit', '1.5mm drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 14,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 21. 4.0mm ඩ්රිල් කටු | 11 | 260
  {
    name: '4.0mm ඩ්රිල් කටු',
    matchNames: ['4.0mm ඩ්රිල් කටු', '4.0mm drill bit', '4mm drill katu'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 260,
    qty: 11,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 22. 3.0mm ඩ්රිල් කටු (wurth) | 19 | 225
  {
    name: '3.0mm ඩ්රිල් කටු (Wurth)',
    matchNames: ['3.0mm ඩ්රිල් කටු (Wurth)', '3.0mm drill bit wurth', '3mm Wurth drill katu', '3.0mm ඩ්රිල් කටු (wurth)'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 225,
    qty: 19,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 23. Ronghui tools | 13 | 280
  {
    name: 'Ronghui Tools',
    matchNames: ['Ronghui Tools', 'Ronghui tools', 'ronghui'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 280,
    qty: 13,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 24. OURUISI CUT (8) | 20 | 150
  {
    name: 'OURUISI CUT (8)',
    matchNames: ['OURUISI CUT (8)', 'OURUISI CUT', 'ouruisi cut 8'],
    category: 'මෙවලම්',
    subCategory: 'ඩ්රිල් කටු',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 25. ප්ලාස්ටික් දම් වැල් (කොළ) | 10 | 350
  {
    name: 'ප්ලාස්ටික් දම් වැල් (කොළ)',
    matchNames: ['ප්ලාස්ටික් දම් වැල් (කොළ)', 'plastic dam wel kolu', 'plastic chain green'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 350,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
  // 26. ප්ලාස්ටික් දම් වැල් (රතු) | 6 | 320
  {
    name: 'ප්ලාස්ටික් දම් වැල් (රතු)',
    matchNames: ['ප්ලාස්ටික් දම් වැල් (රතු)', 'plastic dam wel rathu', 'plastic chain red'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 320,
    qty: 6,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
  },
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
      const total = itemsToAdd.length;

      itemsToAdd.forEach((item) => {
        // Build WHERE clause to check any matchName
        const placeholders = item.matchNames.map(() => 'name = ?').join(' OR ');
        const checkSql = `SELECT id, name, qty, sellPrice FROM items WHERE ${placeholders}`;

        db.get(checkSql, item.matchNames, (err, existing) => {
          if (err) {
            console.error(`[ERROR] Checking "${item.name}":`, err.message);
          } else if (existing) {
            console.log(`[EXISTS] "${existing.name}" (ID:${existing.id}) | Qty:${existing.qty} | Price:${existing.sellPrice} — skipping`);
          } else {
            const barcode = generateBarcode();
            const insertSql = `
              INSERT INTO items (name, category, subCategory, unit, costPrice, sellPrice, qty, packSize, packUnit, loosePrice, barcode)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.run(
              insertSql,
              [
                item.name,
                item.category,
                item.subCategory,
                item.unit,
                item.costPrice,
                item.sellPrice,
                item.qty,
                item.packSize,
                item.packUnit,
                item.loosePrice,
                barcode,
              ],
              function (err) {
                if (err) {
                  console.error(`[ERROR] Inserting "${item.name}":`, err.message);
                } else {
                  console.log(`[INSERT] "${item.name}" | ID:${this.lastID} | Qty:${item.qty} | Price:${item.sellPrice} | Barcode:${barcode}`);
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
  console.log('🎉 All databases processed!');
})();
