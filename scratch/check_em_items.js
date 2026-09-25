const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all(`SELECT id, name, category, subCategory, sellPrice, qty, barcode, description FROM items WHERE name LIKE '%E/M%' OR name LIKE '%Emulsion%' OR name LIKE '%Enamel%' OR name LIKE '%500ml%' OR name LIKE '%Wall Master%' OR name LIKE '%KSS%' ORDER BY id ASC`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} items:`);
    rows.forEach(r => console.log(`[${r.id}] ${r.name} | Cat: ${r.category} > ${r.subCategory} | Qty: ${r.qty} | Price: ${r.sellPrice} | Desc: ${r.description}`));
  }
  db.close();
});
