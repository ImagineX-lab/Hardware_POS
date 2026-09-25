const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

for (const p of dbPaths) {
  if (!fs.existsSync(p)) continue;
  const db = new sqlite3.Database(p);
  db.all(
    `SELECT id, name, category, subCategory, sellPrice, qty, barcode FROM items WHERE name LIKE 'Robialac Multidec 4L%' ORDER BY name ASC`,
    [],
    (err, rows) => {
      console.log(`\n=== DB: ${p} (${rows ? rows.length : 0} items) ===`);
      console.table(rows);
      db.close();
    }
  );
}
