const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty, barcode FROM items WHERE name LIKE '%Weather%' OR name LIKE '%(w)%' OR name LIKE '%(W)%' OR name LIKE '%Gold%' OR name LIKE '%Spice%' OR name LIKE '%Cyan%' OR name LIKE '%Rain%' OR name LIKE '%Poppy%' OR name LIKE '%Lantern%' OR name LIKE '%Cameo%'", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} matched items:`);
    rows.forEach(r => console.log(r.id, '|', r.name, '| Rs.', r.sellPrice, '| Qty:', r.qty, '| Barcode:', r.barcode));
  }
  db.close();
});
