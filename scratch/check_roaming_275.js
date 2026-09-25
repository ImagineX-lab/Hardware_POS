const sqlite3 = require('sqlite3').verbose();
const path = 'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db';
const db = new sqlite3.Database(path);

db.all("SELECT id, name, category, subCategory, unit, qty, sellPrice FROM items WHERE id BETWEEN 275 AND 310", [], (err, rows) => {
  if (err) console.error(err);
  console.log('--- IDs 275 to 310 in hardware-pos pos.db ---');
  rows.forEach(r => console.log(`[${r.id}] ${r.name} | Cat: ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice}`));
  db.close();
});
