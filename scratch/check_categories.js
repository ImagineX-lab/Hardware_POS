const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

async function run() {
  const categories = await new Promise((res, rej) => {
    db.all('SELECT DISTINCT category, subCategory FROM items ORDER BY category, subCategory', [], (err, rows) => {
      if (err) rej(err); else res(rows);
    });
  });
  console.log('Categories:', categories);

  const matched = await new Promise((res, rej) => {
    db.all("SELECT id, name, category, subCategory, sellPrice, qty FROM items WHERE name LIKE '%බයිසිකල්%' OR name LIKE '%ටියුබ්%' OR name LIKE '%tube%' OR name LIKE '%විල්%' OR name LIKE '%මෝටර්%' OR name LIKE '%තාච්චි%' OR name LIKE '%safety%' OR name LIKE '%ග්රයින්ඩර්%' OR name LIKE '%ඩ්රිල්%' OR name LIKE '%චක්%' OR name LIKE '%නීන්න%' OR name LIKE '%chain%' OR name LIKE '%රෝද%'", [], (err, rows) => {
      if (err) rej(err); else res(rows);
    });
  });

  console.log('\nMatched Items (' + matched.length + '):');
  matched.forEach(m => console.log(m.id, '|', m.name, '|', m.category, '->', m.subCategory, '| Rs.', m.sellPrice, '| Qty:', m.qty));
  db.close();
}

run();
