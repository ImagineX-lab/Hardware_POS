const { default: pngToIco } = require('png-to-ico');
const fs = require('fs');

pngToIco('icon.png')
  .then(buf => {
    fs.writeFileSync('icon.ico', buf);
    console.log('icon.ico created successfully, size:', buf.length, 'bytes');
  })
  .catch(err => console.error('Error:', err));
