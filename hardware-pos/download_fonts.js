const https = require('https');
const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir);
}

const cssUrl = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap';

https.get(cssUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    let urls = [];
    const regex = /url\((https:\/\/[^\)]+)\)/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      urls.push(match[1]);
    }
    
    let downloaded = 0;
    let localCss = data;
    
    urls.forEach((url, i) => {
      const fileName = `font_${i}.woff2`;
      const filePath = path.join(fontsDir, fileName);
      
      localCss = localCss.replace(url, `../fonts/${fileName}`);
      
      https.get(url, (fontRes) => {
        const fileStream = fs.createWriteStream(filePath);
        fontRes.pipe(fileStream);
        fileStream.on('finish', () => {
          downloaded++;
          console.log(`Downloaded ${fileName}`);
          if (downloaded === urls.length) {
            fs.writeFileSync(path.join(__dirname, 'css', 'fonts.css'), localCss);
            console.log('All fonts downloaded and fonts.css created!');
          }
        });
      });
    });
  });
}).on('error', (e) => {
  console.error(e);
});
