const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPaths = [
  path.join(__dirname, '..', 'backend', 'pos.db')
];
if (process.env.APPDATA) {
  dbPaths.push(path.join(process.env.APPDATA, 'hardware-pos', 'pos.db'));
  dbPaths.push(path.join(process.env.APPDATA, 'Hardware POS', 'pos.db'));
}

async function check(dbPath) {
  if (!fs.existsSync(dbPath)) return;
  console.log('Checking:', dbPath);
  const db = new sqlite3.Database(dbPath);
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => err ? rej(err) : res(rows)));
  
  const categories = await all('SELECT DISTINCT category, subCategory FROM items ORDER BY category, subCategory');
  console.log('All Categories & SubCategories count:', categories.length);
  
  const fasteners = categories.filter(c => c.category && (c.category.includes('ඇණ') || c.category.includes('ගොඩනැගිලි') || c.category.includes('උපකරණ') || (c.subCategory && c.subCategory.includes('ඇණ'))));
  console.log('Related categories:', fasteners);

  const rivets = await all("SELECT id, name, category, subCategory, sellPrice, qty, barcode, unit FROM items WHERE name LIKE '%රිවට්%' OR name LIKE '%rivet%' OR name LIKE '%Rivet%'");
  console.log('Existing rivets:', rivets);

  db.close();
}

async function main() {
  for (const p of [...new Set(dbPaths)]) {
    await check(p);
  }
}
main();
