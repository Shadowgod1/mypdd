/* Вторая попытка для знаков, оставшихся без изображения.
   Первый проход брал только «RU road sign <номер>.svg» и часть запросов
   потерял. Здесь: несколько вариантов имени файла, повтор при сбое
   и более щадящий темп. */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'source', 'signs');
const UA = 'JolUstazy/1.0 (educational PDD trainer; https://github.com/Shadowgod1/mypdd)';

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const data = JSON.parse(html.match(/const SIGNS_DATA\s*=\s*(\[[\s\S]*?\]);\n/)[1]);

const missing = [...new Set(
  data.filter(s => !s.img).map(s => String(s.num || '').trim())
)].filter(n => n && !/[–—-]/.test(n) && !fs.existsSync(path.join(OUT, n + '.svg')));

console.log('без изображения:', missing.length);

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

/* варианты, под которыми файл может лежать на Викискладе */
function variants(num) {
  const v = ['RU_road_sign_' + num + '.svg'];
  if (/^\d+\.\d+$/.test(num)) v.push('RU_road_sign_' + num + '.1.svg');
  if (/^\d+\.\d+\.\d+$/.test(num)) v.push('RU_road_sign_' + num.replace(/\.\d+$/, '') + '.svg');
  v.push('Russian_road_sign_' + num + '.svg');
  return v;
}

(async () => {
  let ok = 0;
  for (let i = 0; i < missing.length; i++) {
    const num = missing[i];
    let done = false;
    for (const file of variants(num)) {
      for (let attempt = 0; attempt < 2 && !done; attempt++) {
        const r = await get('https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(file));
        if (r.status === 200 && r.body.length > 200 && r.body.slice(0, 400).toString().includes('<svg')) {
          fs.writeFileSync(path.join(OUT, num + '.svg'), r.body);
          ok++; done = true;
        } else if (r.status === 0) {
          await sleep(800); /* сбой сети — подождём и повторим */
        } else {
          break; /* честный 404 — пробуем следующее имя */
        }
      }
      if (done) break;
    }
    if ((i + 1) % 25 === 0) console.log('  ' + (i + 1) + '/' + missing.length + '  добрано ' + ok);
    await sleep(220);
  }
  console.log('\nдобрано во второй попытке:', ok);
})();
