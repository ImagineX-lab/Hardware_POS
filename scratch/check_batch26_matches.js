const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

const keywords = [
  'කොන්ක්රීට්', 'කොන්ක්‍රීට්', 'පැනල් පින්', 'ටින්ටස්', 'ජගුවර්',
  'තංගුස්', 'Thred', 'Thread', 'නූල්', 'Earth', 'තඹ', 'ගෑස්',
  'fresher', 'pressure', 'level', 'Panel'
];

db.all("SELECT id, name, category, subCategory, unit, packSize, packUnit, loosePrice, sellPrice, qty, barcode FROM items", [], (err, rows) => {
  if (err) console.error(err);
  else {
    const matched = rows.filter(r => keywords.some(k => r.name.toLowerCase().includes(k.toLowerCase())));
    console.log(`Found ${matched.length} matched items:`);
    matched.forEach(r => console.log(r.id, '|', r.name, '| unit:', r.unit, '| pack:', r.packSize, r.packUnit, '| loose: Rs.', r.loosePrice, '| sellPrice: Rs.', r.sellPrice, '| Qty:', r.qty));
  }
  db.close();
});
