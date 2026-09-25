const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db');

db.serialize(() => {
  db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty FROM items WHERE name LIKE '%ඩ්රිල්%' OR name LIKE '%Drill%' OR name LIKE '%Borgh%'", (err, rows) => {
    if (err) console.error(err);
    console.log('Total found:', rows ? rows.length : 0);
    console.log(rows);
  });

  db.all("SELECT DISTINCT category, subCategory FROM items WHERE category LIKE '%උපකරණ%' OR category LIKE '%Tools%' OR subCategory LIKE '%Drill%' OR subCategory LIKE '%කටු%'", (err, rows) => {
    if (err) console.error(err);
    console.log('\nCategories:');
    console.log(rows);
    db.close();
  });
});
