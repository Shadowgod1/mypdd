const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const jsStart = html.indexOf('<script>');
console.log('Searching in JS section (length ' + (html.length - jsStart) + ')...');

const js = html.slice(jsStart);
const lines = js.split(/\r?\n/);

lines.forEach((line, idx) => {
  if (line.includes('data-nav') || line.includes('nav-link') || line.includes('screenMarkings')) {
    console.log(`Line ${idx + 1}: ${line.slice(0, 120)}`);
  }
});
