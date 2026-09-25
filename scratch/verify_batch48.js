const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

const checkNames = [
  'කර්ටන් වයර් (Curtain Wire)',
  '1" පොටි හැඳි',
  '2" පොටි හැඳි',
  '3" පොටි හැඳි',
  '4" පොටි හැඳි',
  '5" පොටි හැඳි',
  'ස්ක්‍රැපර් පැකට් (Scraper Packet)',
  '10" ස්ක්‍රැපර් (Scraper)',
  '6" ස්ක්‍රැපර් (Scraper)',
  'ලොකු ස්කුරුප්පු නියන (Large Screwdriver)',
  'Medium ස්කුරුප්පු නියන (Medium Screwdriver)',
  'Small ස්කුරුප්පු නියන (Small Screwdriver)',
  'ස්කුරුප්පු නියන Set (Screwdriver Set)',
  'Small කොළ Plat නියන',
  'ලොකු රතු Plat නියන',
  'Plat නියන 300',
  'Plat නියන 225 (පොඩි)'
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
        console.log(`[ID: ${r.id.toString().padStart(4, ' ')}] ${r.name.padEnd(42, ' ')} | Price: Rs. ${r.sellPrice.toString().padStart(5, ' ')} | Qty: ${r.qty.toString().padStart(2, ' ')} ${r.unit.padEnd(4, ' ')} | Barcode: ${r.barcode}`);
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
