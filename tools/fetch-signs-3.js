/* Третий проход по знакам без изображения.

   Два разных случая:
   1. Одиночные номера вроде 3.1 или 3.27 — файл на Викискладе есть,
      предыдущие проходы просто теряли запросы. Повторяем настойчивее.
   2. Диапазоны вроде «1.4.1–1.4.6» — за записью стоят несколько
      отдельных знаков. Разворачиваем диапазон и качаем каждый,
      чтобы показать их набором.

   Итог: source/signs/<номер>.svg и source/signs/ranges.json
*/
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'source', 'signs');
const UA = 'JolUstazy/1.0 (educational PDD trainer; https://github.com/Shadowgod1/mypdd)';

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const data = JSON.parse(html.match(/const SIGNS_DATA\s*=\s*(\[[\s\S]*?\]);\n/)[1]);
const missing = data.filter(s => !s.img).map(s => String(s.num || '').trim()).filter(Boolean);

/* «1.4.1–1.4.6» -> [1.4.1 ... 1.4.6];  «5.7.1–5.7.2» -> [5.7.1, 5.7.2] */
function expand(num) {
  const m = num.match(/^([\d.]+?)(\d+)\s*[–—-]\s*([\d.]+?)(\d+)$/);
  if (!m) return null;
  const prefA = m[1], a = +m[2], prefB = m[3], b = +m[4];
  if (prefA !== prefB || b < a || b - a > 30) return null;
  const out = [];
  for (let i = a; i <= b; i++) out.push(prefA + i);
  return out;
}

function get(url, depth) {
  depth = depth || 0;
  return new Promise(resolve => {
    if (depth > 4) return resolve({ status: 0 });
    const req = https.get(url, { headers: { 'User-Agent': UA }, timeout: 30000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(get(res.headers.location, depth + 1));
      }
      if (res.statusCode !== 200) { res.resume(); return resolve({ status: res.statusCode }); }
      const c = [];
      res.on('data', x => c.push(x));
      res.on('end', () => resolve({ status: 200, body: Buffer.concat(c) }));
    });
    req.on('timeout', () => { req.destroy(); resolve({ status: 0 }); });
    req.on('error', () => resolve({ status: 0 }));
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function grab(num) {
  const file = path.join(OUT, num + '.svg');
  if (fs.existsSync(file)) return true;
  const names = ['RU_road_sign_' + num + '.svg'];
  for (const name of names) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const r = await get('https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(name));
      if (r.status === 200 && r.body.length > 200 && r.body.slice(0, 400).toString().includes('<svg')) {
        fs.writeFileSync(file, r.body);
        return true;
      }
      if (r.status === 0) { await sleep(1200); continue; }   /* сеть подвела — ждём */
      break;                                                  /* честный 404 */
    }
  }
  return false;
}

(async () => {
  const ranges = {};
  let single = 0, fromRange = 0;

  for (const num of missing) {
    const parts = expand(num);
    if (parts) {
      const got = [];
      for (const pn of parts) {
        if (await grab(pn)) got.push(pn);
        await sleep(200);
      }
      if (got.length) { ranges[num] = got; fromRange += got.length; }
      console.log('  диапазон ' + num + ': ' + got.length + ' из ' + parts.length);
    } else {
      if (await grab(num)) single++;
      await sleep(200);
    }
  }

  fs.writeFileSync(path.join(OUT, 'ranges.json'), JSON.stringify(ranges, null, 1), 'utf8');
  console.log('\nдобрано одиночных: ' + single);
  console.log('знаков из диапазонов: ' + fromRange + ' (диапазонов раскрыто ' + Object.keys(ranges).length + ')');
})();
