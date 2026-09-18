const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty FROM items WHERE name LIKE '%වොෂර්%' OR name LIKE '%washer%' OR name LIKE '%ස්විච්%' OR name LIKE '%මල් ඇණ%'", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log('Existing washer/switch screw items count:', rows.length);
    rows.forEach(r => console.log(r.id, '|', r.name, '|', r.category, '->', r.subCategory, '| unit:', r.unit, '| Rs.', r.sellPrice, '| Qty:', r.qty));
  }
  db.close();
});
