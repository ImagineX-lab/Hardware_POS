const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

const checkNames = [
  '14 x 160 ඩ්රිල් කටු',
  '8 x 150 / 210 ඩ්රිල් කටු',
  '10 x 210 ඩ්රිල් කටු',
  '10 x 100 x 160 ඩ්රිල් කටු',
  '8 x 100 x 160 ඩ්රිල් කටු',
  '14 x 210 ඩ්රිල් කටු',
  '12 x 210 ඩ්රිල් කටු',
  '12 x 100 x 160 ඩ්රිල් කටු',
  '17 x 280 x 25 ඩ්රිල් කටු',
  '14 x 200 ඩ්රිල් කටු',
  '14 x 250 ඩ්රිල් කටු',
  '18 x 300 ඩ්රිල් කටු',
  '16 x 300 ඩ්රිල් කටු',
  '3/8" ඩ්රිල් කටු',
  '1/2" ඩ්රිල් කටු',
  '1/4" ඩ්රිල් කටු',
  '1/4" Borgh ඩ්රිල් කටු',
  '3/8" Borgh ඩ්රිල් කටු',
  '3/16" Borgh ඩ්රිල් කටු',
  '5/32" Borgh ඩ්රිල් කටු',
  '1/8" ඩ්රිල් කටු',
  '5/32" ඩ්රිල් කටු',
  '5/8" ඩ්රිල් කටු'
];

async function verifyDb(dbPath) {
  return new Promise(resolve => {
    if (!fs.existsSync(dbPath)) return resolve();
    const db = new sqlite3.Database(dbPath);
    const placeholders = checkNames.map(() => '?').join(',');
    db.all(`SELECT id, name, category, subCategory, unit, sellPrice, qty, barcode FROM items WHERE name IN (${placeholders}) ORDER BY name ASC`, checkNames, (err, rows) => {
      console.log(`\n======================================================`);
      console.log(`Database: ${dbPath}`);
      console.log(`Found: ${rows.length} / ${checkNames.length} items`);
      console.log(`======================================================`);
      rows.forEach(r => {
        console.log(`[ID: ${r.id.toString().padStart(4, ' ')}] ${r.name.padEnd(30, ' ')} | Price: Rs. ${r.sellPrice.toString().padStart(5, ' ')} | Qty: ${r.qty.toString().padStart(2, ' ')} ${r.unit} | Barcode: ${r.barcode}`);
      });
      db.close(() => resolve());
    });
  });
}

(async () => {
  for (const p of dbPaths) {
    await verifyDb(p);
  }
})();
