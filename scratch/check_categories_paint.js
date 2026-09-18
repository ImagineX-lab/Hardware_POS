const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT DISTINCT category, subCategory FROM items WHERE category LIKE '%සායම්%' OR category LIKE '%ගොඩනැගිලි%'", [], (err, rows) => {
  console.log(rows);
  db.close();
});
