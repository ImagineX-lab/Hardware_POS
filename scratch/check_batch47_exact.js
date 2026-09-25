const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const items = [
  { name: '14 x 160 ඩ්රිල් කටු', qty: 5, price: 0 },
  { name: '8 x 150 / 210 ඩ්රිල් කටු', qty: 5, price: 750 },
  { name: '10 x 210 ඩ්රිල් කටු', qty: 5, price: 750 },
  { name: '10 x 100 x 160 ඩ්රිල් කටු', qty: 4, price: 590 },
  { name: '8 x 100 x 160 ඩ්රිල් කටු', qty: 5, price: 650 },
  { name: '14 x 210 ඩ්රිල් කටු', qty: 4, price: 925 },
  { name: '12 x 210 ඩ්රිල් කටු', qty: 5, price: 750 },
  { name: '12 x 100 x 160 ඩ්රිල් කටු', qty: 4, price: 750 },
  { name: '17 x 280 x 25 ඩ්රිල් කටු', qty: 5, price: 780 },
  { name: '14 x 200 ඩ්රිල් කටු', qty: 2, price: 725 },
  { name: '14 x 250 ඩ්රිල් කටු', qty: 6, price: 650 },
  { name: '18 x 300 ඩ්රිල් කටු', qty: 4, price: 1200 },
  { name: '16 x 300 ඩ්රිල් කටු', qty: 15, price: 950 },
  { name: '3/8" ඩ්රිල් කටු', qty: 5, price: 310 },
  { name: '1/2" ඩ්රිල් කටු', qty: 5, price: 375 },
  { name: '1/4" ඩ්රිල් කටු', qty: 6, price: 180 },
  { name: '1/4 Borgh ඩ්රිල් කටු', qty: 10, price: 120 },
  { name: '3/8 Borgh ඩ්රිල් කටු', qty: 10, price: 275 },
  { name: '3/16 Borgh ඩ්රිල් කටු', qty: 10, price: 165 },
  { name: '5/32 Borgh ඩ්රිල් කටු', qty: 10, price: 75 },
  { name: '1/8 ඩ්රිල් කටු', qty: 10, price: 50 },
  { name: '5/32 ඩ්රිල් කටු', qty: 16, price: 25 },
  { name: '5/8" ඩ්රිල් කටු', qty: 1, price: 1300 }
];

const dbPath = 'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db';
const db = new sqlite3.Database(dbPath);

db.all("SELECT id, name, sellPrice, qty FROM items", (err, rows) => {
  if (err) return console.error(err);
  console.log(`Checking ${items.length} items against ${rows.length} existing items:\n`);
  
  items.forEach(it => {
    const exact = rows.filter(r => r.name.toLowerCase().trim() === it.name.toLowerCase().trim());
    const similar = rows.filter(r => {
      const n = r.name.toLowerCase();
      // check if key terms match
      const itWords = it.name.toLowerCase().replace(/["']/g, '').split(' ').filter(w => w !== 'ඩ්රිල්' && w !== 'කටු' && w !== 'x' && w !== '/');
      return itWords.length > 0 && itWords.every(w => n.includes(w));
    });

    if (exact.length > 0) {
      console.log(`[EXACT MATCH] "${it.name}" -> ID: ${exact[0].id} ("${exact[0].name}") | Price: ${exact[0].sellPrice} | Qty: ${exact[0].qty}`);
    } else if (similar.length > 0) {
      console.log(`[SIMILAR] "${it.name}" -> found ${similar.length} similar:`);
      similar.forEach(s => console.log(`    ID: ${s.id} | "${s.name}" | Price: ${s.sellPrice} | Qty: ${s.qty}`));
    } else {
      console.log(`[NEW ITEM] "${it.name}" (Price: ${it.price}, Qty: ${it.qty})`);
    }
  });

  db.close();
});
