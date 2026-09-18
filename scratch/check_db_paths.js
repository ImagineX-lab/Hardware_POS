const fs = require('fs');
const path = require('path');

const paths = [
  path.join(__dirname, '..', 'backend', 'pos.db'),
  path.join(process.env.APPDATA, 'hardware-pos', 'pos.db'),
  path.join(process.env.APPDATA, 'Hardware POS', 'pos.db')
];

paths.forEach(p => {
  console.log(p, '-> exists:', fs.existsSync(p));
});
