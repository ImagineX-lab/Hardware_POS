const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

async function run() {
  const matched = await new Promise((res, rej) => {
    db.all("SELECT id, name, category, subCategory, sellPrice, qty FROM items WHERE name LIKE '%මිටි%' OR name LIKE '%holder%' OR name LIKE '%plug%' OR name LIKE '%switch%' OR name LIKE '%socket%' OR name LIKE '%ටෙස්ටර්%' OR name LIKE '%හෝල්ඩර්%' OR name LIKE '%සීලිං%' OR name LIKE '%terminal%' OR category LIKE '%විදුලි%'", [], (err, rows) => {
      if (err) rej(err); else res(rows);
    });
  });

  console.log('Matched Electrical / Tool Items (' + matched.length + '):');
  matched.forEach(m => console.log(m.id, '|', m.name, '|', m.category, '->', m.subCategory, '| Rs.', m.sellPrice, '| Qty:', m.qty));
  db.close();
}

run();
