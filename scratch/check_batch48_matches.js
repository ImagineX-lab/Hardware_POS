const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('D:\\Hadware_Pos_System\\Hardware_POS\\backend\\pos.db');

const items = [
  { name: 'කර්ටන් වයර් (Curtain Wire)', match: ['කර්ටන් වයර්', 'කටන් වයර්', 'carton වයර්', 'Curtain Wire'] },
  { name: '1" පොටි හැඳි', match: ['1" පොටි හැඳි', 'අඟල් 1 පොටි හැඳි', '1 inch Putty Knife', '1" Putty Knife', 'පොටි හැඳි 1"'] },
  { name: '2" පොටි හැඳි', match: ['2" පොටි හැඳි', 'අඟල් 2 පොටි හැඳි', '2 inch Putty Knife', '2" Putty Knife', 'පොටි හැඳි 2"'] },
  { name: '3" පොටි හැඳි', match: ['3" පොටි හැඳි', 'අඟල් 3 පොටි හැඳි', '3 inch Putty Knife', '3" Putty Knife', 'පොටි හැඳි 3"'] },
  { name: '4" පොටි හැඳි', match: ['4" පොටි හැඳි', 'අඟල් 4 පොටි හැඳි', '4 inch Putty Knife', '4" Putty Knife', 'පොටි හැඳි 4"'] },
  { name: '5" පොටි හැඳි', match: ['5" පොටි හැඳි', 'අඟල් 5 පොටි හැඳි', '5 inch Putty Knife', '5" Putty Knife', 'පොටි හැඳි 5"'] },
  { name: 'ස්ක්‍රැපර් පැකට් (Scraper Packet)', match: ['ස්කීපර් පෑකට්', 'ස්ක්‍රැපර් පැකට්', 'Scraper Packet', 'ස්කීපර් පැකට්'] },
  { name: '10" ස්ක්‍රැපර් (Scraper)', match: ['10" ස්ක්‍රැපර්', '10" ස්කීපර්', 'ස්කීපර් අඟල් 10', '10" Scraper', 'අඟල් 10 ස්කීපර්'] },
  { name: '6" ස්ක්‍රැපර් (Scraper)', match: ['6" ස්ක්‍රැපර්', '6" ස්කීපර්', 'ස්කීපර් අඟල් 6', '6" Scraper', 'අඟල් 6 ස්කීපර්'] },
  { name: 'ලොකු ස්කුරුප්පු (Screwdriver)', match: ['ලොකු ස්කුරුප්පු', 'ලොකු ස්කුරුප්පු නියන', 'Large Screwdriver'] },
  { name: 'Medium ස්කුරුප්පු (Screwdriver)', match: ['medium ස්කුරුප්පු', 'Medium ස්කුරුප්පු නියන', 'Medium Screwdriver'] },
  { name: 'Small ස්කුරුප්පු (Screwdriver)', match: ['Small ස්කුරුප්පු', 'Small ස්කුරුප්පු නියන', 'Small Screwdriver', 'පොඩි ස්කුරුප්පු'] },
  { name: 'ස්කුරුප්පු Set (Screwdriver Set)', match: ['ස්කුරුප්පු Set', 'ස්කුරුප්පු නියන Set', 'Screwdriver Set'] },
  { name: 'Small කොළ Plat නියන', match: ['Small කොළ plat නියන්', 'Small කොළ Flat නියන', 'Small කොළ plat නියන'] },
  { name: 'ලොකු රතු Plat නියන', match: ['ලොකු රතු plat නියන්', 'ලොකු රතු Flat නියන', 'ලොකු රතු plat නියන'] },
  { name: 'Plat නියන 300', match: ['plat නියන් 300', 'Flat නියන 300', 'plat නියන 300'] },
  { name: 'Plat නියන 225 (පොඩි)', match: ['225 පොඩි plat නියන්', 'Flat නියන 225', 'plat නියන් 225', '225 පොඩි Flat නියන'] }
];

db.all("SELECT id, name, sellPrice, qty FROM items", (err, rows) => {
  if (err) return console.error(err);
  items.forEach(it => {
    const matches = rows.filter(r => it.match.some(m => r.name.toLowerCase().includes(m.toLowerCase())));
    if (matches.length > 0) {
      console.log(`Match for "${it.name}":`, matches);
    } else {
      console.log(`No match for "${it.name}" (will be inserted new)`);
    }
  });
  db.close();
});
