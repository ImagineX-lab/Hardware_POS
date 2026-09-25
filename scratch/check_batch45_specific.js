const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

const queries = [
  "SELECT id, name, sellPrice, qty, unit, subCategory FROM items WHERE name LIKE '%S-lon බට%' OR name LIKE '%Slon බට%' OR name LIKE '%S-lon%බට%' OR name LIKE '%Anton%බට%' OR name LIKE '%Local%බට%' OR name LIKE '%ලෝකල්%බට%' OR name LIKE '%ඩවුන්%' OR name LIKE '%ගැනේජ්%' OR name LIKE '%Down%' OR name LIKE '%Drain%'"
];

for (const p of dbPaths) {
  if (!fs.existsSync(p)) continue;
  const db = new sqlite3.Database(p);
  db.all(queries[0], [], (err, rows) => {
    if (err) console.error(err);
    console.log(`\n=== ${p} (${rows ? rows.length : 0} rows) ===`);
    rows.forEach(r => console.log(`[${r.id}] ${r.name} | SubCat: ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice}`));
    db.close();
  });
}
