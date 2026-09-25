const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

async function check() {
  const tableInfo = await new Promise((res, rej) => {
    db.all("PRAGMA table_info(items)", [], (err, rows) => err ? rej(err) : res(rows));
  });
  console.log('Columns:', tableInfo.map(c => c.name));

  const items = await new Promise((res, rej) => {
    db.all("SELECT id, name, category, subCategory, unit, costPrice, sellPrice, qty, description FROM items WHERE subCategory LIKE '%ඇණ%' OR name LIKE '%ඇණ%' OR name LIKE '%රිවට්%' LIMIT 20", [], (err, rows) => err ? rej(err) : res(rows));
  });
  console.log('Fastener sample items:');
  items.forEach(i => console.log(i));

  db.close();
}
check();
