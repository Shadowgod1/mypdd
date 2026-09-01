/* Выносит изображения знаков из страницы в отдельные файлы.

   В index.html знаки лежат внутри данных как base64 — так задумано,
   чтобы один файл можно было сохранить и открыть без сервера. Но для
   сайта это плохо: 1,7 МБ грузится сразу, и base64 почти не сжимается.

   Здесь для собранной версии картинки раскладываются в docs/signs/,
   а в данных остаются короткие ссылки. Браузер подтягивает только те
   знаки, что попали на экран (в разметке стоит loading="lazy").

   Вызывается из tools/build.js, отдельно запускать не нужно.
*/
const fs = require('fs');
const path = require('path');

function splitSigns(doc, outDir) {
  const signsDir = path.join(outDir, 'signs');
  fs.mkdirSync(signsDir, { recursive: true });

  /* чистим прошлые файлы, чтобы удалённые знаки не оставались висеть */
  for (const f of fs.readdirSync(signsDir)) {
    if (f.endsWith('.svg')) fs.unlinkSync(path.join(signsDir, f));
  }

  const m = doc.match(/(const SIGNS_DATA\s*=\s*)(\[[\s\S]*?\])(;\n)/);
  if (!m) return { doc, written: 0, savedKb: 0 };

  const before = Buffer.byteLength(m[2], 'utf8');
  const data = JSON.parse(m[2]);
  let written = 0;

  for (const s of data) {
    const img = s.img || '';
    const num = String(s.num || '').trim();
    if (!num || !img.startsWith('data:image/svg+xml;base64,')) continue;

    const svg = Buffer.from(img.slice('data:image/svg+xml;base64,'.length), 'base64');
    /* имя файла безопасное: в номерах знаков бывают точки, но не слэши */
    const name = num.replace(/[^\w.\-]/g, '_') + '.svg';
    fs.writeFileSync(path.join(signsDir, name), svg);
    s.img = 'signs/' + name;
    written++;
  }

  const json = JSON.stringify(data, null, 0);
  const after = Buffer.byteLength(json, 'utf8');
  doc = doc.slice(0, m.index) + m[1] + json + m[3] + doc.slice(m.index + m[0].length);

  return { doc, written, savedKb: Math.round((before - after) / 1024) };
}

module.exports = { splitSigns };
