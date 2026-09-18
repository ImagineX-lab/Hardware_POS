const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

const keywords = [
  'Pure Lac', 'Purelac', 'Multilac', 'Boat Race', 'Turquoise',
  'Happy Day', 'Classic purple', 'Deep pool', 'Orchid', 'fairy Tale',
  'September', 'Summer', 'Easter egg', 'Camel', 'Turmeric', 'hawaii',
  'Dulux', 'Seacoral', 'sandstone'
];

db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty, barcode FROM items", [], (err, rows) => {
  if (err) console.error(err);
  else {
    const matched = rows.filter(r => keywords.some(k => r.name.toLowerCase().includes(k.toLowerCase())));
    console.log(`Found ${matched.length} matched items:`);
    matched.forEach(r => console.log(r.id, '|', r.name, '| Rs.', r.sellPrice, '| Qty:', r.qty, '| Barcode:', r.barcode));
  }
  db.close();
});
