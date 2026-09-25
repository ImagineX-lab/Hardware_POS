const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all(`SELECT id, name, unit, packSize, packUnit, loosePrice, sellPrice, qty FROM items WHERE unit = 'kg' OR packUnit = 'kg' ORDER BY id ASC LIMIT 15`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} kg items:`);
    rows.forEach(r => console.log(`[${r.id}] "${r.name}" | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice} | PackSize: ${r.packSize} | PackUnit: ${r.packUnit} | LoosePrice: ${r.loosePrice}`));
  }
  db.close();
});
