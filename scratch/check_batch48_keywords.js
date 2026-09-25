const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db');

const keywords = [
  'කටන්', 'කර්ටන්', 'Curtain', 'පොටි', 'හැඳි', 'Putty', 'ස්කීපර්', 'ස්ක්‍රැපර්', 'Scraper',
  'ස්කුරුප්පු', 'Screw', 'නියන්', 'plat', 'Flat', 'Chisel'
];

db.serialize(() => {
  db.all("SELECT id, name, category, subCategory, unit, sellPrice, qty FROM items", (err, rows) => {
    if (err) return console.error(err);
    console.log(`Total items in DB: ${rows.length}\n`);

    keywords.forEach(kw => {
      const matched = rows.filter(r => 
        (r.name && r.name.toLowerCase().includes(kw.toLowerCase())) ||
        (r.category && r.category.toLowerCase().includes(kw.toLowerCase())) ||
        (r.subCategory && r.subCategory.toLowerCase().includes(kw.toLowerCase()))
      );
      if (matched.length > 0) {
        console.log(`=== Matches for "${kw}" (${matched.length}) ===`);
        matched.slice(0, 15).forEach(m => console.log(`  [ID: ${m.id}] ${m.name} | Cat: ${m.category} > ${m.subCategory} | Unit: ${m.unit} | Price: ${m.sellPrice} | Qty: ${m.qty}`));
      }
    });

    db.close();
  });
});
