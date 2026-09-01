const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pos = html.indexOf('function screenSigns');
console.log(html.slice(pos, pos + 1800));
