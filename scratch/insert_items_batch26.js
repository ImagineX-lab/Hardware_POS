const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const itemsToAdd = [
  // 1. 1" කොන්ක්රීට් ඇණ | 100 | RS. 4
  {
    name: '1" කොන්ක්රීට් ඇණ',
    matchNames: ['1" කොන්ක්රීට් ඇණ', '1" කොන්ක්‍රීට් ඇණ'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 4,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1" කොන්ක්‍රීට් ඇණ (1" Concrete Nail) - රු. 4'
  },
  // 2. 1 1/2" කොන්ක්රීට් ඇණ | 100 | RS. 7
  {
    name: '1 1/2" කොන්ක්රීට් ඇණ',
    matchNames: ['1 1/2" කොන්ක්රීට් ඇණ', '1 1/2" කොන්ක්‍රීට් ඇණ'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 7,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '1 1/2" කොන්ක්‍රීට් ඇණ (1 1/2" Concrete Nail) - රු. 7'
  },
  // 3. 2" කොන්ක්රීට් ඇණ | 100 | RS. 10
  {
    name: '2" කොන්ක්රීට් ඇණ',
    matchNames: ['2" කොන්ක්රීට් ඇණ', '2" කොන්ක්‍රීට් ඇණ'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 10,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2" කොන්ක්‍රීට් ඇණ (2" Concrete Nail) - රු. 10'
  },
  // 4. 2 1/2" කොන්ක්රීට් ඇණ | 100 | RS. 15
  {
    name: '2 1/2" කොන්ක්රීට් ඇණ',
    matchNames: ['2 1/2" කොන්ක්රීට් ඇණ', '2 1/2" කොන්ක්‍රීට් ඇණ'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 15,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '2 1/2" කොන්ක්‍රීට් ඇණ (2 1/2" Concrete Nail) - රු. 15'
  },
  // 5. 3" කොන්ක්රීට් ඇණ | 100 | RS. 20
  {
    name: '3" කොන්ක්රීට් ඇණ',
    matchNames: ['3" කොන්ක්රීට් ඇණ', '3" කොන්ක්‍රීට් ඇණ'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 20,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '3" කොන්ක්‍රීට් ඇණ (3" Concrete Nail) - රු. 20'
  },
  // 6. 4" කොන්ක්රීට් ඇණ | 100 | RS. 25
  {
    name: '4" කොන්ක්රීට් ඇණ',
    matchNames: ['4" කොන්ක්රීට් ඇණ', '4" කොන්ක්‍රීට් ඇණ'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 25,
    qty: 100,
    reorderLevel: 20,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: '4" කොන්ක්‍රීට් ඇණ (4" Concrete Nail) - රු. 25'
  },
  // 7. 3/4" පැනල් පින් (යකඩ) 100g -> 150
  {
    name: '3/4" පැනල් පින් (යකඩ) 100g',
    matchNames: ['3/4" පැනල් පින් (යකඩ) 100g', '3/4" පැනල් පින් (යකඩ)'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: '100g',
    costPrice: 0,
    sellPrice: 150,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'g',
    loosePrice: 150,
    description: '3/4" පැනල් පින් යකඩ (Panel Pin Iron 3/4") - 100g = රු. 150'
  },
  // 8. 1" පැනල් පින් (යකඩ) 100g -> 150
  {
    name: '1" පැනල් පින් (යකඩ) 100g',
    matchNames: ['1" පැනල් පින් (යකඩ) 100g', '1" පැනල් පින් (යකඩ)'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: '100g',
    costPrice: 0,
    sellPrice: 150,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'g',
    loosePrice: 150,
    description: '1" පැනල් පින් යකඩ (Panel Pin Iron 1") - 100g = රු. 150'
  },
  // 9. 3/4" පැනල් පින් (පිත්තල) 100g -> RS. 700
  {
    name: '3/4" පැනල් පින් (පිත්තල) 100g',
    matchNames: ['3/4" පැනල් පින් (පිත්තල) 100g', '3/4" පැනල් පින් (පිත්තල)'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: '100g',
    costPrice: 0,
    sellPrice: 700,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'g',
    loosePrice: 700,
    description: '3/4" පැනල් පින් පිත්තල (Panel Pin Brass 3/4") - 100g = රු. 700'
  },
  // 10. 1" පැනල් පින් (පිත්තල) 100g -> RS. 700
  {
    name: '1" පැනල් පින් (පිත්තල) 100g',
    matchNames: ['1" පැනල් පින් (පිත්තල) 100g', '1" පැනල් පින් (පිත්තල)'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: '100g',
    costPrice: 0,
    sellPrice: 700,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'g',
    loosePrice: 700,
    description: '1" පැනල් පින් පිත්තල (Panel Pin Brass 1") - 100g = රු. 700'
  },
  // 11. 3/4" ටින්ටස් ඇණ 100g -> RS. 130
  {
    name: '3/4" ටින්ටස් ඇණ 100g',
    matchNames: ['3/4" ටින්ටස් ඇණ 100g', '3/4" ටින්ටස් ඇණ'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: '100g',
    costPrice: 0,
    sellPrice: 130,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'g',
    loosePrice: 130,
    description: '3/4" ටින්ටස් ඇණ (Tintacks 3/4") - 100g = රු. 130'
  },
  // 12. 1/2" ටින්ටස් ඇණ 100g -> RS. 130
  {
    name: '1/2" ටින්ටස් ඇණ 100g',
    matchNames: ['1/2" ටින්ටස් ඇණ 100g', '1/2" ටින්ටස් ඇණ'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: '100g',
    costPrice: 0,
    sellPrice: 130,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'g',
    loosePrice: 130,
    description: '1/2" ටින්ටස් ඇණ (Tintacks 1/2") - 100g = රු. 130'
  },
  // 13. 3/4" ජගුවර් ඇණ 100g -> RS. 150
  {
    name: '3/4" ජගුවර් ඇණ 100g',
    matchNames: ['3/4" ජගුවර් ඇණ 100g', '3/4" ජගුවර් ඇණ'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: '100g',
    costPrice: 0,
    sellPrice: 150,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'g',
    loosePrice: 150,
    description: '3/4" ජගුවර් ඇණ (Jaguar Nails 3/4") - 100g = රු. 150'
  },
  // 14. 1" ජගුවර් ඇණ 100g -> RS. 150
  {
    name: '1" ජගුවර් ඇණ 100g',
    matchNames: ['1" ජගුවර් ඇණ 100g', '1" ජගුවර් ඇණ'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ඇණ වර්ග',
    unit: '100g',
    costPrice: 0,
    sellPrice: 150,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'g',
    loosePrice: 150,
    description: '1" ජගුවර් ඇණ (Jaguar Nails 1") - 100g = රු. 150'
  },
  // 15. නිල් තංගුස් නූල් (3) | 5 | RS. 1050
  {
    name: 'නිල් තංගුස් නූල් (3)',
    matchNames: ['නිල් තංගුස් නූල් (3)', 'නිල් තංගුස් නූල් 3'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1050,
    qty: 5,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'නිල් තංගුස් නූල් 3 Size - රු. 1050'
  },
  // 16. කොළ තංගුස් නූල් (2) | 4 | RS. 1250
  {
    name: 'කොළ තංගුස් නූල් (2)',
    matchNames: ['කොළ තංගුස් නූල් (2)', 'කොළ තංගුස් නූල් 2'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1250,
    qty: 4,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'කොළ තංගුස් නූල් 2 Size - රු. 1250'
  },
  // 17. 1/4" Thred bar | 11 | RS. 350
  {
    name: '1/4" Thread bar',
    matchNames: ['1/4" Thread bar', '1/4" Thred bar'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'length',
    costPrice: 0,
    sellPrice: 350,
    qty: 11,
    reorderLevel: 3,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1/4" Threaded Bar (නූල් බාර්) - රු. 350'
  },
  // 18. කොළ තංගුස් 6 Size | යාර් 100 | යාර් 1 -> RS. 35
  {
    name: 'කොළ තංගුස් 6 Size (යාර 100)',
    matchNames: ['කොළ තංගුස් 6 Size (යාර 100)', 'කොළ තංගුස් 6 Size'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 3500,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'yd',
    loosePrice: 35,
    description: 'කොළ තංගුස් 6 Size (යාර 100 රෝල) - රෝල = රු. 3500 / යාර 1 = රු. 35'
  },
  // 19. රතු තංගුස් 5 Size | යාර 100 | යාර් 1 -> RS. 25
  {
    name: 'රතු තංගුස් 5 Size (යාර 100)',
    matchNames: ['රතු තංගුස් 5 Size (යාර 100)', 'රතු තංගුස් 5 Size'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 2500,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'yd',
    loosePrice: 25,
    description: 'රතු තංගුස් 5 Size (යාර 100 රෝල) - රෝල = රු. 2500 / යාර 1 = රු. 25'
  },
  // 20. කොළ තංගුස් 7 Size | යාර 100 | යාර් 1 -> RS. 40
  {
    name: 'කොළ තංගුස් 7 Size (යාර 100)',
    matchNames: ['කොළ තංගුස් 7 Size (යාර 100)', 'කොළ තංගුස් 7 Size'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 4000,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'yd',
    loosePrice: 40,
    description: 'කොළ තංගුස් 7 Size (යාර 100 රෝල) - රෝල = රු. 4000 / යාර 1 = රු. 40'
  },
  // 21. තැඹිලි 8 Size | යාර 100 | යාර් 1 -> RS. 45
  {
    name: 'තැඹිලි තංගුස් 8 Size (යාර 100)',
    matchNames: ['තැඹිලි තංගුස් 8 Size (යාර 100)', 'තැඹිලි 8 Size', 'තැඹිලි තංගුස් 8 Size'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 4500,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'yd',
    loosePrice: 45,
    description: 'තැඹිලි තංගුස් 8 Size (යාර 100 රෝල) - රෝල = රු. 4500 / යාර 1 = රු. 45'
  },
  // 22. කොළ 10 Size | යාර 100 | යාර් 1 -> RS. 60
  {
    name: 'කොළ තංගුස් 10 Size (යාර 100)',
    matchNames: ['කොළ තංගුස් 10 Size (යාර 100)', 'කොළ 10 Size', 'කොළ තංගුස් 10 Size'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 6000,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'yd',
    loosePrice: 60,
    description: 'කොළ තංගුස් 10 Size (යාර 100 රෝල) - රෝල = රු. 6000 / යාර 1 = රු. 60'
  },
  // 23. 1/2" (නූල් හතර) | 9 | RS. 750
  {
    name: '1/2" Thread bar (නූල් හතර)',
    matchNames: ['1/2" Thread bar (නූල් හතර)', '1/2" (නූල් හතර)', '1/2" Thread bar'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'length',
    costPrice: 0,
    sellPrice: 750,
    qty: 9,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '1/2" Threaded Bar / නූල් හතර බාර් - රු. 750'
  },
  // 24. නූල් 2 1/2" Thred bar | 10 | RS. 450
  {
    name: '2 1/2" Thread bar (නූල්)',
    matchNames: ['2 1/2" Thread bar (නූල්)', 'නූල් 2 1/2" Thred bar', '2 1/2" Thread bar'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'length',
    costPrice: 0,
    sellPrice: 450,
    qty: 10,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '2 1/2" Threaded Bar (නූල් බාර්) - රු. 450'
  },
  // 25. නූල් 3" Thred bar | 0 | RS. 550
  {
    name: '3" Thread bar (නූල්)',
    matchNames: ['3" Thread bar (නූල්)', 'නූල් 3" Thred bar', '3" Thread bar'],
    category: 'ගොඩනැගිලි උපකරණ',
    subCategory: 'ගොඩනැගිලි උපකරණ',
    unit: 'length',
    costPrice: 0,
    sellPrice: 550,
    qty: 0,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'length',
    loosePrice: 0,
    description: '3" Threaded Bar (නූල් බාර්) - රු. 550'
  },
  // 26. Earth කූරු (නූල් 4 - 12mm) | 8 | RS. 1750
  {
    name: 'Earth කූරු (නූල් 4 - 12mm)',
    matchNames: ['Earth කූරු (නූල් 4 - 12mm)', 'Earth කූරු (12mm)'],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 1750,
    qty: 8,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Earth Rod / අර්ත් කූරු 12mm (නූල් 4) - රු. 1750'
  },
  // 27. Earth කූරු (නූල් 3 - 10mm) | 0 | RS. 0
  {
    name: 'Earth කූරු (නූල් 3 - 10mm)',
    matchNames: ['Earth කූරු (නූල් 3 - 10mm)', 'Earth කූරු (10mm)'],
    category: 'විදුලි උපකරණ',
    subCategory: 'විදුලි උපාංග',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 0,
    qty: 0,
    reorderLevel: 2,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'Earth Rod / අර්ත් කූරු 10mm (නූල් 3)'
  },
  // 28. තඹ බට (5/8") | 15m roll 1 | අඩි 1 -> RS. 750
  {
    name: 'තඹ බට 5/8" (15m Roll)',
    matchNames: ['තඹ බට 5/8" (15m Roll)', 'තඹ බට (5/8")'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'හෝස් (Hose)',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 37500,
    qty: 1,
    reorderLevel: 1,
    packSize: 50,
    packUnit: 'ft',
    loosePrice: 750,
    description: 'තඹ බට 5/8" (Copper Tube 5/8" - 15m/50ft Roll) - රෝල = රු. 37,500 / අඩි 1 = රු. 750'
  },
  // 29. ගෑස් බට | අඩි 100 roll 1 | අඩි 1 -> RS. 175
  {
    name: 'ගෑස් බට (අඩි 100 Roll)',
    matchNames: ['ගෑස් බට (අඩි 100 Roll)', 'ගෑස් බට'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'හෝස් (Hose)',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 17500,
    qty: 1,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'ft',
    loosePrice: 175,
    description: 'ගෑස් බට අඩි 100 රෝල (Gas Hose 100ft) - රෝල = රු. 17,500 / අඩි 1 = රු. 175'
  },
  // 30. High fresher horse | 2 | RS. 3750
  {
    name: 'High Pressure Hose',
    matchNames: ['High Pressure Hose', 'High fresher horse', 'High Pressure Horse'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'හෝස් (Hose)',
    unit: 'pcs',
    costPrice: 0,
    sellPrice: 3750,
    qty: 2,
    reorderLevel: 1,
    packSize: 1,
    packUnit: 'pcs',
    loosePrice: 0,
    description: 'High Pressure Hose (හයි ප්‍රෙෂර් හෝස්) - රු. 3,750'
  },
  // 31. Clear horse (level බට) 6mm x 30mm | 3 roll / අඩි 100 | අඩි 1 -> 30
  {
    name: 'Clear Hose (level බට) 6mm x 30m',
    matchNames: ['Clear Hose (level බට) 6mm x 30m', 'Clear horse (level බට) 6mm x 30mm', 'Clear horse (level බට)'],
    category: 'පයිප්ප හා සනිටරි',
    subCategory: 'හෝස් (Hose)',
    unit: 'roll',
    costPrice: 0,
    sellPrice: 3000,
    qty: 3,
    reorderLevel: 1,
    packSize: 100,
    packUnit: 'ft',
    loosePrice: 30,
    description: 'Clear Level Hose 6mm x 30m (ලෙවල් බට අඩි 100 රෝල) - රෝල = රු. 3,000 / අඩි 1 = රු. 30'
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

  console.log('\n🎉 Batch 26 items added/updated successfully to all databases!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
