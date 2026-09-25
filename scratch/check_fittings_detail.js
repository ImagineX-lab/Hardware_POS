const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'backend', 'pos.db'));

db.all("SELECT id, name, category, subCategory, unit, qty, sellPrice FROM items WHERE name LIKE '%බෝ%' OR name LIKE '%bow%' OR name LIKE '%elbow%' OR name LIKE '%ටී%' OR name LIKE '%tee%' OR name LIKE '%සොකට්%' OR name LIKE '%ශොකට්%' OR name LIKE '%socket%' ORDER BY id", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} items:`);
    rows.forEach(r => console.log(`[${r.id}] ${r.name} | Cat: ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice}`));
  }
  db.close();
});
