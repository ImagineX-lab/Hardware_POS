const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. O/A Bright 1L | 6 | 2500
  {
    name: 'O/A Bright 1L',
    matchNames: [
      'O/A Bright 1L',
      'O/A Bright 1l',
      'o/a bright 1l',
      'OA Bright 1L',
      'OA Bright 1l'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2500,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'O/A Bright Paint 1L (O/A බ්‍රයිට් සායම් 1L) - රු. 2,500'
  },
  // 2. E/N (B/B) Reoluse 1L | 2 | 2200
  {
    name: 'E/N (B/B) Reoluse 1L',
    matchNames: [
      'E/N (B/B) Reoluse 1L',
      'E/N (B/B) reoluse 1L',
      'e/n (b/b) reoluse 1l',
      'E/N (B/B) Reoluxe 1L',
      'Reoluse E/N (B/B) 1L',
      'Reoluxe E/N (B/B) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint (B/B) 1L (රියෝලක්ස් එනැමල් සායම් 1L) - රු. 2,200'
  },
  // 3. E/N (M/B) Reoluse 1L | 5 | 2200
  {
    name: 'E/N (M/B) Reoluse 1L',
    matchNames: [
      'E/N (M/B) Reoluse 1L',
      'E/N (M/B) reoluse 1L',
      'e/n (m/b) reoluse 1l',
      'E/N (M/B) Reoluxe 1L',
      'Reoluse E/N (M/B) 1L',
      'Reoluxe E/N (M/B) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint (M/B) 1L (රියෝලක්ස් එනැමල් සායම් 1L) - රු. 2,200'
  },
  // 4. E/N (M/BL) Reoluse 1L | 2 | 2200
  {
    name: 'E/N (M/BL) Reoluse 1L',
    matchNames: [
      'E/N (M/BL) Reoluse 1L',
      'E/N (M/BL) reoluse 1L',
      'e/n (m/bl) reoluse 1l',
      'E/N (M/BL) Reoluxe 1L',
      'Reoluse E/N (M/BL) 1L',
      'Reoluxe E/N (M/BL) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint (M/BL) 1L (රියෝලක්ස් එනැමල් සායම් 1L) - රු. 2,200'
  },
  // 5. E/N (W) Reoluse 1L | 2 | 2200
  {
    name: 'E/N (W) Reoluse 1L',
    matchNames: [
      'E/N (W) Reoluse 1L',
      'E/N (W) reoluse 1L',
      'e/n (w) reoluse 1l',
      'E/N (W) Reoluxe 1L',
      'Reoluse E/N (W) 1L',
      'Reoluxe E/N (W) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint White (W) 1L (රියෝලක්ස් එනැමල් සුදු සායම් 1L) - රු. 2,200'
  },
  // 6. E/N (B) Reoluse 1L| 2 | 2200
  {
    name: 'E/N (B) Reoluse 1L',
    matchNames: [
      'E/N (B) Reoluse 1L',
      'E/N (B) reoluse 1L',
      'e/n (b) reoluse 1l',
      'E/N (B) Reoluxe 1L',
      'Reoluse E/N (B) 1L',
      'Reoluxe E/N (B) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint (B) 1L (රියෝලක්ස් එනැමල් සායම් 1L) - රු. 2,200'
  },
  // 7. E/N (G/R) Reoluse 1L | 1 | 2200
  {
    name: 'E/N (G/R) Reoluse 1L',
    matchNames: [
      'E/N (G/R) Reoluse 1L',
      'E/N (G/R) reoluse 1L',
      'e/n (g/r) reoluse 1l',
      'E/N (G/R) Reoluxe 1L',
      'Reoluse E/N (G/R) 1L',
      'Reoluxe E/N (G/R) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint (G/R) 1L (රියෝලක්ස් එනැමල් සායම් 1L) - රු. 2,200'
  },
  // 8. E/N (Pi) Reoluse 1L | 1 | 2200
  {
    name: 'E/N (Pi) Reoluse 1L',
    matchNames: [
      'E/N (Pi) Reoluse 1L',
      'E/N (Pi) reoluse 1L',
      'e/n (pi) reoluse 1l',
      'E/N (Pi) Reoluxe 1L',
      'Reoluse E/N (Pi) 1L',
      'Reoluxe E/N (Pi) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint Pink (Pi) 1L (රියෝලක්ස් එනැමල් සායම් 1L) - රු. 2,200'
  },
  // 9. E/N (Mi) Reoluse 1L | 2 | 2200
  {
    name: 'E/N (Mi) Reoluse 1L',
    matchNames: [
      'E/N (Mi) Reoluse 1L',
      'E/N (Mi) reoluse 1L',
      'e/n (mi) reoluse 1l',
      'E/N (Mi) Reoluxe 1L',
      'Reoluse E/N (Mi) 1L',
      'Reoluxe E/N (Mi) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint (Mi) 1L (රියෝලක්ස් එනැමල් සායම් 1L) - රු. 2,200'
  },
  // 10. E/N (L/W) Reoluse 1L | 1 | 2000
  {
    name: 'E/N (L/W) Reoluse 1L',
    matchNames: [
      'E/N (L/W) Reoluse 1L',
      'E/N (L/W) reoluse 1L',
      'e/n (l/w) reoluse 1l',
      'E/N (L/W) Reoluxe 1L',
      'Reoluse E/N (L/W) 1L',
      'Reoluxe E/N (L/W) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2000,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint (L/W) 1L (රියෝලක්ස් එනැමල් සායම් 1L) - රු. 2,000'
  },
  // 11. E/N (L/G) Reoluse 1L | 2 | 2200
  {
    name: 'E/N (L/G) Reoluse 1L',
    matchNames: [
      'E/N (L/G) Reoluse 1L',
      'E/N (L/G) reoluse 1L',
      'e/n (l/g) reoluse 1l',
      'E/N (L/G) Reoluxe 1L',
      'Reoluse E/N (L/G) 1L',
      'Reoluxe E/N (L/G) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint Light Green (L/G) 1L (රියෝලක්ස් එනැමල් සායම් 1L) - රු. 2,200'
  },
  // 12. E/N (W) Reoluse 500ml | 3 | 1500
  {
    name: 'E/N (W) Reoluse 500ml',
    matchNames: [
      'E/N (W) Reoluse 500ml',
      'E/N (W) reoluse 500ml',
      'e/n (w) reoluse 500ml',
      'E/N (W) Reoluxe 500ml',
      'Reoluse E/N (W) 500ml',
      'Reoluxe E/N (W) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1500,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Reoluse Enamel Paint White (W) 500ml (රියෝලක්ස් එනැමල් සුදු සායම් 500ml) - රු. 1,500'
  },
  // 13. E/N (B) KSS 1L | 1 | 2200
  {
    name: 'E/N (B) KSS 1L',
    matchNames: [
      'E/N (B) KSS 1L',
      'E/N (B) kss 1L',
      'e/n (b) kss 1l',
      'KSS E/N (B) 1L',
      'KSS Paint E/N (B) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'KSS Enamel Paint (B) 1L (KSS එනැමල් සායම් 1L) - රු. 2,200'
  },
  // 14. E/N (Y) KSS 1L | 3 | 2200
  {
    name: 'E/N (Y) KSS 1L',
    matchNames: [
      'E/N (Y) KSS 1L',
      'E/N (Y) kss 1L',
      'e/n (y) kss 1l',
      'KSS E/N (Y) 1L',
      'KSS Paint E/N (Y) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'KSS Enamel Paint Yellow (Y) 1L (KSS එනැමල් කහ සායම් 1L) - රු. 2,200'
  },
  // 15. W/B (D/G) Superlac 1L | 2 | 2200
  {
    name: 'W/B (D/G) Superlac 1L',
    matchNames: [
      'W/B (D/G) Superlac 1L',
      'W/B (D/G) superlac 1L',
      'w/b (d/g) superlac 1l',
      'Superlac W/B (D/G) 1L',
      'Superlac (WB) (D/G) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Superlac Water Based Paint Dark Green (D/G) 1L (සුපර්ලැක් වෝටර් බේස් සායම් 1L) - රු. 2,200'
  },
  // 16. W/B (B/W) Superlac 1L | 2 | 2200
  {
    name: 'W/B (B/W) Superlac 1L',
    matchNames: [
      'W/B (B/W) Superlac 1L',
      'W/B (B/W) superlac 1L',
      'w/b (b/w) superlac 1l',
      'Superlac W/B (B/W) 1L',
      'Superlac (WB) (B/W) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Superlac Water Based Paint Brilliant White (B/W) 1L (සුපර්ලැක් වෝටර් බේස් සුදු සායම් 1L) - රු. 2,200'
  },
  // 17. W/B (R) Superlac 1L | 2 | 2200
  {
    name: 'W/B (R) Superlac 1L',
    matchNames: [
      'W/B (R) Superlac 1L',
      'W/B (R) superlac 1L',
      'w/b (r) superlac 1l',
      'Superlac W/B (R) 1L',
      'Superlac (WB) (R) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Superlac Water Based Paint Red (R) 1L (සුපර්ලැක් වෝටර් බේස් රතු සායම් 1L) - රු. 2,200'
  },
  // 18. W/B (B) Superlac 1L | 1 | 2200
  {
    name: 'W/B (B) Superlac 1L',
    matchNames: [
      'W/B (B) Superlac 1L',
      'W/B (B) superlac 1L',
      'w/b (b) superlac 1l',
      'Superlac W/B (B) 1L',
      'Superlac (WB) (B) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Superlac Water Based Paint (B) 1L (සුපර්ලැක් වෝටර් බේස් සායම් 1L) - රු. 2,200'
  },
  // 19. W/B (G/B)Superlac 1L | 1 | 2200
  {
    name: 'W/B (G/B) Superlac 1L',
    matchNames: [
      'W/B (G/B) Superlac 1L',
      'W/B (G/B)Superlac 1L',
      'W/B (G/B) superlac 1L',
      'w/b (g/b) superlac 1l',
      'Superlac W/B (G/B) 1L',
      'Superlac (WB) (G/B) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Superlac Water Based Paint (G/B) 1L (සුපර්ලැක් වෝටර් බේස් සායම් 1L) - රු. 2,200'
  },
  // 20. W/B (S/G) Superlac 1L | 1 | 2200
  {
    name: 'W/B (S/G) Superlac 1L',
    matchNames: [
      'W/B (S/G) Superlac 1L',
      'W/B (S/G) superlac 1L',
      'w/b (s/g) superlac 1l',
      'Superlac W/B (S/G) 1L',
      'Superlac (WB) (S/G) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Superlac Water Based Paint (S/G) 1L (සුපර්ලැක් වෝටර් බේස් සායම් 1L) - රු. 2,200'
  },
  // 21. W/B (R) Purlac 1L | 6 | 2200
  {
    name: 'W/B (R) Purlac 1L',
    matchNames: [
      'W/B (R) Purlac 1L',
      'W/B (R) purlac 1L',
      'w/b (r) purlac 1l',
      'W/B (R) Purelac 1L',
      'Purelac W/B (R) 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2200,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Water Based Paint Red (R) 1L (පියුර්ලැක් වෝටර් බේස් රතු සායම් 1L) - රු. 2,200'
  },
  // 22. W/B (B) Purlac 500ml | 7 | 1200
  {
    name: 'W/B (B) Purlac 500ml',
    matchNames: [
      'W/B (B) Purlac 500ml',
      'W/B (B) purlac 500ml',
      'w/b (b) purlac 500ml',
      'W/B (B) Purelac 500ml',
      'Purelac W/B (B) 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1200,
    qty: 7,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Purelac Water Based Paint (B) 500ml (පියුර්ලැක් වෝටර් බේස් සායම් 500ml) - රු. 1,200'
  },
  // 23. HiBOND 1L | 4 | 2600
  {
    name: 'HiBOND 1L',
    matchNames: [
      'HiBOND 1L',
      'HiBOND 1l',
      'hibond 1l',
      'Hibond 1L',
      'Hi-Bond 1L',
      'Hi Bond 1L'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2600,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'HiBOND Waterproofing / Bonding Agent 1L (හයිබොන්ඩ් 1L) - රු. 2,600'
  },
  // 24. HiBOND 500ml | 3 | 1400
  {
    name: 'HiBOND 500ml',
    matchNames: [
      'HiBOND 500ml',
      'hibond 500ml',
      'Hibond 500ml',
      'Hi-Bond 500ml',
      'Hi Bond 500ml'
    ],
    category: 'සායම් හා රසායනික',
    subCategory: 'රසායනික ද්‍රව්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1400,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'HiBOND Waterproofing / Bonding Agent 500ml (හයිබොන්ඩ් 500ml) - රු. 1,400'
  }
];

function generateBarcode(existingBarcodes) {
  for (let i = 0; i < 1000; i++) {
    const randomPart = Math.floor(1000000000 + Math.random() * 9000000000);
    const code = '20' + String(randomPart);
    if (!existingBarcodes.has(code)) {
      existingBarcodes.add(code);
      return code;
    }
  }
  const fallback = '20' + Date.now().toString().slice(-10);
  existingBarcodes.add(fallback);
  return fallback;
}

async function processDb(targetDbPath) {
  if (!fs.existsSync(targetDbPath)) {
    console.log(`Skipping non-existent DB: ${targetDbPath}`);
    return;
  }

  console.log(`\n========================================`);
  console.log(`Processing Database: ${targetDbPath}`);
  console.log(`========================================`);

  const db = new sqlite3.Database(targetDbPath);

  const run = (q, p = []) => new Promise((res, rej) => db.run(q, p, function(err) { if (err) rej(err); else res(this); }));
  const get = (q, p = []) => new Promise((res, rej) => db.get(q, p, (err, row) => { if (err) rej(err); else res(row); }));
  const all = (q, p = []) => new Promise((res, rej) => db.all(q, p, (err, rows) => { if (err) rej(err); else res(rows); }));

  const existingItems = await all('SELECT id, name, barcode FROM items');
  const existingBarcodes = new Set(existingItems.map(i => (i.barcode || '').trim()).filter(Boolean));

  let added = 0;
  let updated = 0;

  for (const item of itemsToAdd) {
    let existing = null;
    for (const matchName of item.matchNames) {
      existing = await get('SELECT id, name, qty, sellPrice, barcode FROM items WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))', [matchName]);
      if (existing) break;
    }

    if (existing) {
      let barcode = (existing.barcode || '').trim();
      if (!barcode) {
        barcode = generateBarcode(existingBarcodes);
      }
      await run(
        `UPDATE items 
         SET name = ?, barcode = ?, category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, qty = ?, reorderLevel = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ?
         WHERE id = ?`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, existing.id]
      );
      console.log(`🔄 Updated item: ID ${existing.id} -> ${item.name} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice} | Barcode: ${barcode}`);
      updated++;
    } else {
      const barcode = generateBarcode(existingBarcodes);
      const res = await run(
        `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, packSize, packUnit, loosePrice, description, image, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, Date.now()]
      );
      console.log(`✅ Added new item: ID ${res.lastID} -> ${item.name} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice} | Barcode: ${barcode}`);
      added++;
    }
  }

  console.log(`Summary for ${path.basename(targetDbPath)}: Added: ${added}, Updated: ${updated}, Total items in batch: ${itemsToAdd.length}`);
  db.close();
}

async function main() {
  const dbPaths = [
    path.join(__dirname, '..', 'backend', 'pos.db')
  ];

  if (process.env.APPDATA) {
    dbPaths.push(path.join(process.env.APPDATA, 'hardware-pos', 'pos.db'));
    dbPaths.push(path.join(process.env.APPDATA, 'Hardware POS', 'pos.db'));
  }

  const uniquePaths = [...new Set(dbPaths)];

  for (const p of uniquePaths) {
    await processDb(p);
  }

  console.log('\n🎉 Batch 35 Paint/Chemical items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
