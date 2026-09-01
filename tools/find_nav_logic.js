const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const p1 = html.indexOf('id="main-nav"');
console.log('HTML NAV:\n', html.slice(p1, p1 + 1200));

const p2 = html.indexOf("document.querySelectorAll('.nav-link')") !== -1 ? html.indexOf("document.querySelectorAll('.nav-link')") : html.indexOf('data-nav');
console.log('JS NAV Handler:\n', html.slice(p2, p2 + 800));
