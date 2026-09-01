const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const jsStart = html.indexOf('<script>');
const js = html.slice(jsStart);
const pos = js.indexOf("document.querySelectorAll('#main-nav [data-nav]')");
console.log(js.slice(pos - 100, pos + 800));
