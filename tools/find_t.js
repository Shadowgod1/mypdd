const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const re = /\bT\s*=\s*\{/g;
let m;
while ((m = re.exec(html)) !== null) {
  console.log('Found T = { at index:', m.index);
  console.log(html.slice(m.index, m.index + 300));
}
