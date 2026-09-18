const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

const keywords = ['වැලිකඩදාසි', 'sandpaper', 'sand paper', 'roll', 'p 40', 'p 60', 'p 80', 'p 100', 'p 120', 'p40', 'p60', 'p80', 'p100', 'p120'];

db.all("SELECT id, name, category, subCategory, unit, packSize, packUnit, loosePrice, sellPrice, qty FROM items WHERE " + keywords.map(k => `LOWER(name) LIKE '%${k}%'`).join(' OR '), [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} matched existing items:`);
    rows.forEach(r => console.log(r.id, '|', r.name, '| unit:', r.unit, '| pack:', r.packSize, r.packUnit, '| loosePrice:', r.loosePrice, '| rollPrice:', r.sellPrice, '| Qty:', r.qty));
  }
  db.close();
});
