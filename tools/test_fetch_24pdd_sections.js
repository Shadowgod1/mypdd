const https = require('https');
const fs = require('fs');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchText(res.headers.location));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

const URLS = [
  'https://24pdd.kz/1-gorizontalnaya-razmetka/',
  'https://24pdd.kz/2-vertikalnaya-razmetka/',
  'https://24pdd.kz/tablitsa-shtrafov-za-narushenie-pdd-rk/',
  'https://24pdd.kz/osnovnye-polozheniya-po-dopusku-transportnyh-sredstv-k-ekspluatatsii/',
  'https://24pdd.kz/perechen-neispravnostej-i-uslovij-pri-kotoryh-zapreshhaetsya-ekspluatatsiya-transportnyh-sredstv/',
  'https://24pdd.kz/zakon-respubliki-kazahstan-o-dorozhnom-dvizhenii/',
  'https://24pdd.kz/nalog-na-transport-v-kazahstane/',
  'https://24pdd.kz/kategorii-i-podkategorii-transportnyh-sredstv/',
  'https://24pdd.kz/kody-regionov-na-avtomobilnyh-nomerah-kazahstana/',
  'https://24pdd.kz/zvaniya-sotrudnikov-mvd-rk/',
  'https://24pdd.kz/pdd-dlya-velosipedistov/',
  'https://24pdd.kz/1-metodika-provedeniya-prakticheskogo-ekzamena-na-avtomatizirovannom-avtodrome/'
];

async function main() {
  for (const u of URLS) {
    try {
      const res = await fetchText(u);
      console.log(`URL: ${u} => status: ${res.status}, len: ${res.data.length}`);
    } catch (e) {
      console.log(`URL: ${u} => ERROR: ${e.message}`);
    }
  }
}

main().catch(console.error);
