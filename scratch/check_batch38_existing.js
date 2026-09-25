const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all(`SELECT id, name, category, subCategory, unit, packSize, packUnit, loosePrice, sellPrice, qty, barcode FROM items WHERE name LIKE '%Bracket%' OR name LIKE '%Braket%' OR name LIKE '%ABC%' OR name LIKE '%horse%' OR name LIKE '%Hose%' OR name LIKE '%වේවැල්%' OR name LIKE '%කොකු%' OR name LIKE '%Tile%' ORDER BY id ASC`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} existing matching items:`);
    rows.forEach(r => console.log(`[${r.id}] "${r.name}" | Cat: ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice} | Loose: ${r.loosePrice} | Barcode: ${r.barcode}`));
  }
  db.close();
});
