const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const html = await fetchUrl('https://24pdd.kz/2-znaki-prioriteta/');
  console.log('HTML Length:', html.length);
  
  // Extract table rows or items
  // Let's print out the first 2000 chars of entry content
  const entryStart = html.indexOf('<div class="entry-content') || html.indexOf('<article');
  console.log(html.slice(entryStart, entryStart + 3500));
}

main().catch(console.error);
