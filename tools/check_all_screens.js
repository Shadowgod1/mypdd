const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const functionsToFind = ['screenHome', 'screenSigns', 'screenMarkings', 'screenFines', 'screenPmp', 'screenRules'];

functionsToFind.forEach(fn => {
  const re = new RegExp('function\\s+' + fn + '\\s*\\(', 'g');
  const matches = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    matches.push(m.index);
  }
  console.log(`function ${fn}: found ${matches.length} occurrences at positions:`, matches);
});
