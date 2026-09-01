/* Сопоставляет знаки по названию, а не по номеру.

   Нумерация знаков Казахстана и России расходится: в группе 1 сдвиг на
   два пункта, в группах 4 и 7 расхождения сильнее. Привязка файла к
   номеру дала 114 неверных картинок из 205 — под казахстанским 4.9.2
   «Опасные грузы» стоял российский 4.9 «Движение легковых автомобилей».

   Здесь используется то, что каждый файл с Викисклада подписан внутри:
   «<dc:title>3.1 Въезд запрещён». Сравниваем это название с названием
   нашего знака. Совпало уверенно — берём файл. Нет — знак остаётся без
   картинки.

   Запуск: node tools/match-signs.js [--apply]
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'source', 'signs');
const OUTDIR = path.join(ROOT, 'source', 'signs-ok');
const APPLY = process.argv.includes('--apply');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const data = JSON.parse(html.match(/const SIGNS_DATA\s*=\s*(\[[\s\S]*?\]);\n/)[1]);

function embeddedTitle(svg) {
  let m = svg.match(/<dc:title>\s*(?:<[^>]*>\s*)*([^<]{3,140})/);
  if (m) return m[1].trim();
  m = svg.match(/<title[^>]*>([^<]{3,140})<\/title>/);
  if (m) return m[1].trim();
  return null;
}

/* нормализация: убираем номер, приводим к основам слов */
/* «без» и «со» отбрасывать нельзя: именно они отличают «переезд со
   шлагбаумом» от «переезда без шлагбаума». Отбрасываем только слова,
   которые смысла не меняют. */
const STOP = new Set(['для', 'или', 'при', 'над', 'под']);
function norm(s) {
  return String(s || '')
    .replace(/^[\d.]+\s*/, '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^а-яa-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2 && !STOP.has(w))
    .map(w => w.slice(0, 5));
}

/* индекс файлов по их собственному названию */
const files = [];
for (const f of fs.readdirSync(DIR).filter(x => x.endsWith('.svg'))) {
  const svg = fs.readFileSync(path.join(DIR, f), 'utf8');
  const emb = embeddedTitle(svg);
  if (!emb) continue;
  files.push({ file: f, title: emb, tok: norm(emb) });
}
console.log('файлов с подписью внутри: ' + files.length);

/* оценка совпадения: доля слов нашего названия, найденных в названии файла */
/* Совпадением считаем только полное равенство наборов слов.
   Частичное совпадение опасно: «переезд со шлагбаумом» и «переезд без
   шлагбаума» отличаются одним словом, а картинки у них разные. */
function score(ourTok, fileTok) {
  const a = new Set(ourTok), b = new Set(fileTok);
  if (!a.size || !b.size) return 0;
  if (a.size !== b.size) return 0;
  for (const w of a) if (!b.has(w)) return 0;
  return 1;
}

const matched = {};
const report = [];
let strong = 0;

for (const s of data) {
  const num = String(s.num || '').trim();
  const our = norm(s.title);
  if (!num || !our.length) continue;

  let best = null, bestScore = 0;
  for (const f of files) {
    const sc = score(our, f.tok);
    if (sc > bestScore) { bestScore = sc; best = f; }
  }
  if (best && bestScore >= 1) {
    matched[num] = best.file;
    strong++;
    report.push('  ' + num.padEnd(10) + ' <- ' + best.title);
  }
}

console.log('уверенно сопоставлено: ' + strong + ' из ' + data.length);
console.log('\nПРИМЕРЫ:');
report.slice(0, 12).forEach(r => console.log(r));

if (APPLY) {
  fs.rmSync(OUTDIR, { recursive: true, force: true });
  fs.mkdirSync(OUTDIR, { recursive: true });
  for (const num in matched) {
    fs.copyFileSync(path.join(DIR, matched[num]), path.join(OUTDIR, num + '.svg'));
  }
  fs.writeFileSync(path.join(OUTDIR, 'match.json'), JSON.stringify(matched, null, 1), 'utf8');
  console.log('\nзаписано в source/signs-ok: ' + Object.keys(matched).length + ' файлов');
}
