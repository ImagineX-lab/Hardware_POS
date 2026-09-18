const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPaths = [
  path.join(__dirname, '..', 'backend', 'pos.db'),
  path.join(process.env.APPDATA, 'hardware-pos', 'pos.db'),
  path.join(process.env.APPDATA, 'Hardware POS', 'pos.db')
];

const checkNames = [
  'Multidec 4l Butter Milk', 'Multidec 4l Lily White', 'Multidec 4l B/W',
  'Multidec 4l Robin Yellow', 'Multidec 4l Princess Blue', 'Multidec 4l Blissful',
  'Multidec 4l Ice Blue', 'Multidec 4l Easter Egg', 'Multidec 4l Roast Red',
  'Multidec 4l Fairy Tale', 'Multidec 4l Sunflower'
];

async function check() {
  for (const p of dbPaths) {
    if (!fs.existsSync(p)) continue;
    console.log('\n--- Checking DB:', p);
    const db = new sqlite3.Database(p);
    const rows = await new Promise((res, rej) => {
      db.all("SELECT id, name, sellPrice, qty, barcode FROM items WHERE name LIKE '%Multidec 4l%' OR name LIKE '%buttermilk%' OR name LIKE '%butter milk%'", [], (err, rows) => {
        if (err) rej(err); else res(rows);
      });
    });
    console.log(`Found ${rows.length} rows:`, rows);
    db.close();
  }
}

check();
