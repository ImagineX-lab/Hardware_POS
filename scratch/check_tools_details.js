const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db');

db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty FROM items WHERE name LIKE '%ස්කුරුප්පු%' OR name LIKE '%screwdriver%' OR name LIKE '%driver%' OR name LIKE '%scraper%' OR name LIKE '%ස්ක්‍රැපර්%' OR name LIKE '%ස්කීපර්%' OR name LIKE '%පොටි හැඳි%' OR name LIKE '%නියන්%'", (err, rows) => {
  if (err) console.error(err);
  console.log(`Found ${rows.length} items:`);
  console.log(rows);
  db.close();
});
