const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

const searchTerms = [
  'primer',
  'Robbialac',
  'Robialac',
  'KANSAI',
  'Nature Paint',
  'nature paint',
  'Wall Master 1L',
  'Multilac 1L',
  'Multilac 1l'
];

db.all(`SELECT id, name, category, subCategory, sellPrice, qty, barcode FROM items WHERE name LIKE '%primer%' OR name LIKE '%KANSAI%' OR name LIKE '%Nature Paint%' OR name LIKE '%Robbialac%' OR name LIKE '%Robialac%' OR name LIKE '%Wall Master%' ORDER BY id ASC`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} existing items.`);
    rows.forEach(r => console.log(`[${r.id}] "${r.name}" | Qty: ${r.qty} | Price: ${r.sellPrice} | Barcode: ${r.barcode}`));
  }
  db.close();
});
