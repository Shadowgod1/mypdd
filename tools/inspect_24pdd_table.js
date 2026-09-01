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
  
  // Find all table tags or rows
  const tablePos = html.indexOf('<table');
  if (tablePos !== -1) {
    console.log('Found <table> at', tablePos);
    console.log(html.slice(tablePos, tablePos + 2500));
  } else {
    console.log('No <table> found, searching for img tags:');
    const imgs = html.match(/<img[^>]+src="([^">]+)"/gi) || [];
    console.log('Images found:', imgs.slice(0, 10));
  }
}

main().catch(console.error);
