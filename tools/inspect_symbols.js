const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const symbols = [];
const re = /<symbol\s+id="([^"]+)"/g;
let m;
while ((m = re.exec(html)) !== null) {
  symbols.push(m[1]);
}
console.log('Symbols count:', symbols.length);
console.log(symbols);
