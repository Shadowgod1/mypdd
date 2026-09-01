const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function main() {
  const res = await fetchUrl('https://24pdd.kz/');
  console.log('Homepage status:', res.status);
  
  // Find all links related to znaki
  const matches = res.data.match(/href="([^"]*znaki[^"]*)"/gi) || [];
  console.log('Signs links:', [...new Set(matches)]);

  const allLinks = res.data.match(/href="https:\/\/24pdd\.kz\/[^"]+"/gi) || [];
  console.log('Sample links:', [...new Set(allLinks)].slice(0, 30));
}

main().catch(console.error);
