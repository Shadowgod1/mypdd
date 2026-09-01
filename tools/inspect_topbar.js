const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const bodyIdx = html.indexOf('<body');
console.log('body index:', bodyIdx);
console.log(html.slice(bodyIdx, bodyIdx + 1500));
