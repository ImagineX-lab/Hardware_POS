const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all(`SELECT id, name, category, subCategory, sellPrice, qty, barcode FROM items WHERE name LIKE '%යතුර%' OR name LIKE '%Spanner%' OR name LIKE '%Wrench%' OR category LIKE '%අත් ආයුධ%' OR subCategory LIKE '%ආයුධ%' OR subCategory LIKE '%Tools%' ORDER BY id ASC`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} existing tool/spanner items:`);
    rows.slice(0, 50).forEach(r => console.log(`[${r.id}] "${r.name}" | Cat: ${r.category} > ${r.subCategory} | Qty: ${r.qty} | Price: ${r.sellPrice} | Barcode: ${r.barcode}`));
  }
  db.close();
});
