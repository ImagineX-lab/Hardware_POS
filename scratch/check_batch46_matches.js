const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

const checkNames = ['රතු කුඩු 1kg', 'කළු කුඩු 1kg', 'කටු කම්බි කූරු', 'ඩයමන්ඩ් වොෂර්', 'J කොකු'];

for (const p of dbPaths) {
  if (!fs.existsSync(p)) continue;
  const db = new sqlite3.Database(p);
  db.all("SELECT id, name, sellPrice, qty, unit FROM items WHERE name IN ('රතු කුඩු 1kg', 'කළු කුඩු 1kg', 'කටු කම්බි කූරු', 'ඩයමන්ඩ් වොෂර්', 'J කොකු') OR name LIKE '%ඩයමන්ඩ් වොෂර්%' OR name LIKE '%J කොකු%' OR name LIKE '%කටු කම්බි කූරු%'", [], (err, rows) => {
    if (err) console.error(err);
    console.log(`\n=== ${p} (${rows ? rows.length : 0} matches) ===`);
    rows.forEach(r => console.log(r));
    db.close();
  });
}
