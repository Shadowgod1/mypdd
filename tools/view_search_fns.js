const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const smPos = html.indexOf('function searchMarkings');
console.log(html.slice(smPos, smPos + 800));

const sfPos = html.indexOf('function searchFines');
console.log(html.slice(sfPos, sfPos + 800));
