const https = require('https');
const fs = require('fs');

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
  const html = await fetchUrl('https://24pdd.kz/');
  
  // Extract all nav menu items
  const menuMatches = html.match(/<li[^>]*class="[^"]*menu-item[^"]*"[^>]*>[\s\S]*?<\/li>/gi) || [];
  console.log(`Found ${menuMatches.length} menu items:`);
  
  const menuLinks = [];
  menuMatches.forEach(m => {
    const a = m.match(/href="([^"]+)"[^>]*>([^<]+)<\/a>/i);
    if (a) {
      menuLinks.push({ url: a[1], title: a[2].trim() });
    }
  });
  console.log(menuLinks);
  fs.writeFileSync('tools/24pdd_menu_links.json', JSON.stringify(menuLinks, null, 2));
}

main().catch(console.error);
