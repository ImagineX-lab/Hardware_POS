const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, sellPrice, qty FROM items WHERE name LIKE '8%' OR name LIKE '10%'", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} items starting with 8 or 10:`);
    rows.forEach(r => console.log(r.id, '|', r.name, '| Rs.', r.sellPrice, '| Qty:', r.qty));
  }
  db.close();
});
