const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.env.APPDATA || '', 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

async function check() {
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => err ? rej(err) : res(rows)));
  
  const lockSubCats = await all("SELECT DISTINCT category, subCategory FROM items WHERE name LIKE '%lock%' OR name LIKE '%ලොක්%' OR name LIKE '%යතුරු%' OR subCategory LIKE '%ලොක්%' OR subCategory LIKE '%යතුරු%'");
  console.log('Lock categories in DB:', lockSubCats);

  const keywords = ['lock', 'drawer', 'union', 'razer', 'belizza', 'gum', 'epifix', 'epi fix', 'elephant', 'කොප්පි'];
  const query = "SELECT id, name, category, subCategory, sellPrice, qty FROM items WHERE " + keywords.map(k => `LOWER(name) LIKE '%${k}%'`).join(' OR ');
  const matched = await all(query);
  console.log(`Matched ${matched.length} existing items:`);
  matched.forEach(m => console.log(`${m.id} | ${m.name} | ${m.category} -> ${m.subCategory} | Rs. ${m.sellPrice} | Qty: ${m.qty}`));

  db.close();
}
check();
