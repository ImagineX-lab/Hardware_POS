const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

const searchTerms = [
  'Wall Master',
  'Reoluse',
  'Reoluxe',
  'KSS',
  'Purelac',
  'Multilac',
  'E/M',
  'Emulsion'
];

db.all(`SELECT id, name, category, subCategory, sellPrice, qty, barcode FROM items WHERE name LIKE '%Wall Master%' OR name LIKE '%E/M%' OR name LIKE '%Purelac%' OR name LIKE '%Reoluxe%' OR name LIKE '%Reoluse%' OR name LIKE '%KSS%' OR name LIKE '%Multilac%'`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} existing items.`);
    rows.forEach(r => console.log(`[${r.id}] "${r.name}" | Qty: ${r.qty} | Price: ${r.sellPrice} | Barcode: ${r.barcode}`));
  }
  db.close();
});
