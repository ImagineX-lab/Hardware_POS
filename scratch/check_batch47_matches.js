const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db');

const queryNames = [
  '14 x 160', '8 x 150', '10 x 210', '10 x 100', '8 x 100', '14 x 210',
  '12 x 210', '12 x 100', '17 x 280', '14 x 200', '14 x 250', '18 x 300',
  '16 x 300', '3/8', '1/2', '1/4', '3/16', '5/32', '1/8', '5/8', 'Borgh'
];

db.serialize(() => {
  db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty FROM items", (err, rows) => {
    if (err) return console.error(err);
    console.log(`Total items in DB: ${rows.length}`);
    
    queryNames.forEach(q => {
      const matches = rows.filter(r => r.name.toLowerCase().includes(q.toLowerCase()));
      if (matches.length > 0) {
        console.log(`\nMatches for "${q}":`);
        matches.forEach(m => console.log(`  [ID: ${m.id}] ${m.name} | Cat: ${m.category} > ${m.subCategory} | Price: ${m.sellPrice} | Qty: ${m.qty}`));
      }
    });

    db.close();
  });
});
