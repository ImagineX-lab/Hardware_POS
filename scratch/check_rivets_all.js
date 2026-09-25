const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPaths = [
  path.join(__dirname, '..', 'backend', 'pos.db'),
  path.join(process.env.APPDATA || '', 'hardware-pos', 'pos.db'),
  path.join(process.env.APPDATA || '', 'Hardware POS', 'pos.db')
];

async function checkAll(dbPath) {
  if (!fs.existsSync(dbPath)) return;
  console.log('--- Checking DB:', dbPath);
  const db = new sqlite3.Database(dbPath);
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => err ? rej(err) : res(rows)));
  
  const items = await all("SELECT id, name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, description FROM items WHERE name LIKE '%රිවට්%' OR name LIKE '%rivet%' OR name LIKE '%Rivet%' OR description LIKE '%rivet%' OR description LIKE '%රිවට්%'");
  console.log('Found:', items);
  db.close();
}

async function main() {
  for (const p of [...new Set(dbPaths)]) {
    await checkAll(p);
  }
}
main();
