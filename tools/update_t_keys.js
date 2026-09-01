const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Update T.ru
html = html.replace("heroEyebrow:'Казахстан · категории B и C',", "heroEyebrow:'Казахстан · категории B и C',\n  modesH:'Режимы подготовки',\n  secTopics:'Тематический зачёт (12 тем)',");

// Update T.kk
html = html.replace("heroEyebrow:'Қазақстан · B және C санаттары',", "heroEyebrow:'Қазақстан · B және C санаттары',\n  modesH:'Дайындық режимдері',\n  secTopics:'Тақырыптық сынақ (12 тақырып)',\n  hubTitle:'ЖҚЕ порталының бөлімдері',");

fs.writeFileSync(indexPath, html);
console.log('Successfully updated T dictionary with modesH, secTopics, and hubTitle!');
