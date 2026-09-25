const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.env.APPDATA || '', 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

async function verify() {
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => err ? rej(err) : res(rows)));
  const rows = await all("SELECT id, name, barcode, category, subCategory, sellPrice, qty FROM items WHERE id >= 1608 ORDER BY id ASC");
  console.table(rows);
  db.close();
}
verify();
