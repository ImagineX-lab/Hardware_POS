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

function checkDuplicates(p) {
  return new Promise(resolve => {
    if (!fs.existsSync(p)) return resolve();
    const db = new sqlite3.Database(p);
    db.all(`SELECT name, count(*) as c, group_concat(id) as ids FROM items WHERE name IN (${itemNames.map(() => '?').join(',')}) GROUP BY name HAVING count(*) > 1`, itemNames, (err, rows) => {
      if (err) console.error(err);
      if (rows && rows.length > 0) {
        console.log(`Duplicates in ${p}:`, rows);
        rows.forEach(r => {
          const idList = r.ids.split(',').map(Number);
          const toDelete = idList.slice(1);
          db.run(`DELETE FROM items WHERE id IN (${toDelete.map(()=>'?').join(',')})`, toDelete, (delErr) => {
            console.log(`Deleted extra IDs for "${r.name}":`, toDelete);
          });
        });
      } else {
        console.log(`No duplicates in ${p}!`);
      }
      setTimeout(() => {
        db.close(() => resolve());
      }, 500);
    });
  });
}

(async () => {
  for (const p of dbPaths) {
    await checkDuplicates(p);
  }
})();
