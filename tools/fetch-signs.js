/* Скачивает настоящие изображения дорожных знаков с Викисклада.
   Сейчас в каталоге на 254 знака приходится 32 картинки: каждой группе
   назначена одна общая заглушка. Это вводит в заблуждение — человек
   листает сорок одинаковых треугольников вместо разных знаков.

   Знаки Казахстана относятся к той же системе ГОСТ, что и российские,
   поэтому файлы ищутся по шаблону «RU road sign <номер>.svg».
   Чего нет на Викискладе — остаётся без картинки: пустое место честнее
   ложной.

   Вместе с файлом забирается лицензия и автор: часть знаков под
   CC BY-SA 3.0, их нельзя использовать без указания авторства.

   Запуск:  node tools/fetch-signs.js
   Итог:    source/signs/<номер>.svg  и  source/signs/index.json
*/
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'source', 'signs');
const UA = 'JolUstazy/1.0 (educational PDD trainer; https://github.com/Shadowgod1/mypdd)';

fs.mkdirSync(OUT, { recursive: true });

/* --- номера знаков берём прямо из каталога --- */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const m = html.match(/const SIGNS_DATA\s*=\s*(\[[\s\S]*?\]);\n/);
if (!m) { console.error('не найден SIGNS_DATA'); process.exit(1); }
const data = JSON.parse(m[1]);
const nums = [...new Set(data.map(s => String(s.num || '').trim()).filter(Boolean))];
console.log('знаков в каталоге:', data.length, '| уникальных номеров:', nums.length);

function get(url, asText) {
  return new Promise(resolve => {
    const req = https.get(url, { headers: { 'User-Agent': UA }, timeout: 25000 }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(get(res.headers.location, asText));
      }
      if (res.statusCode !== 200) { res.resume(); return resolve({ status: res.statusCode }); }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: 200, body: Buffer.concat(chunks) }));
    });
    req.on('timeout', () => { req.destroy(); resolve({ status: 0 }); });
    req.on('error', () => resolve({ status: 0 }));
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const index = {};
  let ok = 0, miss = 0;

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    const file = 'RU_road_sign_' + num + '.svg';
    const r = await get('https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(file), false);

    if (r.status === 200 && r.body.length > 200 && r.body.slice(0, 400).toString().includes('<svg')) {
      fs.writeFileSync(path.join(OUT, num + '.svg'), r.body);
      index[num] = { file, bytes: r.body.length };
      ok++;
    } else {
      miss++;
    }

    if ((i + 1) % 25 === 0) console.log('  ' + (i + 1) + '/' + nums.length + '  найдено ' + ok + ', нет ' + miss);
    await sleep(120); /* не долбить чужой сервер */
  }

  /* --- лицензии и авторы одним запросом на полсотни файлов --- */
  const found = Object.keys(index);
  for (let i = 0; i < found.length; i += 40) {
    const batch = found.slice(i, i + 40);
    const titles = batch.map(n => 'File:' + index[n].file).join('|');
    const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo'
      + '&iiprop=extmetadata&iiextmetadatafilter=LicenseShortName|Artist|LicenseUrl'
      + '&titles=' + encodeURIComponent(titles);
    const r = await get(api, true);
    if (r.status === 200) {
      try {
        const j = JSON.parse(r.body.toString('utf8'));
        const pages = (j.query && j.query.pages) || {};
        for (const k in pages) {
          const p = pages[k];
          const title = (p.title || '').replace(/^File:/, '');
          const num = found.find(n => index[n].file === title);
          if (!num || !p.imageinfo) continue;
          const md = p.imageinfo[0].extmetadata || {};
          const strip = s => String(s || '').replace(/<[^>]*>/g, '').trim();
          index[num].license = strip(md.LicenseShortName && md.LicenseShortName.value) || 'не указана';
          index[num].author = strip(md.Artist && md.Artist.value) || 'не указан';
        }
      } catch (e) { /* пропускаем битую пачку */ }
    }
    await sleep(300);
  }

  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2), 'utf8');

  const byLic = {};
  Object.values(index).forEach(v => { byLic[v.license || '?'] = (byLic[v.license || '?'] || 0) + 1; });
  console.log('\nИТОГ');
  console.log('  скачано:', ok, '  не найдено:', miss);
  console.log('  лицензии:');
  Object.entries(byLic).sort((a, b) => b[1] - a[1]).forEach(([l, c]) => console.log('    ' + c + '  ' + l));
})();
