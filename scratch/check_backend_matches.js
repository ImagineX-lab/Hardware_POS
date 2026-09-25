const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'backend', 'pos.db'));

db.all("SELECT id, name, category, subCategory, unit, qty, sellPrice, packSize, packUnit, loosePrice FROM items WHERE name LIKE '%කම්බි%' OR name LIKE '%වොෂර්%' OR name LIKE '%washer%' OR name LIKE '%කොකු%' OR name LIKE '%hook%' OR name LIKE '%කුඩු%' ORDER BY id", [], (err, rows) => {
  if (err) console.error(err);
  console.log(`Found ${rows.length} rows in backend/pos.db:`);
  rows.forEach(r => console.log(`[${r.id}] ${r.name} | Cat: ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice} | Pack: ${r.packSize} ${r.packUnit} @ ${r.loosePrice}`));
  db.close();
});
