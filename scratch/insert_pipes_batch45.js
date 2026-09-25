const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const pipesToAdd = [
  // 1. 1/2" S-lon බට - Rs.510
  {
    name: '1/2" S-lon බට',
    matchNames: ['1/2" S-lon බට', '1/2" S-lon Pipe', '1/2 S-lon බට', '1/2" Slon බට', '1/2" Sloan බට'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 510,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1/2" S-lon Pipe (බටය රු. 510)'
  },
  // 2. 3/4" S-lon බට - Rs.1250
  {
    name: '3/4" S-lon බට',
    matchNames: ['3/4" S-lon බට', '3/4" S-lon Pipe', '3/4 S-lon බට', '3/4" Slon බට', '3/4" Sloan බට'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 1250,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '3/4" S-lon Pipe (බටය රු. 1,250)'
  },
  // 3. 1" S-lon බට - Rs.790
  {
    name: '1" S-lon බට',
    matchNames: ['1" S-lon බට', '1" S-lon Pipe', '1 S-lon බට', '1" Slon බට', '1" Sloan බට'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 790,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1" S-lon Pipe (බටය රු. 790)'
  },
  // 4. 1 1/4" S-lon බට - Rs.1250
  {
    name: '1 1/4" S-lon බට',
    matchNames: ['1 1/4" S-lon බට', '1 1/4" S-lon Pipe', '1 1/4 S-lon බට', '1 1/4" Slon බට', '1 1/4" Sloan බට'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 1250,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1 1/4" S-lon Pipe (බටය රු. 1,250)'
  },
  // 5. 1 1/2" S-lon බට - Rs.950
  {
    name: '1 1/2" S-lon බට',
    matchNames: ['1 1/2" S-lon බට', '1 1/2" S-lon Pipe', '1 1/2 S-lon බට', '1 1/2" Slon බට', '1 1/2" Sloan බට'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 950,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1 1/2" S-lon Pipe (බටය රු. 950)'
  },
  // 6. 2" S-lon බට - Rs.1200
  {
    name: '2" S-lon බට',
    matchNames: ['2" S-lon බට', '2" S-lon Pipe', '2 S-lon බට', '2" Slon බට', '2" Sloan බට'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 1200,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '2" S-lon Pipe (බටය රු. 1,200)'
  },
  // 7. 3" ඩවුන් පයිප්ප බට - Rs.1300
  {
    name: '3" ඩවුන් පයිප්ප බට',
    matchNames: ['3" ඩවුන් පයිප්ප බට', '3" Down Pipe', '3" ඩවුන් පයිප්ප', '3 ඩවුන් පයිප්ප බට', '3" Down pipe බට', '3" Down Pipe බට'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'පයිප්ප හා සනිටරි',
    unit: 'length',
    costPrice: 0,
    sellPrice: 1300,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '3" Down Pipe (ඩවුන් පයිප්ප බටය රු. 1,300)'
  },
  // 8. 4" ගැනේජ් බට - Rs.3400
  {
    name: '4" ගැනේජ් බට',
    matchNames: ['4" ගැනේජ් බට', '4" Drainage Pipe', '4" ගැනේජ් පයිප්ප', '4 ගැනේජ් බට', '4" Drainage බට', '4" ඩ්‍රේනේජ් බට'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'පයිප්ප හා සනිටරි',
    unit: 'length',
    costPrice: 0,
    sellPrice: 3400,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '4" Drainage Pipe (ගැනේජ් බටය රු. 3,400)'
  },
  // 9. 6" Local බට - Rs.6250
  {
    name: '6" Local බට',
    matchNames: ['6" Local බට', '6" ලෝකල් බට', '6 Local බට', '6 ලෝකල් බට', '6" Local Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 6250,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '6" Local Pipe (බටය රු. 6,250)'
  },
  // 10. 1/2" Local බට - Rs.250
  {
    name: '1/2" Local බට',
    matchNames: ['1/2" Local බට', '1/2" ලෝකල් බට', '1/2 Local බට', '1/2 ලෝකල් බට', '1/2" Local Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 250,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1/2" Local Pipe (බටය රු. 250)'
  },
  // 11. 1" Local බට - Rs.350
  {
    name: '1" Local බට',
    matchNames: ['1" Local බට', '1" ලෝකල් බට', '1 Local බට', '1 ලෝකල් බට', '1" Local Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 350,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1" Local Pipe (බටය රු. 350)'
  },
  // 12. 1 1/4" Local බට - Rs.750
  {
    name: '1 1/4" Local බට',
    matchNames: ['1 1/4" Local බට', '1 1/4" ලෝකල් බට', '1 1/4 Local බට', '1 1/4 ලෝකල් බට', '1 1/4" Local Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 750,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1 1/4" Local Pipe (බටය රු. 750)'
  },
  // 13. 1 1/2" Local බට - Rs.600
  {
    name: '1 1/2" Local බට',
    matchNames: ['1 1/2" Local බට', '1 1/2" ලෝකල් බට', '1 1/2 Local බට', '1 1/2 ලෝකල් බට', '1 1/2" Local Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 600,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1 1/2" Local Pipe (බටය රු. 600)'
  },
  // 14. 2" Local බට - Rs.750
  {
    name: '2" Local බට',
    matchNames: ['2" Local බට', '2" ලෝකල් බට', '2 Local බට', '2 ලෝකල් බට', '2" Local Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 750,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '2" Local Pipe (බටය රු. 750)'
  },
  // 15. 3" Local බට - Rs.1050
  {
    name: '3" Local බට',
    matchNames: ['3" Local බට', '3" ලෝකල් බට', '3 Local බට', '3 ලෝකල් බට', '3" Local Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 1050,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '3" Local Pipe (බටය රු. 1,050)'
  },
  // 16. 4" Local බට - Rs.1950
  {
    name: '4" Local බට',
    matchNames: ['4" Local බට', '4" ලෝකල් බට', '4 Local බට', '4 ලෝකල් බට', '4" Local Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 1950,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '4" Local Pipe (බටය රු. 1,950)'
  },
  // 17. 1/2" Anton බට - Rs.200
  {
    name: '1/2" Anton බට',
    matchNames: ['1/2" Anton බට', '1/2" ඇන්ටන් බට', '1/2 Anton බට', '1/2" Anton Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 200,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1/2" Anton Pipe (බටය රු. 200)'
  },
  // 18. 3/4" Anton බට - Rs.1200
  {
    name: '3/4" Anton බට',
    matchNames: ['3/4" Anton බට', '3/4" ඇන්ටන් බට', '3/4 Anton බට', '3/4" Anton Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 1200,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '3/4" Anton Pipe (බටය රු. 1,200)'
  },
  // 19. 1" Anton බට - Rs.600
  {
    name: '1" Anton බට',
    matchNames: ['1" Anton බට', '1" ඇන්ටන් බට', '1 Anton බට', '1" Anton Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 600,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1" Anton Pipe (බටය රු. 600)'
  },
  // 20. 1 1/2" Anton බට - Rs.750
  {
    name: '1 1/2" Anton බට',
    matchNames: ['1 1/2" Anton බට', '1 1/2" ඇන්ටන් බට', '1 1/2 Anton බට', '1 1/2" Anton Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 750,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1 1/2" Anton Pipe (බටය රු. 750)'
  },
  // 21. 2" Anton බට - Rs.950
  {
    name: '2" Anton බට',
    matchNames: ['2" Anton බට', '2" ඇන්ටන් බට', '2 Anton බට', '2" Anton Pipe'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'length',
    costPrice: 0,
    sellPrice: 950,
    qty: 0,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '2" Anton Pipe (බටය රු. 950)'
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
      const total = pipesToAdd.length;

      pipesToAdd.forEach((item) => {
        const placeholders = item.matchNames.map(() => 'name = ?').join(' OR ');
        const checkSql = `SELECT id, name, qty, sellPrice, barcode FROM items WHERE ${placeholders}`;

        db.get(checkSql, item.matchNames, (err, existing) => {
          if (err) {
            console.error(`[ERROR] Checking "${item.name}":`, err.message);
          } else if (existing) {
            const updateSql = `
              UPDATE items
              SET name = ?, category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ?
              WHERE id = ?
            `;
            db.run(
              updateSql,
              [
                item.name, item.category, item.subCategory, item.unit,
                item.costPrice, item.sellPrice,
                item.packSize, item.packUnit, item.loosePrice, item.description,
                existing.id
              ],
              function (err) {
                if (err) {
                  console.error(`[ERROR] Updating ID ${existing.id}:`, err.message);
                } else {
                  console.log(`[UPDATE] ID ${existing.id}: "${existing.name}" -> "${item.name}" | Price: Rs.${item.sellPrice}`);
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
                  console.log(`[INSERT] ID ${this.lastID}: "${item.name}" | Price: Rs.${item.sellPrice} | Barcode: ${barcode}`);
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
  console.log('🎉 All databases processed for Batch 45 pipes!');
})();
