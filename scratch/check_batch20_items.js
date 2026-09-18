const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, category, subCategory, unit, sellPrice, loosePrice, packSize, packUnit, qty FROM items WHERE name LIKE '%horse%' OR name LIKE '%hose%' OR name LIKE '%braker%' OR name LIKE '%breaker%' OR name LIKE '%Switch%' OR name LIKE '%switch%' OR name LIKE '%Kevil%' OR name LIKE '%CHINT%' OR name LIKE '%ORANGE%'", [], (err, rows) => {
  if (err) console.error(err);
  else console.log(JSON.stringify(rows, null, 2));
  db.close();
});
