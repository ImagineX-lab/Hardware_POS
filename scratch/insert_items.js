const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. JAT paints mahogany Tube | Qty: 4 | Price: Rs. 692
  {
    name: 'JAT paints mahogany Tube',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 692,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT paints mahogany Tube - රු. 692'
  },
  // 2. JAT paints wood Jackwood Tube | Qty: 2 | Price: Rs. 692
  {
    name: 'JAT paints wood Jackwood Tube',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 692,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT paints wood Jackwood Tube - රු. 692'
  },
  // 3. JAT paints Teak Tube | Qty: 5 | Price: Rs. 692
  {
    name: 'JAT paints Teak Tube',
    category: 'සායම් හා රසායනික',
    subCategory: 'දැව ආරක්ෂක',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 692,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT paints Teak Tube - රු. 692'
  },
  // 4. JAT paints 1kg Jackwood | Qty: 2 | Price: Rs. 1059
  {
    name: 'JAT paints 1kg Jackwood',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1059,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT paints 1kg Jackwood - රු. 1,059'
  },
  // 5. JAT paints 500g Jackwood | Qty: 3 | Price: Rs. 1326
  {
    name: 'JAT paints 500g Jackwood',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1326,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT paints 500g Jackwood - රු. 1,326'
  },
  // 6. JAT paints 500g Teak | Qty: 3 | Price: Rs. 1326
  {
    name: 'JAT paints 500g Teak',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1326,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT paints 500g Teak - රු. 1,326'
  },
  // 7. JAT paints 500g mahogany | Qty: 1 | Price: Rs. 1326
  {
    name: 'JAT paints 500g mahogany',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1326,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT paints 500g mahogany - රු. 1,326'
  },
  // 8. JAT paints 500g dark Teak | Qty: 1 | Price: Rs. 1326
  {
    name: 'JAT paints 500g dark Teak',
    category: 'සායම් හා රසායනික',
    subCategory: 'සායම් (Paint)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1326,
    qty: 1,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'JAT paints 500g dark Teak - රු. 1,326'
  },
  // 9. Woodlo Teak furniture putty | Qty: 2 | Price: Rs. 1250
  {
    name: 'Woodlo Teak furniture putty',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'පොටි',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1250,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Woodlo Teak furniture putty - රු. 1,250'
  },
  // 10. Silicone Hi-Tech | Qty: 11 | Price: Rs. 850
  {
    name: 'Silicone Hi-Tech',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 850,
    qty: 11,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Silicone Hi-Tech sealant - රු. 850'
  },
  // 11. Eurofix Super Strength | Qty: 15 | Price: Rs. 450
  {
    name: 'Eurofix Super Strength',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 15,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Eurofix Super Strength adhesive - රු. 450'
  },
  // 12. Araldite Gum (Rapid Steel) | Qty: 5 | Price: Rs. 485
  {
    name: 'Araldite Gum (Rapid Steel)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 485,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Araldite Gum (Rapid Steel) - රු. 485'
  },
  // 13. Araldite Rapid | Qty: 6 | Price: Rs. 450
  {
    name: 'Araldite Rapid',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 450,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Araldite Rapid adhesive - රු. 450'
  },
  // 14. Epoxy Stick Gum | Qty: 6 | Price: Rs. 490
  {
    name: 'Epoxy Stick Gum',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 490,
    qty: 6,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Epoxy Stick Gum - රු. 490'
  },
  // 15. Gasket Maker Gum | Qty: 3 | Price: Rs. 550
  {
    name: 'Gasket Maker Gum',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 550,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Gasket Maker Gum - රු. 550'
  },
  // 16. Multibond Auto Seeler | Qty: 3 | Price: Rs. 930
  {
    name: 'Multibond Auto Seeler',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 930,
    qty: 3,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Multibond Auto Seeler - රු. 930'
  },
  // 17. polishing disc (4.5"/115mm) | Qty: 14 | Price: Rs. 310
  {
    name: 'polishing disc (4.5"/115mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 310,
    qty: 14,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Polishing Disc (4.5" / 115mm) - රු. 310'
  },
  // 18. polishing disc (4"/100mm) | Qty: 18 | Price: Rs. 220
  {
    name: 'polishing disc (4"/100mm)',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'කපන ද්‍රවය්‍ය',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 220,
    qty: 18,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Polishing Disc (4" / 100mm) - රු. 220'
  },
  // 19. Super glue | Qty: 17 | Price: Rs. 100
  {
    name: 'Super glue',
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගම්',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 100,
    qty: 17,
    reorderLevel: 5,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Super Glue - රු. 100'
  },
  // 20. Sun Tec Cables (100m - 1/1.13mm) | Qty: 8 | Price: Rs. 7820
  {
    name: 'Sun Tec Cables (100m - 1/1.13mm)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 7820,
    qty: 8,
    reorderLevel: 2,
    packSize: 100,
    packUnit: 'm',
    loosePrice: 78.20,
    description: 'Sun Tec Cables (100m - 1/1.13mm) - Roll: රු. 7,820'
  },
  // 21. Sun Tec (100m - 16/0.20mm) | Qty: 2 | Price: Rs. 9160
  {
    name: 'Sun Tec (100m - 16/0.20mm)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 9160,
    qty: 2,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'm',
    loosePrice: 91.60,
    description: 'Sun Tec (100m - 16/0.20mm) - Roll: රු. 9,160'
  },
  // 22. Kelani Cables (50m - 2.50mm²) | Qty: 2 | Price: Rs. 9250
  {
    name: 'Kelani Cables (50m - 2.50mm²)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 9250,
    qty: 2,
    reorderLevel: 1,
    packSize: 50,
    packUnit: 'm',
    loosePrice: 185.00,
    description: 'Kelani Cables (50m - 2.50mm²) - Roll: රු. 9,250'
  },
  // 23. Kelani Cables (100m - 2.50mm²) | Qty: 2 | Price: Rs. 18500
  {
    name: 'Kelani Cables (100m - 2.50mm²)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 18500,
    qty: 2,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'm',
    loosePrice: 185.00,
    description: 'Kelani Cables (100m - 2.50mm²) - Roll: රු. 18,500'
  },
  // 24. Kelani Cables (100m - 1.0mm²) | Qty: 2 | Price: Rs. 11450
  {
    name: 'Kelani Cables (100m - 1.0mm²)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 11450,
    qty: 2,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'm',
    loosePrice: 114.50,
    description: 'Kelani Cables (100m - 1.0mm²) - Roll: රු. 11,450'
  },
  // 25. Kelani Cables (100m - 1/1.13mm) | Qty: 7 | Price: Rs. 7820
  {
    name: 'Kelani Cables (100m - 1/1.13mm)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 7820,
    qty: 7,
    reorderLevel: 2,
    packSize: 100,
    packUnit: 'm',
    loosePrice: 78.20,
    description: 'Kelani Cables (100m - 1/1.13mm) - Roll: රු. 7,820'
  },
  // 26. Kelani Cables (50m - 1/1.13mm) | Qty: 1 | Price: Rs. 3910
  {
    name: 'Kelani Cables (50m - 1/1.13mm)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 3910,
    qty: 1,
    reorderLevel: 1,
    packSize: 50,
    packUnit: 'm',
    loosePrice: 78.20,
    description: 'Kelani Cables (50m - 1/1.13mm) - Roll: රු. 3,910'
  },
  // 27. Kelani Cables (100m - 7/0.53mm) | Qty: 2 | Price: Rs. 13770
  {
    name: 'Kelani Cables (100m - 7/0.53mm)',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 13770,
    qty: 2,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'm',
    loosePrice: 137.70,
    description: 'Kelani Cables (100m - 7/0.53mm) - Roll: රු. 13,770'
  },
  // 28. Kelani Cables (100m - 7/0.53mm) Flat twin | Qty: 1 | Price: Rs. 33970
  {
    name: 'Kelani Cables (100m - 7/0.53mm) Flat twin',
    category: 'විදුලි උපකරණ',
    subCategory: 'වයර් / කේබල්',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 33970,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'm',
    loosePrice: 339.70,
    description: 'Kelani Cables (100m - 7/0.53mm) Flat twin - Roll: රු. 33,970'
  },
  // 29. කොබෙ වානේ උදලු තල | Qty: 12 | Price: Rs. 1550
  {
    name: 'කොබෙ වානේ උදලු තල',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1550,
    qty: 12,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'කොබෙ වානේ උදලු තල - රු. 1,550'
  },
  // 30. කිඹුලා වානේ උදලු තල | Qty: 2 | Price: Rs. 2750
  {
    name: 'කිඹුලා වානේ උදලු තල',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 2750,
    qty: 2,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'කිඹුලා වානේ උදලු තල (Crocodile Brand) - රු. 2,750'
  },
  // 31. BTex වානේ උදලු තල | Qty: 1 | Price: Rs. 1750
  {
    name: 'BTex වානේ උදලු තල',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 1,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'BTex වානේ උදලු තල - රු. 1,750'
  },
  // 32. කුකුළා වානේ උදලු තල (ගොඩ) | Qty: 1 | Price: Rs. 1550
  {
    name: 'කුකුළා වානේ උදලු තල (ගොඩ)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1550,
    qty: 1,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'කුකුළා වානේ උදලු තල (ගොඩ) - රු. 1,550'
  },
  // 33. කුකුළා වානේ උදලු තල (මඩ) | Qty: 1 | Price: Rs. 1750
  {
    name: 'කුකුළා වානේ උදලු තල (මඩ)',
    category: 'ගෘහ උපකරණ',
    subCategory: 'වතු/ගෘහ උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 1,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'කුකුළා වානේ උදලු තල (මඩ) - රු. 1,750'
  }
];

function generateBarcode(existingBarcodes) {
  for (let attempts = 0; attempts < 200; attempts++) {
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
    const existing = await get('SELECT id, name, qty, sellPrice, barcode FROM items WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))', [item.name]);

    if (existing) {
      // Update existing item with correct stock, price and category
      await run(
        `UPDATE items 
         SET category = ?, subCategory = ?, unit = ?, costPrice = ?, sellPrice = ?, qty = ?, reorderLevel = ?, packSize = ?, packUnit = ?, loosePrice = ?, description = ?
         WHERE id = ?`,
        [item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, existing.id]
      );
      console.log(`🔄 Updated existing item: ID ${existing.id} -> ${item.name} (Qty: ${item.qty}, Price: Rs. ${item.sellPrice})`);
      updated++;
    } else {
      const barcode = generateBarcode(existingBarcodes);
      const res = await run(
        `INSERT INTO items (name, barcode, category, subCategory, unit, costPrice, sellPrice, qty, reorderLevel, packSize, packUnit, loosePrice, description, image, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)`,
        [item.name, barcode, item.category, item.subCategory, item.unit, item.costPrice, item.sellPrice, item.qty, item.reorderLevel, item.packSize || 1, item.packUnit || 'pcs', item.loosePrice || 0, item.description, Date.now()]
      );
      console.log(`✅ Added new item: ID ${res.lastID} -> ${item.name} | Barcode: ${barcode} | Qty: ${item.qty} | Price: Rs. ${item.sellPrice}`);
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

  console.log('\n🎉 All databases processed successfully!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
