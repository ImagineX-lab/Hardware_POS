const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT DISTINCT category, subCategory FROM items ORDER BY category, subCategory', [], (err, rows) => {
  if (err) console.error(err);
  else console.log('Categories:', rows);

  db.all("SELECT id, name, category, subCategory, sellPrice, qty FROM items WHERE name LIKE '%ඇණ%' OR name LIKE '%බැටරි%' OR name LIKE '%screw%' OR name LIKE '%ඇසිඩ්%'", [], (err2, rows2) => {
    if (err2) console.error(err2);
    else {
      console.log('\nExisting matched items count:', rows2.length);
      rows2.forEach(r => console.log(r.id, '|', r.name, '|', r.category, '->', r.subCategory, '| Rs.', r.sellPrice, '| Qty:', r.qty));
    }
    db.close();
  });
});
