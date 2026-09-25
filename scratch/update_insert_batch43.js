const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const items = [
  {
    name: 'Robialac Multidec 4L Butter Milk',
    matchNames: ['Robialac Multidec 4L Butter Milk', 'Multidec 4l Butter Milk', 'Multidec 4L Butter Milk', '4L Robialac buttermilk', '4L buttermilk'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 7,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Butter Milk Paint'
  },
  {
    name: 'Robialac Multidec 4L Lily White',
    matchNames: ['Robialac Multidec 4L Lily White', 'Multidec 4l Lily White', 'Multidec 4L Lily White', '4L Robialac Lily white', '4L Lily white'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 7,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Lily White Paint'
  },
  {
    name: 'Robialac Multidec 4L B/W',
    matchNames: ['Robialac Multidec 4L B/W', 'Multidec 4l B/W', 'Multidec 4L B/W', '4L Robialac B/W 4l', '4L Robialac B/W', '4L B/W 4l'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 12,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Brilliant White Paint'
  },
  {
    name: 'Robialac Multidec 4L Robin Yellow',
    matchNames: ['Robialac Multidec 4L Robin Yellow', 'Robialac Multidec 4L Yellow', 'Multidec 4l Robin Yellow', 'Multidec 4L Robin Yellow', '4L Robialac Yellow', '4L Robin Yellow'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Robin Yellow Paint'
  },
  {
    name: 'Robialac Multidec 4L Princess Blue',
    matchNames: ['Robialac Multidec 4L Princess Blue', 'Multidec 4l Princess Blue', 'Multidec 4L Princess Blue', '4L Robialac Princess Blue', '4L Princess Blue'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Princess Blue Paint'
  },
  {
    name: 'Robialac Multidec 4L Blissful',
    matchNames: ['Robialac Multidec 4L Blissful', 'Multidec 4l Blissful', 'Multidec 4L Blissful', '4L Robialac Blissful', '4L Blissful'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Blissful Paint'
  },
  {
    name: 'Robialac Multidec 4L Ice Blue',
    matchNames: ['Robialac Multidec 4L Ice Blue', 'Multidec 4l Ice Blue', 'Multidec 4L Ice Blue', '4L Robialac Ice Blue', '4L Ice Blue'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Ice Blue Paint'
  },
  {
    name: 'Robialac Multidec 4L Easter Egg',
    matchNames: ['Robialac Multidec 4L Easter Egg', 'Multidec 4l Easter Egg', 'Multidec 4L Easter Egg', '4L Robialac Easter egg', '4L Easter egg'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Easter Egg Paint'
  },
  {
    name: 'Robialac Multidec 4L Roast Red',
    matchNames: ['Robialac Multidec 4L Roast Red', 'Multidec 4l Roast Red', 'Multidec 4L Roast Red', '4L Robialac Roast Red', '4L Roast Red'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Roast Red Paint'
  },
  {
    name: 'Robialac Multidec 4L Fairy Tale',
    matchNames: ['Robialac Multidec 4L Fairy Tale', 'Multidec 4l Fairy Tale', 'Multidec 4L Fairy Tale', '4L Robialac Fairy tale', '4L Fairy tale'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Fairy Tale Paint'
  },
  {
    name: 'Robialac Multidec 4L Sunflower',
    matchNames: ['Robialac Multidec 4L Sunflower', 'Multidec 4l Sunflower', 'Multidec 4L Sunflower', '4L Robialac multideck sunflower', '4L Sunflower', 'Multidec 4l Sunflower'],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4000,
    qty: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Robialac Multidec 4L Sunflower Paint'
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
      const total = items.length;

      items.forEach((item) => {
        const placeholders = item.matchNames.map(() => 'name = ?').join(' OR ');
        const checkSql = `SELECT id, name, qty, sellPrice, barcode FROM items WHERE ${placeholders}`;

        db.get(checkSql, item.matchNames, (err, existing) => {
          if (err) {
            console.error(`[ERROR] Checking "${item.name}":`, err.message);
          } else if (existing) {
            const updateSql = `
              UPDATE items
              SET name = ?, category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, qty = ?, description = ?
              WHERE id = ?
            `;
            db.run(
              updateSql,
              [
                item.name, item.category, item.subCategory, item.unit,
                item.costPrice, item.sellPrice, item.qty, item.description,
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
