const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

const testNames = [
  'Clear horse', 'Clear Horse', 'KevilTon braker', 'Kevilton Breaker',
  'ORANGE braker', 'Orange Breaker', 'Safetaa', 'Aelifv', 'CHINT',
  'Krypton', 'ACL', 'KEVILTON', 'Orson', 'Wusley', 'braker 6A'
];

db.all("SELECT id, name, sellPrice, qty FROM items", [], (err, rows) => {
  if (err) console.error(err);
  else {
    testNames.forEach(t => {
      const matched = rows.filter(r => r.name.toLowerCase().includes(t.toLowerCase()));
      if (matched.length > 0) {
        console.log(`Matches for "${t}":`, matched);
      }
    });
  }
  db.close();
});
