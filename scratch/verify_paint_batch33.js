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

const uniquePaths = [...new Set(dbPaths)];

async function verifyDb(dbPath) {
  if (!fs.existsSync(dbPath)) return;
  console.log(`\n--- Verifying ${dbPath} ---`);
  const db = new sqlite3.Database(dbPath);
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => { if (err) rej(err); else res(rows); }));

  const rows = await all(`SELECT id, name, category, subCategory, sellPrice, qty, barcode FROM items WHERE name LIKE 'E/M %' ORDER BY id ASC`);
  console.log(`Total E/M paint items: ${rows.length}`);
  rows.forEach(r => {
    console.log(`[${r.id}] ${r.name} | Qty: ${r.qty} | Price: Rs. ${r.sellPrice} | Barcode: ${r.barcode}`);
  });
  db.close();
}

async function main() {
  for (const p of uniquePaths) {
    await verifyDb(p);
  }
}

main();
