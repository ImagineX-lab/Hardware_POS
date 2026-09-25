const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'backend', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all(`SELECT id, name, category, subCategory, sellPrice, qty FROM items WHERE name LIKE '%ප්ලයර්%' OR name LIKE '%ඉස්කුරුප්පු%' OR name LIKE '%screwdriv%' OR name LIKE '%Hammer%' OR name LIKE '%කටර්%' OR name LIKE '%මිටි%' ORDER BY id ASC`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Found ${rows.length} tool items:`);
    rows.slice(0, 30).forEach(r => console.log(`[${r.id}] "${r.name}" | Cat: ${r.category} > ${r.subCategory}`));
  }
  db.close();
});
