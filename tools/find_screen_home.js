const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const matches = [];
const re = /function screenHome\(\)/g;
let m;
while ((m = re.exec(html)) !== null) {
  matches.push(m.index);
}

console.log('Occurrences of function screenHome():', matches.length);
matches.forEach((idx, i) => {
  console.log(`Occurrence ${i + 1} at character ${idx}:\n`, html.slice(idx, idx + 200), '\n---');
});
