const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'backend', 'pos.db'));

const queries = [
  "SELECT id, name, category, subCategory, unit, qty, sellPrice FROM items WHERE category = 'සෙවිලි උපකරණ' OR category = 'පයිප්ප හා සනිටරි' LIMIT 100",
  "SELECT id, name, category, subCategory, unit, qty, sellPrice FROM items WHERE name LIKE '%Amano%' OR name LIKE '%ඇස්බැස්ටෝස්%' OR name LIKE '%Socket%' OR name LIKE '%Elbow%' OR name LIKE '%L bow%' OR name LIKE '%ශොකට්%'"
];

db.all(queries[1], [], (err, rows) => {
  if (err) console.error(err);
  else {
    console.log(`Found ${rows.length} items:`);
    rows.forEach(r => console.log(`[${r.id}] ${r.name} | Cat: ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice}`));
  }
  db.close();
});
