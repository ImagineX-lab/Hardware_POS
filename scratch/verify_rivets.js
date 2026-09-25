const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPaths = [
  path.join(__dirname, '..', 'backend', 'pos.db'),
  path.join(process.env.APPDATA || '', 'hardware-pos', 'pos.db'),
  path.join(process.env.APPDATA || '', 'Hardware POS', 'pos.db')
];

async function verify(dbPath) {
  if (!fs.existsSync(dbPath)) return;
  console.log(`\n--- Verification for: ${dbPath} ---`);
  const db = new sqlite3.Database(dbPath);
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => err ? rej(err) : res(rows)));

  const rows = await all("SELECT id, name, barcode, category, subCategory, unit, qty, sellPrice, description FROM items WHERE name LIKE '%රිවට්%' ORDER BY id ASC");
  console.table(rows);
  db.close();
}

async function main() {
  for (const p of [...new Set(dbPaths)]) {
    await verify(p);
  }
}
main();
