const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

for (const p of dbPaths) {
  if (!fs.existsSync(p)) continue;
  const db = new sqlite3.Database(p);
  db.all("SELECT id, name, category, subCategory, unit, qty, sellPrice FROM items WHERE name LIKE '%1 1/2%' OR name LIKE '%1 1/4%' OR name LIKE '%Gate%'", [], (err, rows) => {
    if (err) console.error(err);
    console.log(`\n=== ${p} ===`);
    rows.forEach(r => console.log(`[${r.id}] ${r.name} | Cat: ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice}`));
    db.close();
  });
}
