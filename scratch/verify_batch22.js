const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty, barcode FROM items WHERE id >= 1483 ORDER BY id ASC", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`\nVerified ${rows.length} added items in ${dbPath}:`);
    rows.forEach(r => {
      console.log(`ID: ${r.id} | ${r.name} | Qty: ${r.qty} ${r.unit} | Price: Rs. ${r.sellPrice} | Barcode: ${r.barcode}`);
    });
  }
  db.close();
});
