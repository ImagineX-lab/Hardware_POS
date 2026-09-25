const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

for (const p of dbPaths) {
  if (!fs.existsSync(p)) {
    console.log('Not found:', p);
    continue;
  }
  const db = new sqlite3.Database(p);
  db.all("SELECT id, name, sellPrice, qty, category, subCategory FROM items WHERE name LIKE '%අමානෝ%' OR name LIKE '%Amano%' OR name LIKE '%ඇස්බැ%' OR name LIKE '%ශොකට්%' OR name LIKE '%Socket%' OR name LIKE '%bow%' OR name LIKE '%Elbow%'", [], (err, rows) => {
    if (err) console.error(err);
    console.log(`\n=== ${p} (${rows ? rows.length : 0} rows) ===`);
    rows.forEach(r => console.log(`[${r.id}] ${r.name} | ${r.category} > ${r.subCategory} | Qty: ${r.qty} | Price: ${r.sellPrice}`));
    db.close();
  });
}
