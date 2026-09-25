const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const itemsToProcess = [
  // 1. carton(කටන්)වයර් | අඩි 10 | අඩි 1-->RS. 25
  {
    name: 'කර්ටන් වයර් (Curtain Wire)',
    matchNames: ['කර්ටන් වයර්', 'කටන් වයර්', 'carton වයර්', 'Curtain Wire', 'කර්ටන් වයර් (Curtain Wire)', 'කටන් වයර් (Curtain Wire)', 'carton(කටන්)වයර්'],
    category: 'ගෘහ උපකරණ',
    subCategory: 'ගෘහ උපකරණ',
    unit: 'ft',
    costPrice: 0,
    sellPrice: 25,
    qty: 10,
    packSize: 1,
    packUnit: 'ft',
    loosePrice: 25,
    description: 'කර්ටන් වයර් (Curtain Wire) - 1ft රු. 25 | මුළු අඩි 10'
  },
  // 2. අඟල් 1 පොටි හැඳි | 3 | Rs.150
  {
    name: '1" පොටි හැඳි',
    matchNames: ['1" පොටි හැඳි', 'අඟල් 1 පොටි හැඳි', '1 inch Putty Knife', '1" Putty Knife', 'පොටි හැඳි 1"'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'පොටි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1" පොටි හැඳි (Putty Knife 1") - රු. 150 | Qty: 3'
  },
  // 3. අඟල් 2 පොටි හැඳි | 4 | Rs.225
  {
    name: '2" පොටි හැඳි',
    matchNames: ['2" පොටි හැඳි', 'අඟල් 2 පොටි හැඳි', '2 inch Putty Knife', '2" Putty Knife', 'පොටි හැඳි 2"'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'පොටි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 225,
    qty: 4,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2" පොටි හැඳි (Putty Knife 2") - රු. 225 | Qty: 4'
  },
  // 4. අඟල් 3 පොටි හැඳි | 9 | RS. 380
  {
    name: '3" පොටි හැඳි',
    matchNames: ['3" පොටි හැඳි', 'අඟල් 3 පොටි හැඳි', '3 inch Putty Knife', '3" Putty Knife', 'පොටි හැඳි 3"'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'පොටි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 380,
    qty: 9,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3" පොටි හැඳි (Putty Knife 3") - රු. 380 | Qty: 9'
  },
  // 5. අඟල් 4 පොටි හැඳි | 9 | RS. 400
  {
    name: '4" පොටි හැඳි',
    matchNames: ['4" පොටි හැඳි', 'අඟල් 4 පොටි හැඳි', '4 inch Putty Knife', '4" Putty Knife', 'පොටි හැඳි 4"'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'පොටි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 400,
    qty: 9,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '4" පොටි හැඳි (Putty Knife 4") - රු. 400 | Qty: 9'
  },
  // 6. අඟල් 5 පොටි හැඳි | 10 | RS. 400
  {
    name: '5" පොටි හැඳි',
    matchNames: ['5" පොටි හැඳි', 'අඟල් 5 පොටි හැඳි', '5 inch Putty Knife', '5" Putty Knife', 'පොටි හැඳි 5"'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'පොටි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 400,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '5" පොටි හැඳි (Putty Knife 5") - රු. 400 | Qty: 10'
  },
  // 7. ස්කීපර් පෑකට් | 5 | RS. 310
  {
    name: 'ස්ක්‍රැපර් පැකට් (Scraper Packet)',
    matchNames: ['ස්කීපර් පෑකට්', 'ස්ක්‍රැපර් පැකට්', 'Scraper Packet', 'ස්කීපර් පැකට්', 'ස්කීපර් පෑකට් (Scraper Packet)', 'ස්ක්‍රැපර් (Scraper) පැකට්'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pkt',
    costPrice: 0,
    sellPrice: 310,
    qty: 5,
    packSize: 1,
    packUnit: 'pkt',
    loosePrice: 0,
    description: 'ස්ක්‍රැපර් / ස්කීපර් පැකට් (Scraper Packet) - රු. 310 | Qty: 5'
  },
  // 8. ස්කීපර් අඟල් 10 | 7 | RS. 300
  {
    name: '10" ස්ක්‍රැපර් (Scraper)',
    matchNames: ['10" ස්ක්‍රැපර්', '10" ස්කීපර්', 'ස්කීපර් අඟල් 10', '10" Scraper', '10" ස්ක්‍රැපර් (Scraper)', 'අඟල් 10 ස්කීපර්'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 300,
    qty: 7,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '10" ස්ක්‍රැපර් / ස්කීපර් (10" Scraper) - රු. 300 | Qty: 7'
  },
  // 9. ස්කීපර් අඟල් 6 | 6 | RS. 250
  {
    name: '6" ස්ක්‍රැපර් (Scraper)',
    matchNames: ['6" ස්ක්‍රැපර්', '6" ස්කීපර්', 'ස්කීපර් අඟල් 6', '6" Scraper', '6" ස්ක්‍රැපර් (Scraper)', 'අඟල් 6 ස්කීපර්'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 250,
    qty: 6,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '6" ස්ක්‍රැපර් / ස්කීපර් (6" Scraper) - රු. 250 | Qty: 6'
  },
  // 10. ලොකු ස්කුරුප්පු | 10 | RS. 300
  {
    name: 'ලොකු ස්කුරුප්පු නියන (Large Screwdriver)',
    matchNames: ['ලොකු ස්කුරුප්පු', 'ලොකු ස්කුරුප්පු නියන', 'Large Screwdriver', 'ලොකු ස්කුරුප්පු නියන (Large Screwdriver)'],
    category: 'මෙවලම්',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 300,
    qty: 10,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ලොකු ස්කුරුප්පු නියන (Large Screwdriver) - රු. 300 | Qty: 10'
  },
  // 11. medium ස්කුරුප්පු | 9 | RS. 150
  {
    name: 'Medium ස්කුරුප්පු නියන (Medium Screwdriver)',
    matchNames: ['medium ස්කුරුප්පු', 'Medium ස්කුරුප්පු නියන', 'Medium Screwdriver', 'Medium ස්කුරුප්පු නියන (Medium Screwdriver)'],
    category: 'මෙවලම්',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 150,
    qty: 9,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Medium ස්කුරුප්පු නියන (Medium Screwdriver) - රු. 150 | Qty: 9'
  },
  // 12. Small ස්කුරුප්පු | 6 | RS. 170
  {
    name: 'Small ස්කුරුප්පු නියන (Small Screwdriver)',
    matchNames: ['Small ස්කුරුප්පු', 'Small ස්කුරුප්පු නියන', 'Small Screwdriver', 'Small ස්කුරුප්පු නියන (Small Screwdriver)', 'පොඩි ස්කුරුප්පු'],
    category: 'මෙවලම්',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 170,
    qty: 6,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Small ස්කුරුප්පු නියන (Small Screwdriver) - රු. 170 | Qty: 6'
  },
  // 13. ස්කුරුප්පු Set | 1 | RS. 600
  {
    name: 'ස්කුරුප්පු නියන Set (Screwdriver Set)',
    matchNames: ['ස්කුරුප්පු Set', 'ස්කුරුප්පු නියන Set', 'Screwdriver Set', 'ස්කුරුප්පු නියන Set (Screwdriver Set)'],
    category: 'මෙවලම්',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'set',
    costPrice: 0,
    sellPrice: 600,
    qty: 1,
    packSize: 1,
    packUnit: 'set',
    loosePrice: 0,
    description: 'ස්කුරුප්පු නියන Set (Screwdriver Set) - රු. 600 | Qty: 1'
  },
  // 14. Small කොළ plat නියන් | 6 | RS. 175
  {
    name: 'Small කොළ Plat නියන',
    matchNames: ['Small කොළ plat නියන්', 'Small කොළ Flat නියන', 'Small කොළ plat නියන', 'Small කොළ Plat නියන'],
    category: 'මෙවලම්',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 175,
    qty: 6,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Small කොළ Flat / Plat නියන - රු. 175 | Qty: 6'
  },
  // 15. ලොකු රතු plat නියන් | 8 | RS. 325
  {
    name: 'ලොකු රතු Plat නියන',
    matchNames: ['ලොකු රතු plat නියන්', 'ලොකු රතු Flat නියන', 'ලොකු රතු plat නියන', 'ලොකු රතු Plat නියන'],
    category: 'මෙවලම්',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 325,
    qty: 8,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'ලොකු රතු Flat / Plat නියන - රු. 325 | Qty: 8'
  },
  // 16. plat නියන් 300 | 12 | RS. 300
  {
    name: 'Plat නියන 300',
    matchNames: ['plat නියන් 300', 'Flat නියන 300', 'plat නියන 300', 'Plat නියන 300'],
    category: 'මෙවලම්',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 300,
    qty: 12,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Flat / Plat නියන 300 - රු. 300 | Qty: 12'
  },
  // 17. 225 පොඩි plat නියන් | 2 | RS. 225
  {
    name: 'Plat නියන 225 (පොඩි)',
    matchNames: ['225 පොඩි plat නියන්', 'Flat නියන 225', 'plat නියන් 225', '225 පොඩි Flat නියන', 'Plat නියන 225 (පොඩි)'],
    category: 'මෙවලම්',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 225,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Flat / Plat නියන 225 (පොඩි) - රු. 225 | Qty: 2'
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
  console.log('🎉 All databases processed for Batch 48!');
})();
