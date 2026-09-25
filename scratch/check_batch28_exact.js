const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.env.APPDATA || '', 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

const testItems = [
  'purlac', 'purelac', 'reoluxe', 'superlac', 'standard', 'opel', 'kss', 'nature', 'kasai', 'royal', 'floor paint'
];

async function check() {
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => err ? rej(err) : res(rows)));
  for (const t of testItems) {
    const rows = await all(`SELECT id, name, sellPrice, qty FROM items WHERE LOWER(name) LIKE ?`, [`%${t}%`]);
    console.log(`Query: ${t} -> ${rows.length} items`);
    rows.forEach(r => console.log('  ', r.id, r.name, 'Rs.', r.sellPrice, 'Qty:', r.qty));
  }
  db.close();
}
check();
