const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, category, subCategory, unit, packSize, packUnit, loosePrice, sellPrice, qty FROM items WHERE name LIKE '%බෝල්ට්%' OR name LIKE '%bolt%' OR name LIKE '%ඇණ%' OR name LIKE '%nut%'", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} bolt/screw items:`);
    rows.slice(0, 30).forEach(r => console.log(r.id, '|', r.name, '| cat:', r.category, '->', r.subCategory, '| unit:', r.unit, '| sellPrice: Rs.', r.sellPrice, '| Qty:', r.qty));
  }
  db.close();
});
