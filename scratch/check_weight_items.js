const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, category, subCategory, unit, packSize, packUnit, loosePrice, sellPrice, qty FROM items WHERE unit IN ('g', '100g', 'kg', 'pkt') OR packUnit IN ('g', '100g', 'kg') OR name LIKE '%100g%' OR name LIKE '%50g%'", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} weight items:`);
    rows.slice(0, 25).forEach(r => console.log(r.id, '|', r.name, '| unit:', r.unit, '| pack:', r.packSize, r.packUnit, '| loose: Rs.', r.loosePrice, '| sellPrice: Rs.', r.sellPrice, '| Qty:', r.qty));
  }
  db.close();
});
