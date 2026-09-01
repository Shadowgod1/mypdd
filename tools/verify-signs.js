/* Сверяет скачанные знаки с тем, чем они подписаны внутри себя.

   Ошибка, которую это ловит: я предполагал, что нумерация знаков
   Казахстана и России совпадает, и качал файл «RU road sign <номер>».
   В группах 4 и 7 нумерация расходится, и картинки встали к чужим
   номерам: под казахстанским 4.9.2 «Опасные грузы» оказался российский
   4.9 «Движение легковых автомобилей».

   Почти каждый файл с Викисклада содержит своё имя в <title> или
   <dc:title> вида «3.1 Въезд запрещён». Сверяем номер оттуда с именем
   файла. Не сходится — картинку убираем: пустое место честнее чужого
   знака.

   Запуск: node tools/verify-signs.js         (только отчёт)
           node tools/verify-signs.js --apply (удалить несовпавшие)
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'source', 'signs');
const APPLY = process.argv.includes('--apply');

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const data = JSON.parse(html.match(/const SIGNS_DATA\s*=\s*(\[[\s\S]*?\]);\n/)[1]);
const titleByNum = {};
data.forEach(s => { titleByNum[String(s.num).trim()] = String(s.title || ''); });

function embeddedTitle(svg) {
  let m = svg.match(/<dc:title>\s*(?:<[^>]*>\s*)*([^<]{3,120})/);
  if (m) return m[1].trim();
  m = svg.match(/<title[^>]*>([^<]{3,120})<\/title>/);
  if (m) return m[1].trim();
  return null;
}

const words = s => String(s).toLowerCase()
  .replace(/[^а-яёa-z0-9\s]/g, ' ').split(/\s+/)
  .filter(w => w.length > 3).map(w => w.slice(0, 6));

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.svg'));
const ok = [], numBad = [], noTitle = [], wordBad = [];

for (const f of files) {
  const num = f.slice(0, -4);
  const svg = fs.readFileSync(path.join(DIR, f), 'utf8');
  const emb = embeddedTitle(svg);

  if (!emb) { noTitle.push(num); continue; }

  const embNum = (emb.match(/^([\d]+(?:\.[\d]+)*)/) || [])[1];
  if (embNum && embNum !== num) { numBad.push({ num, emb }); continue; }

  /* номер совпал или его нет — сверим ещё и слова с нашим названием */
  const ours = titleByNum[num];
  if (ours) {
    const a = new Set(words(emb.replace(/^[\d.]+\s*/, '')));
    const b = words(ours);
    const hit = b.filter(w => a.has(w)).length;
    if (b.length && hit === 0 && a.size) { wordBad.push({ num, emb, ours }); continue; }
  }
  ok.push(num);
}

console.log('файлов всего:      ' + files.length);
console.log('подтверждено:      ' + ok.length);
console.log('чужой номер:       ' + numBad.length);
console.log('название не бьётся:' + wordBad.length);
console.log('без имени внутри:  ' + noTitle.length);

if (numBad.length) {
  console.log('\nЧУЖОЙ НОМЕР (первые 15):');
  numBad.slice(0, 15).forEach(x => console.log('  ' + x.num + '  ->  ' + x.emb));
}
if (wordBad.length) {
  console.log('\nНАЗВАНИЕ НЕ БЬЁТСЯ (первые 10):');
  wordBad.slice(0, 10).forEach(x => console.log('  ' + x.num + '  файл: ' + x.emb + '  |  у нас: ' + x.ours));
}

if (APPLY) {
  let removed = 0;
  [...numBad, ...wordBad].forEach(x => {
    const p = path.join(DIR, x.num + '.svg');
    if (fs.existsSync(p)) { fs.unlinkSync(p); removed++; }
  });
  noTitle.forEach(n => {
    const p = path.join(DIR, n + '.svg');
    if (fs.existsSync(p)) { fs.unlinkSync(p); removed++; }
  });
  console.log('\nудалено непроверяемых файлов: ' + removed);
  console.log('осталось подтверждённых: ' + ok.length);
}
