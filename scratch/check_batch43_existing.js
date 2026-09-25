const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db');

db.all(`SELECT id, name, category, subCategory, sellPrice, qty FROM items WHERE name LIKE '%Robialac%' OR name LIKE '%Multidec%' OR name LIKE '%buttermilk%' OR name LIKE '%Lily white%' OR name LIKE '%Easter egg%' OR name LIKE '%Fairy tale%' OR name LIKE '%sunflower%' OR name LIKE '%Blissful%' OR name LIKE '%Ice Blue%' OR name LIKE '%Princess Blue%'`, [], (err, rows) => {
  if (err) console.error(err);
  console.log(JSON.stringify(rows, null, 2));
  db.close();
});
