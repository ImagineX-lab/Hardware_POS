const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

const names = [
  'Butter Milk', 'Lily White', 'B/W', 'Robin Yellow', 'Yellow', 'Princess Blue',
  'Blissful', 'Ice Blue', 'Easter Egg', 'Roast Red', 'Fairy Tale', 'Sunflower'
];

async function check() {
  for (const p of dbPaths) {
    if (!fs.existsSync(p)) continue;
    console.log(`\n========================================\nDB: ${p}`);
    const db = new sqlite3.Database(p);
    
    for (const n of names) {
      const rows = await new Promise((res) => {
        db.all(`SELECT id, name, sellPrice, qty, barcode FROM items WHERE name LIKE ?`, [`%${n}%`], (err, rows) => {
          res(rows || []);
        });
      });
      console.log(`-- Search: ${n} (${rows.length} found)`);
      rows.forEach(r => console.log(`   [ID:${r.id}] ${r.name} | Qty:${r.qty} | Price:${r.sellPrice} | Barcode:${r.barcode}`));
    }
    db.close();
  }
}

check();
