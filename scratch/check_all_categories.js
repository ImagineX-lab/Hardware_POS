const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all(`SELECT DISTINCT category, subCategory FROM items ORDER BY category, subCategory`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Categories and subcategories in DB:`);
    rows.forEach(r => console.log(`Category: "${r.category}" | SubCategory: "${r.subCategory}"`));
  }
  db.close();
});
