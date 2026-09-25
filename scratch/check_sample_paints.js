const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db');

db.all(`SELECT id, name, sellPrice, qty FROM items WHERE category = 'සායම් හා රසායනික' LIMIT 30`, [], (err, rows) => {
  console.log(rows);
  db.close();
});
