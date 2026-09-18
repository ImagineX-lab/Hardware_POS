const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT name, unit, category, subCategory FROM items WHERE name LIKE '%ටිනර්%' OR name LIKE '%Thinner%' OR name LIKE '%තෙල්%'", [], (err, rows) => {
  console.log(rows.slice(0, 10));
  db.close();
});
