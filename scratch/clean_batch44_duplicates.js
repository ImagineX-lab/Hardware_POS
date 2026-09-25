const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dbPaths = [
  'D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\hardware-pos\\pos.db',
  'C:\\Users\\Saluka\\AppData\\Roaming\\Hardware POS\\pos.db',
];

const itemNames = [
  '6" - 0.30 අමානෝ Gate ෂීට්',
  '6" - 0.25 අමානෝ Gate ෂීට්',
  '6" - 0.20 අමානෝ Gate ෂීට්',
  '5" - 0.30 අමානෝ Gate ෂීට්',
  '5" - 0.25 අමානෝ Gate ෂීට්',
  '5" - 0.20 අමානෝ Gate ෂීට්',
  '4" - 0.30 අමානෝ Gate ෂීට්',
  '4" - 0.25 අමානෝ Gate ෂීට්',
  '4" - 0.20 අමානෝ Gate ෂීට්',
  'ඇස්බැස්ටෝ sheet අඩි 6 (අලියා sheet)',
  'ඇස්බැස්ටෝ sheet අඩි 8 (අලියා sheet)',
  'ඇස්බැස්ටෝ sheet අඩි 10 (අලියා sheet)',
  'ඇස්බැස්ටෝ sheet අඩි 12 (අලියා sheet)',
  '1 1/2" ශොකට් (නෝමල්)',
  '1 1/2" ශොකට් (S-lon)',
  '1/2" T (S-lon)',
  '1" L Bow (නෝමල්)',
  '1" L Bow (S-lon)',
  '1 1/2" ශොකට් (Arpico)'
];

function cleanDuplicates(dbPath) {
  return new Promise((resolve) => {
    if (!fs.existsSync(dbPath)) return resolve();
    const db = new sqlite3.Database(dbPath);

    db.serialize(() => {
      itemNames.forEach(name => {
        db.all("SELECT id, name FROM items WHERE name = ? ORDER BY id", [name], (err, rows) => {
          if (rows && rows.length > 1) {
            console.log(`[DUP FOUND in ${dbPath}] "${name}": ${rows.map(r => r.id).join(', ')}`);
            // Keep first, delete rest
            const toDelete = rows.slice(1).map(r => r.id);
            const placeholders = toDelete.map(() => '?').join(',');
            db.run(`DELETE FROM items WHERE id IN (${placeholders})`, toDelete, (delErr) => {
              if (delErr) console.error(`Error deleting:`, delErr);
              else console.log(`Deleted duplicates ${toDelete.join(', ')}`);
            });
          }
        });
      });
    });

    setTimeout(() => {
      db.close(() => resolve());
    }, 1000);
  });
}

(async () => {
  for (const p of dbPaths) {
    await cleanDuplicates(p);
  }
  console.log('Cleanup finished.');
})();
