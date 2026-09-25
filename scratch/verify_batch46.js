const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

const itemNames = [
  'රතු කුඩු 1kg',
  'කළු කුඩු 1kg',
  'කටු කම්බි කූරු',
  'ඩයමන්ඩ් වොෂර්',
  'J කොකු'
];

for (const p of dbPaths) {
  if (!fs.existsSync(p)) continue;
  const db = new sqlite3.Database(p);
  const placeholders = itemNames.map(() => '?').join(',');
  db.all(`SELECT id, name, category, subCategory, unit, qty, sellPrice, barcode FROM items WHERE name IN (${placeholders}) ORDER BY id`, itemNames, (err, rows) => {
    if (err) console.error(err);
    console.log(`\n======================================================`);
    console.log(`DB: ${p}`);
    console.log(`Total found: ${rows ? rows.length : 0} / ${itemNames.length}`);
    console.log(`======================================================`);
    rows.forEach(r => {
      console.log(`ID: ${r.id.toString().padEnd(5)} | ${r.name.padEnd(20)} | SubCat: ${r.subCategory.padEnd(20)} | Unit: ${r.unit.padEnd(5)} | Qty: ${r.qty.toString().padEnd(4)} | Price: Rs.${r.sellPrice.toString().padEnd(5)} | Barcode: ${r.barcode}`);
    });
    db.close();
  });
}
