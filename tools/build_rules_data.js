const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../source/pdd-rk-ru.txt');
const raw = fs.readFileSync(srcPath, 'utf8');
const lines = raw.split(/\r?\n/).map(l => l.replace(/^\u00A0+/g, '').trim());

const PARTS = [
  { id: 'pdd', title: 'Правила дорожного движения', titleKk: 'Жол жүрісі қағидалары', range: [29, 690] },
  { id: 'signs', title: 'Приложение 1. Дорожные знаки', titleKk: '1-қосымша. Жол белгілері', range: [690, 1011] },
  { id: 'markings', title: 'Приложение 2. Дорожная разметка', titleKk: '2-қосымша. Жол таңбалары', range: [3549, 3836] },
  { id: 'admission', title: 'Основные положения по допуску ТС к эксплуатации', titleKk: 'Көлік құралдарын пайдалануға жіберу жөніндегі негізгі ережелер', range: [3836, 3931] },
  { id: 'faults', title: 'Перечень неисправностей и условий, запрещающих эксплуатацию', titleKk: 'Көлік құралдарын пайдалануға тыйым салынатын ақаулар тізбесі', range: [3931, lines.length] }
];

const allChapters = [];

PARTS.forEach(part => {
  const partLines = lines.slice(part.range[0], part.range[1]);
  let curChapter = null;

  for (let i = 0; i < partLines.length; i++) {
    const line = partLines[i];
    if (!line) continue;
    if (line === 'Скачать') continue;
    if (line.startsWith('Приложение ') && line.includes('к Правилам')) continue;

    // Check if line is a chapter heading
    const isHeading = line.match(/^Глава\s+\d+\./i) ||
                      (part.id === 'admission' && line.startsWith('Основные положения')) ||
                      (part.id === 'faults' && line.startsWith('ПЕРЕЧЕНЬ'));

    if (isHeading) {
      if (curChapter && curChapter.paragraphs.length > 0) {
        allChapters.push(curChapter);
      }
      curChapter = {
        id: 'ch' + (allChapters.length + 1),
        partId: part.id,
        partTitle: part.title,
        partTitleKk: part.titleKk,
        title: line,
        paragraphs: []
      };
      continue;
    }

    if (!curChapter) {
      curChapter = {
        id: 'ch' + (allChapters.length + 1),
        partId: part.id,
        partTitle: part.title,
        partTitleKk: part.titleKk,
        title: part.title,
        paragraphs: []
      };
    }

    const isFootnote = line.startsWith('Сноска.');
    // Match clause numbers like: "1.", "73.", "168-1.", "7.14", "1.1", "1)", "1) "
    const numMatch = line.match(/^(\d+(?:[-–]\d+)?(?:\.\d+)*(?:\s*[а-я])?)\.?\s+/i) || line.match(/^(\d+\))\s+/);
    let num = null;
    let text = line;

    if (numMatch && !isFootnote) {
      num = numMatch[1];
    }

    curChapter.paragraphs.push({
      text,
      isFootnote,
      num
    });
  }

  if (curChapter && curChapter.paragraphs.length > 0) {
    allChapters.push(curChapter);
  }
});

console.log(`Successfully parsed ${allChapters.length} chapters.`);
fs.writeFileSync(path.join(__dirname, '../tools/rules_data.json'), JSON.stringify(allChapters, null, 2));
