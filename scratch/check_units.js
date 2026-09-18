const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(process.env.APPDATA, 'hardware-pos', 'pos.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT DISTINCT unit FROM items', [], (err, rows) => {
  console.log('Units in DB:', rows);
  db.close();
});
