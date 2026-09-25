const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db');

db.all(`SELECT id, name, category, subCategory, sellPrice, qty, barcode FROM items WHERE name LIKE '%Robialac%' OR name LIKE '%Multidec%'`, [], (err, rows) => {
  if (err) console.error(err);
  console.log('Results in backend pos.db:', rows);
  db.close();
});
