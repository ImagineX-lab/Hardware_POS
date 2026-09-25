const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

const keywords = ['කුඩු', 'කටු කම්බි', 'කූරු', 'වොෂර්', 'washer', 'Diamond', 'කොකු', 'hook', 'J '];

for (const p of dbPaths) {
  if (!fs.existsSync(p)) continue;
  const db = new sqlite3.Database(p);
  const conditions = keywords.map(() => 'name LIKE ?').join(' OR ');
  const params = keywords.map(k => `%${k}%`);
  
  db.all(`SELECT id, name, category, subCategory, unit, qty, sellPrice, packSize, packUnit, loosePrice FROM items WHERE ${conditions} ORDER BY id`, params, (err, rows) => {
    if (err) console.error(err);
    console.log(`\n=== ${p} (${rows ? rows.length : 0} matching rows) ===`);
    rows.forEach(r => console.log(`[${r.id}] ${r.name} | Cat: ${r.category} > ${r.subCategory} | Unit: ${r.unit} | Qty: ${r.qty} | Price: ${r.sellPrice} | Pack: ${r.packSize} ${r.packUnit} @ ${r.loosePrice}`));
    db.close();
  });
}
