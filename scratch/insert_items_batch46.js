const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const itemsToProcess = [
  // 1. රතු කුඩු 1kg -> Rs.1200  මුළු 50kg
  {
    name: 'රතු කුඩු 1kg',
    matchNames: ['රතු කුඩු 1kg', 'රතු කුඩු (1kg)', 'Red Powder 1kg', 'Ratu kudu 1kg'],
    category: 'පින්තාරු',
    subCategory: 'කුඩු / Powder',
    unit: 'kg',
    costPrice: 0,
    sellPrice: 1200,
    qty: 50,
    packSize: 1,
    packUnit: 'kg',
    loosePrice: 1200,
    description: 'රතු කුඩු 1kg (1kg රු. 1,200 | මුළු 50kg)'
  },
  // 2. කළු කුඩු 1kg -> Rs.1200  මුළු 25kg
  {
    name: 'කළු කුඩු 1kg',
    matchNames: ['කළු කුඩු 1kg', 'කළු කුඩු (1kg)', 'Black Powder 1kg', 'Kalu kudu 1kg'],
    category: 'පින්තාරු',
    subCategory: 'කුඩු / Powder',
    unit: 'kg',
    costPrice: 0,
    sellPrice: 1200,
    qty: 25,
    packSize: 1,
    packUnit: 'kg',
    loosePrice: 1200,
    description: 'කළු කුඩු 1kg (1kg රු. 1,200 | මුළු 25kg)'
  },
  // 3. කටු කම්බි කූරු -> 10kg  1kg -> Rs.250
  {
    name: 'කටු කම්බි කූරු',
    matchNames: ['කටු කම්බි කූරු', 'කටුකම්බි කූරු', 'Barbed Wire Pins', 'Katu kambi kuru'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කම්බි',
    unit: 'kg',
    costPrice: 0,
    sellPrice: 250,
    qty: 10,
    packSize: 1,
    packUnit: 'kg',
    loosePrice: 250,
    description: 'කටු කම්බි කූරු (1kg රු. 250 | මුළු 10kg)'
  },
  // 4. ඩයමන්ඩ් වොෂර් 20kg  1kg -> Rs.750
  {
    name: 'ඩයමන්ඩ් වොෂර්',
    matchNames: ['ඩයමන්ඩ් වොෂර්', 'ඩයමන්ඩ් වොෂර් (kg)', 'Diamond Washer', 'Diamond Washers', 'ඩයමන්ඩ් වොෂර් 1kg'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'kg',
    costPrice: 0,
    sellPrice: 750,
    qty: 20,
    packSize: 1,
    packUnit: 'kg',
    loosePrice: 750,
    description: 'ඩයමන්ඩ් වොෂර් (1kg රු. 750 | මුළු 20kg)'
  },
  // 5. J කොකු 20kg  1kg -> Rs.750 මුළු 50kg
  {
    name: 'J කොකු',
    matchNames: ['J කොකු', 'J Hook', 'J Hooks', 'J කොකු (kg)', 'ජේ කොකු', 'J කොකු 1kg'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'kg',
    costPrice: 0,
    sellPrice: 750,
    qty: 50,
    packSize: 1,
    packUnit: 'kg',
    loosePrice: 750,
    description: 'J කොකු (1kg රු. 750 | මුළු 50kg)'
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
  console.log('🎉 All databases processed for Batch 46!');
})();
