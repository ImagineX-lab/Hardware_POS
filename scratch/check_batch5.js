const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty, barcode FROM items WHERE id >= 1073 ORDER BY id ASC", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Verified ${rows.length} items:`);
    rows.forEach(r => {
      console.log(`${r.id} | ${r.name} | Qty: ${r.qty} ${r.unit} | Rs. ${r.sellPrice} | ${r.category} > ${r.subCategory} | Barcode: ${r.barcode}`);
    });
  }
  db.close();
});
