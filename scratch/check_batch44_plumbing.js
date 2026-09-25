const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'backend', 'pos.db'));

db.all("SELECT id, name, category, subCategory, unit, qty, sellPrice FROM items WHERE category IN ('සෙවිලි උපකරණ', 'පයිප්ප හා සනිටරි') ORDER BY category, subCategory, name", [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} items:`);
    rows.forEach(r => console.log(`[${r.id}] ${r.name} | Cat: ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice}`));
  }
  db.close();
});
