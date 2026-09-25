const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db');

db.all("SELECT id, name, category, subCategory, unit, costPrice, sellPrice, qty, barcode FROM items WHERE name LIKE '%ඩ්රිල්%' OR subCategory = 'ඩ්රිල් කටු' OR subCategory = 'කොන්ක්රීට් ඩ්රිල් කටු' ORDER BY id ASC", (err, rows) => {
  if (err) console.error(err);
  console.log(`Found ${rows.length} items:`);
  console.log(JSON.stringify(rows, null, 2));
  db.close();
});
