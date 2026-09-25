const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

for (const p of dbPaths) {
  if (!fs.existsSync(p)) {
    console.log('Not found:', p);
    continue;
  }
  const db = new sqlite3.Database(p);
  db.all("SELECT id, name, sellPrice, qty, barcode FROM items WHERE id BETWEEN 800 AND 810 OR name LIKE '%Multidec 4l%' OR name LIKE '%Robialac%'", [], (err, rows) => {
    if (err) console.error(err);
    console.log(`\n--- ${p} (${rows ? rows.length : 0} rows) ---`);
    console.log(rows);
    db.close();
  });
}
