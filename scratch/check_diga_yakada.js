const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty FROM items WHERE name LIKE '%දිග%' OR name LIKE '%යකඩ%'", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} items:`);
    rows.forEach(r => console.log(r.id, '|', r.name, '| unit:', r.unit, '| sellPrice: Rs.', r.sellPrice, '| Qty:', r.qty));
  }
  db.close();
});
