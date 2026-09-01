const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tRuMatch = html.match(/const T\s*=\s*\{[\s\S]*?ru:\s*\{([\s\S]*?)\},\s*kk:\s*\{([\s\S]*?)\}/);
if (tRuMatch) {
  const ruStr = tRuMatch[1];
  const kkStr = tRuMatch[2];
  console.log('ru has modesH:', ruStr.includes('modesH:'));
  console.log('ru has hubTitle:', ruStr.includes('hubTitle:'));
  console.log('kk has modesH:', kkStr.includes('modesH:'));
  console.log('kk has hubTitle:', kkStr.includes('hubTitle:'));
}
