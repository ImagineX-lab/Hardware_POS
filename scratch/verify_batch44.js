const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

const itemNames = [
  '6" - 0.30 අමානෝ Gate ෂීට්',
  '6" - 0.25 අමානෝ Gate ෂීට්',
  '6" - 0.20 අමානෝ Gate ෂීට්',
  '5" - 0.30 අමානෝ Gate ෂීට්',
  '5" - 0.25 අමානෝ Gate ෂීට්',
  '5" - 0.20 අමානෝ Gate ෂීට්',
  '4" - 0.30 අමානෝ Gate ෂීට්',
  '4" - 0.25 අමානෝ Gate ෂීට්',
  '4" - 0.20 අමානෝ Gate ෂීට්',
  'ඇස්බැස්ටෝ sheet අඩි 6 (අලියා sheet)',
  'ඇස්බැස්ටෝ sheet අඩි 8 (අලියා sheet)',
  'ඇස්බැස්ටෝ sheet අඩි 10 (අලියා sheet)',
  'ඇස්බැස්ටෝ sheet අඩි 12 (අලියා sheet)',
  '1 1/2" ශොකට් (නෝමල්)',
  '1 1/2" ශොකට් (S-lon)',
  '1/2" T (S-lon)',
  '1" L Bow (නෝමල්)',
  '1" L Bow (S-lon)',
  '1 1/2" ශොකට් (Arpico)'
];

for (const p of dbPaths) {
  if (!fs.existsSync(p)) continue;
  const db = new sqlite3.Database(p);
  const placeholders = itemNames.map(() => '?').join(',');
  db.all(`SELECT id, name, category, subCategory, unit, qty, sellPrice, barcode FROM items WHERE name IN (${placeholders}) ORDER BY id`, itemNames, (err, rows) => {
    if (err) console.error(err);
    console.log(`\n======================================================`);
    console.log(`DB: ${p}`);
    console.log(`Total found: ${rows ? rows.length : 0} / 19`);
    console.log(`======================================================`);
    rows.forEach(r => {
      console.log(`ID: ${r.id.toString().padEnd(5)} | ${r.name.padEnd(36)} | Unit: ${r.unit.padEnd(5)} | Qty: ${r.qty.toString().padEnd(4)} | Price: Rs.${r.sellPrice.toString().padEnd(5)} | Barcode: ${r.barcode}`);
    });
    db.close();
  });
}
