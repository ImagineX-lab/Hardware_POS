const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const itemsToProcess = [
  // 1. 6" - 0.30 අමානෝ Gate ෂීට් - Rs.320
  {
    name: '6" - 0.30 අමානෝ Gate ෂීට්',
    matchNames: ['6" - 0.30 අමානෝ Gate ෂීට්', '6" - 0.30 Amano Gate Sheet', '6" - 0.30 Amano Gate sheet', '6" 0.30 අමානෝ Gate ෂීට්', '6 - 0.30 අමානෝ Gate ෂීට්', '6" - 0.30 Amano Gate ෂීට්'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'Amano Sheets',
    unit: 'ft',
    costPrice: 0,
    sellPrice: 320,
    qty: 0,
    packSize: 1,
    packUnit: 'ft',
    loosePrice: 320,
    description: '6" - 0.30 Amano Gate Sheet (අඩිය රු. 320)'
  },
  // 2. 6" - 0.25 අමානෝ Gate ෂීට් - Rs.250
  {
    name: '6" - 0.25 අමානෝ Gate ෂීට්',
    matchNames: ['6" - 0.25 අමානෝ Gate ෂීට්', '6" - 0.25 Amano Gate Sheet', '6" - 0.25 Amano Gate sheet', '6" 0.25 අමානෝ Gate ෂීට්', '6 - 0.25 අමානෝ Gate ෂීට්', '6" - 0.25 Amano Gate ෂීට්'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'Amano Sheets',
    unit: 'ft',
    costPrice: 0,
    sellPrice: 250,
    qty: 0,
    packSize: 1,
    packUnit: 'ft',
    loosePrice: 250,
    description: '6" - 0.25 Amano Gate Sheet (අඩිය රු. 250)'
  },
  // 3. 6" - 0.20 අමානෝ Gate ෂීට් - Rs.200
  {
    name: '6" - 0.20 අමානෝ Gate ෂීට්',
    matchNames: ['6" - 0.20 අමානෝ Gate ෂීට්', '6" - 0.20 Amano Gate Sheet', '6" - 0.20 Amano Gate sheet', '6" 0.20 අමානෝ Gate ෂීට්', '6 - 0.20 අමානෝ Gate ෂීට්', '6" - 0.20 Amano Gate ෂීට්'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'Amano Sheets',
    unit: 'ft',
    costPrice: 0,
    sellPrice: 200,
    qty: 0,
    packSize: 1,
    packUnit: 'ft',
    loosePrice: 200,
    description: '6" - 0.20 Amano Gate Sheet (අඩිය රු. 200)'
  },
  // 4. 5" - 0.30 අමානෝ Gate ෂීට් - Rs.320
  {
    name: '5" - 0.30 අමානෝ Gate ෂීට්',
    matchNames: ['5" - 0.30 අමානෝ Gate ෂීට්', '5" - 0.30 Amano Gate Sheet', '5" - 0.30 Amano Gate sheet', '5" 0.30 අමානෝ Gate ෂීට්', '5 - 0.30 අමානෝ Gate ෂීට්', '5" - 0.30 Amano Gate ෂීට්'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'Amano Sheets',
    unit: 'ft',
    costPrice: 0,
    sellPrice: 320,
    qty: 0,
    packSize: 1,
    packUnit: 'ft',
    loosePrice: 320,
    description: '5" - 0.30 Amano Gate Sheet (අඩිය රු. 320)'
  },
  // 5. 5" - 0.25 අමානෝ Gate ෂීට් - Rs.250
  {
    name: '5" - 0.25 අමානෝ Gate ෂීට්',
    matchNames: ['5" - 0.25 අමානෝ Gate ෂීට්', '5" - 0.25 Amano Gate Sheet', '5" - 0.25 Amano Gate sheet', '5" 0.25 අමානෝ Gate ෂීට්', '5 - 0.25 අමානෝ Gate ෂීට්', '5" - 0.25 Amano Gate ෂීට්'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'Amano Sheets',
    unit: 'ft',
    costPrice: 0,
    sellPrice: 250,
    qty: 0,
    packSize: 1,
    packUnit: 'ft',
    loosePrice: 250,
    description: '5" - 0.25 Amano Gate Sheet (අඩිය රු. 250)'
  },
  // 6. 5" - 0.20 අමානෝ Gate ෂීට් - Rs.200
  {
    name: '5" - 0.20 අමානෝ Gate ෂීට්',
    matchNames: ['5" - 0.20 අමානෝ Gate ෂීට්', '5" - 0.20 Amano Gate Sheet', '5" - 0.20 Amano Gate sheet', '5" 0.20 අමානෝ Gate ෂීට්', '5 - 0.20 අමානෝ Gate ෂීට්', '5" - 0.20 Amano Gate ෂීට්'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'Amano Sheets',
    unit: 'ft',
    costPrice: 0,
    sellPrice: 200,
    qty: 0,
    packSize: 1,
    packUnit: 'ft',
    loosePrice: 200,
    description: '5" - 0.20 Amano Gate Sheet (අඩිය රු. 200)'
  },
  // 7. 4" - 0.30 අමානෝ Gate ෂීට් - Rs.320
  {
    name: '4" - 0.30 අමානෝ Gate ෂීට්',
    matchNames: ['4" - 0.30 අමානෝ Gate ෂීට්', '4" - 0.30 Amano Gate Sheet', '4" - 0.30 Amano Gate sheet', '4" 0.30 අමානෝ Gate ෂීට්', '4 - 0.30 අමානෝ Gate ෂීට්', '4" - 0.30 Amano Gate ෂීට්'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'Amano Sheets',
    unit: 'ft',
    costPrice: 0,
    sellPrice: 320,
    qty: 0,
    packSize: 1,
    packUnit: 'ft',
    loosePrice: 320,
    description: '4" - 0.30 Amano Gate Sheet (අඩිය රු. 320)'
  },
  // 8. 4" - 0.25 අමානෝ Gate ෂීට් - Rs.250
  {
    name: '4" - 0.25 අමානෝ Gate ෂීට්',
    matchNames: ['4" - 0.25 අමානෝ Gate ෂීට්', '4" - 0.25 Amano Gate Sheet', '4" - 0.25 Amano Gate sheet', '4" 0.25 අමානෝ Gate ෂීට්', '4 - 0.25 අමානෝ Gate ෂීට්', '4" - 0.25 Amano Gate ෂීට්'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'Amano Sheets',
    unit: 'ft',
    costPrice: 0,
    sellPrice: 250,
    qty: 0,
    packSize: 1,
    packUnit: 'ft',
    loosePrice: 250,
    description: '4" - 0.25 Amano Gate Sheet (අඩිය රු. 250)'
  },
  // 9. 4" - 0.20 අමානෝ Gate ෂීට් - Rs.200
  {
    name: '4" - 0.20 අමානෝ Gate ෂීට්',
    matchNames: ['4" - 0.20 අමානෝ Gate ෂීට්', '4" - 0.20 Amano Gate Sheet', '4" - 0.20 Amano Gate sheet', '4" 0.20 අමානෝ Gate ෂීට්', '4 - 0.20 අමානෝ Gate ෂීට්', '4" - 0.20 Amano Gate ෂීට්'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'Amano Sheets',
    unit: 'ft',
    costPrice: 0,
    sellPrice: 200,
    qty: 0,
    packSize: 1,
    packUnit: 'ft',
    loosePrice: 200,
    description: '4" - 0.20 Amano Gate Sheet (අඩිය රු. 200)'
  },
  // 10. 6" ඇස්බැස්ටෝස් ෂීට් (50 | Rs.3500)
  {
    name: 'ඇස්බැස්ටෝ sheet අඩි 6 (අලියා sheet)',
    matchNames: ['ඇස්බැස්ටෝ sheet අඩි 6 (අලියා sheet)', 'ඇස්බැස්ටෝ sheet අඩි 6', 'ඇස්බැස්ටෝස් ෂීට් අඩි 6', '6" ඇස්බැස්ටෝස් ෂීට්', '6\' ඇස්බැස්ටෝස් ෂීට්', '6ft ඇස්බැස්ටෝස් ෂීට්', '6" ඇස්බැස්ටෝස් sheet'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'ඇස්බැස්ටෝස් sheets',
    unit: 'sheet',
    costPrice: 0,
    sellPrice: 3500,
    qty: 50,
    packSize: 1,
    packUnit: 'sheet',
    loosePrice: 0,
    description: 'ඇස්බැස්ටෝ sheet (අලියා sheet) - අඩි 6: රු. 3,500'
  },
  // 11. 8" ඇස්බැස්ටෝස් ෂීට් (81 | Rs.4950)
  {
    name: 'ඇස්බැස්ටෝ sheet අඩි 8 (අලියා sheet)',
    matchNames: ['ඇස්බැස්ටෝ sheet අඩි 8 (අලියා sheet)', 'ඇස්බැස්ටෝ sheet අඩි 8', 'ඇස්බැස්ටෝස් ෂීට් අඩි 8', '8" ඇස්බැස්ටෝස් ෂීට්', '8\' ඇස්බැස්ටෝස් ෂීට්', '8ft ඇස්බැස්ටෝස් ෂීට්', '8" ඇස්බැස්ටෝස් sheet'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'ඇස්බැස්ටෝස් sheets',
    unit: 'sheet',
    costPrice: 0,
    sellPrice: 4950,
    qty: 81,
    packSize: 1,
    packUnit: 'sheet',
    loosePrice: 0,
    description: 'ඇස්බැස්ටෝ sheet (අලියා sheet) - අඩි 8: රු. 4,950'
  },
  // 12. 10" ඇස්බැස්ටෝස් ෂීට් (13 | Rs.5800)
  {
    name: 'ඇස්බැස්ටෝ sheet අඩි 10 (අලියා sheet)',
    matchNames: ['ඇස්බැස්ටෝ sheet අඩි 10 (අලියා sheet)', 'ඇස්බැස්ටෝ sheet අඩි 10', 'ඇස්බැස්ටෝස් ෂීට් අඩි 10', '10" ඇස්බැස්ටෝස් ෂීට්', '10\' ඇස්බැස්ටෝස් ෂීට්', '10ft ඇස්බැස්ටෝස් ෂීට්', '10" ඇස්බැස්ටෝස් sheet'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'ඇස්බැස්ටෝස් sheets',
    unit: 'sheet',
    costPrice: 0,
    sellPrice: 5800,
    qty: 13,
    packSize: 1,
    packUnit: 'sheet',
    loosePrice: 0,
    description: 'ඇස්බැස්ටෝ sheet (අලියා sheet) - අඩි 10: රු. 5,800'
  },
  // 13. 12" ඇස්බැස්ටෝස් ෂීට් (20 | Rs.6950)
  {
    name: 'ඇස්බැස්ටෝ sheet අඩි 12 (අලියා sheet)',
    matchNames: ['ඇස්බැස්ටෝ sheet අඩි 12 (අලියා sheet)', 'ඇස්බැස්ටෝ sheet අඩි 12', 'ඇස්බැස්ටෝස් ෂීට් අඩි 12', '12" ඇස්බැස්ටෝස් ෂීට්', '12\' ඇස්බැස්ටෝස් ෂීට්', '12ft ඇස්බැස්ටෝස් ෂීට්', '12" ඇස්බැස්ටෝස් sheet'],
    category: 'සෙවිලි උපකරණ',
    subCategory: 'ඇස්බැස්ටෝස් sheets',
    unit: 'sheet',
    costPrice: 0,
    sellPrice: 6950,
    qty: 20,
    packSize: 1,
    packUnit: 'sheet',
    loosePrice: 0,
    description: 'ඇස්බැස්ටෝ sheet (අලියා sheet) - අඩි 12: රු. 7,050 -> 6,950'
  },
  // 14. 1 1/2" ශොකට් (50 | Rs.280)
  {
    name: '1 1/2" ශොකට් (නෝමල්)',
    matchNames: ['1 1/2" ශොකට් (නෝමල්)', '1 1/2" ශොකට්', '1 1/2 ශොකට් (නෝමල්)', '1 1/2 ශොකට්', '1 1/2" Socket (Normal)', '1 1/2" Socket', '1 1/2 Socket'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 280,
    qty: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/2" Normal Socket'
  },
  // 15. 1 1/2" S lon ශොකට් (3 | Rs.250)
  {
    name: '1 1/2" ශොකට් (S-lon)',
    matchNames: ['1 1/2" ශොකට් (S-lon)', '1 1/2" S lon ශොකට්', '1 1/2" S-lon ශොකට්', '1 1/2 S-lon ශොකට්', '1 1/2 S lon ශොකට්', '1 1/2" Socket (S-lon)', '1 1/2" Socket S-lon'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/2" S-lon Socket'
  },
  // 16. 1/2" T slon ශොකට් (50 | Rs.100)
  {
    name: '1/2" T (S-lon)',
    matchNames: ['1/2" T (S-lon)', '1/2 T (S-lon)', '1/2" T slon ශොකට්', '1/2" T S-lon ශොකට්', '1/2 T slon ශොකට්', '1/2" Tee (S-lon)', '1/2" Tee Socket (S-lon)', '1/2" T Socket (S-lon)'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 100,
    qty: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1/2" T Socket (S-lon)'
  },
  // 17. 1" L bow (50 | Rs.120)
  {
    name: '1" L Bow (නෝමල්)',
    matchNames: ['1" L Bow (නෝමල්)', 'අගල L Bow (නෝමල්)', '1" L bow', '1" L Bow', '1" Elbow (Normal)', '1" Elbow', 'අගල L Bow'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 120,
    qty: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1" L Bow (Normal) / අගල L Bow'
  },
  // 18. 1" L bow S-lon (25 | Rs.150)
  {
    name: '1" L Bow (S-lon)',
    matchNames: ['1" L Bow (S-lon)', 'අගල L Bow (S-lon)', '1" L bow S-lon', '1" L Bow S-lon', '1" L-bow S-lon', '1" Elbow (S-lon)', 'අගල L Bow S-lon'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'S-lon බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 25,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1" L Bow (S-lon) / අගල L Bow (S-lon)'
  },
  // 19. 1 1/2" Arpico ශොකට් (50 | Rs.220)
  {
    name: '1 1/2" ශොකට් (Arpico)',
    matchNames: ['1 1/2" ශොකට් (Arpico)', '1 1/2" Arpico ශොකට්', '1 1/2 Arpico ශොකට්', '1 1/2" Socket (Arpico)', '1 1/2" Arpico Socket', '1 1/2" Arpico ශොකට්'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'Anton/National/Arpico බට',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 220,
    qty: 50,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/2" Arpico Socket'
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
  console.log('🎉 All databases processed successfully!');
})();
