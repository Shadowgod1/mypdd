const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const lines = html.split(/\r?\n/);
let found = 0;
lines.forEach((line, idx) => {
  if (line.includes('${') && !line.includes('`')) {
    console.log(`Line ${idx + 1}: ${line}`);
    found++;
  }
});

console.log('Unescaped ${ in non-template strings count:', found);
