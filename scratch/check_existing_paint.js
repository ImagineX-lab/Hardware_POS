const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty, barcode FROM items WHERE name LIKE '%4l%' OR name LIKE '%4L%' OR name LIKE '%Multidec%' OR name LIKE '%buttermilk%' OR name LIKE '%Lily%' OR name LIKE '%Robin%' OR name LIKE '%Princess%' OR name LIKE '%Blissful%' OR name LIKE '%Ice Blue%' OR name LIKE '%Easter%' OR name LIKE '%Roast Red%' OR name LIKE '%Fairy%' OR name LIKE '%sunflower%'", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} matched paint items:`);
    rows.forEach(r => console.log(r.id, '|', r.name, '| Rs.', r.sellPrice, '| Qty:', r.qty, '| Barcode:', r.barcode));
  }
  db.close();
});
