const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.env.APPDATA || '', 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

async function check() {
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => err ? rej(err) : res(rows)));
  
  const paintSubCats = await all("SELECT DISTINCT subCategory FROM items WHERE category = 'සායම් හා රසායනික'");
  console.log('Paint Subcategories:', paintSubCats);

  const keywords = ['purelac', 'purlac', 'reoluxe', 'superlac', 'standard', 'opel', 'kss', 'nature', 'robbialac', 'kasai', 'royal', 'floor', 'water based', 'wb', 'qd'];
  
  const query = "SELECT id, name, category, subCategory, sellPrice, qty FROM items WHERE " + keywords.map(k => `LOWER(name) LIKE '%${k}%'`).join(' OR ');
  const matched = await all(query);
  console.log(`Matched ${matched.length} existing items:`);
  matched.forEach(m => console.log(`${m.id} | ${m.name} | ${m.category} -> ${m.subCategory} | Rs. ${m.sellPrice} | Qty: ${m.qty}`));

  db.close();
}
check();
