const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

async function run() {
  const matched = await new Promise((res, rej) => {
    db.all("SELECT id, name, category, subCategory, sellPrice, qty FROM items WHERE name LIKE '%කටු%' OR name LIKE '%brush%' OR name LIKE '%බ්රෂ්%' OR name LIKE '%හැඳි%' OR name LIKE '%නියන්%' OR name LIKE '%මුල්ලු%' OR name LIKE '%රේක්ක%' OR name LIKE '%තරාදි%' OR name LIKE '%පොටි%'", [], (err, rows) => {
      if (err) rej(err); else res(rows);
    });
  });

  console.log('Matched items (' + matched.length + '):');
  matched.forEach(m => console.log(m.id, '|', m.name, '|', m.category, '->', m.subCategory, '| Rs.', m.sellPrice, '| Qty:', m.qty));
  db.close();
}

run();
