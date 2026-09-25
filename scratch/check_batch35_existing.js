const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all(`SELECT id, name, category, subCategory, sellPrice, qty, barcode FROM items WHERE name LIKE '%HiBOND%' OR name LIKE '%Hibond%' OR name LIKE '%O/A%' OR name LIKE '%Bright%' OR name LIKE '%E/N%' OR name LIKE '%Enamel%' OR name LIKE '%Superlac%' OR name LIKE '%Purlac%' OR name LIKE '%Purelac%' ORDER BY id ASC`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} existing items.`);
    rows.forEach(r => console.log(`[${r.id}] "${r.name}" | Qty: ${r.qty} | Price: ${r.sellPrice} | Barcode: ${r.barcode}`));
  }
  db.close();
});
