const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

const keywords = ['සරනේරු', 'hinge', 'disk', 'disc', 'wheel', 'diamond', 'makita', 'cutting', 'කපන'];

db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty FROM items WHERE " + keywords.map(k => `LOWER(name) LIKE '%${k}%'`).join(' OR '), [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} matched existing items:`);
    rows.forEach(r => console.log(r.id, '|', r.name, '|', r.category, '->', r.subCategory, '| Rs.', r.sellPrice, '| Qty:', r.qty));
  }
  db.close();
});
