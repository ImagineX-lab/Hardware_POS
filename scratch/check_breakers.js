const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, category, subCategory, unit, sellPrice, loosePrice, packSize, packUnit, qty, description FROM items WHERE name LIKE '%breaker%' OR name LIKE '%braker%' OR name LIKE '%trip%' OR name LIKE '%main switch%' OR name LIKE '%main%' OR name LIKE '%mcb%' OR name LIKE '%rccb%'", [], (err, rows) => {
  if (err) console.error(err);
  else console.log(JSON.stringify(rows, null, 2));
  db.close();
});
