/* Рисует знаки начала и конца населённого пункта с казахстанским названием.

   На Викискладе эти знаки нарисованы с российским городом («ЛИПЕЦК»),
   и на казахстанском сайте это выглядит чужеродно. Знак простой —
   белая табличка с названием, у «конца» перечёркнутая красной чертой, —
   поэтому рисуем его сами и получаем свой файл под лицензией проекта.

   Запуск: node tools/make-locality-signs.js
*/
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'source', 'signs-ok');
const NAME = 'АСТАНА';

/* ширина буквы в этом начертании — приблизительно, но для табличек хватает */
function svg(name, crossed) {
  const padX = 26, fs2 = 58;
  const w = Math.max(300, name.length * fs2 * 0.72 + padX * 2);
  const h = 150;
  const cross = crossed
    ? '<line x1="' + (w * 0.10) + '" y1="' + (h * 0.80) + '" x2="' + (w * 0.90) + '" y2="' + (h * 0.20) + '" ' +
      'stroke="#D0342C" stroke-width="9" stroke-linecap="round"/>'
    : '';
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">\n' +
    '<title>' + (crossed ? 'Конец населенного пункта' : 'Начало населенного пункта') + '</title>\n' +
    '<rect x="3" y="3" width="' + (w - 6) + '" height="' + (h - 6) + '" rx="6" fill="#FFFFFF" stroke="#151515" stroke-width="6"/>\n' +
    '<text x="' + (w / 2) + '" y="' + (h / 2) + '" font-family="Arial, Helvetica, sans-serif" font-size="' + fs2 + '" ' +
    'font-weight="700" fill="#151515" text-anchor="middle" dominant-baseline="central" letter-spacing="2">' + name + '</text>\n' +
    cross + '\n</svg>\n';
}

const files = {
  '5.22': svg(NAME, false),
  '5.23': svg(NAME, true),
  '5.24': svg(NAME, false),
  '5.25': svg(NAME, true)
};

for (const num in files) {
  fs.writeFileSync(path.join(OUT, num + '.svg'), files[num], 'utf8');
  console.log('  нарисован ' + num + '.svg');
}
console.log('название на знаке: ' + NAME);
