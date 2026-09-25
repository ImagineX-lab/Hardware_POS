const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all(`SELECT id, name, category, subCategory, sellPrice, qty, barcode FROM items WHERE name LIKE '%EPIFIX%' OR name LIKE '%Elephant%' OR name LIKE '%JAT%' OR name LIKE '%SAYLACK%' OR name LIKE '%Sayerlack%' OR name LIKE '%Opel%' OR name LIKE '%Titanium%' OR name LIKE '%Resin%' OR name LIKE '%Hardener%' ORDER BY id ASC`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} existing items.`);
    rows.forEach(r => console.log(`[${r.id}] "${r.name}" | Qty: ${r.qty} | Price: ${r.sellPrice} | Barcode: ${r.barcode}`));
  }
  db.close();
});
