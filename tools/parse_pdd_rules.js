const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../source/pdd-rk-ru.txt');
const raw = fs.readFileSync(srcPath, 'utf8');

const lines = raw.split(/\r?\n/);

const chapters = [];
let currentChapter = null;
let currentPart = 'Правила дорожного движения';

// We want to capture:
// 1. Chapters 1-26 of Rules
// 2. Annex 1: Road Signs (Groups 1-7)
// 3. Annex 2: Road Markings (Horizontal & Vertical)
// 4. Basic Provisions for Vehicle Admission
// 5. Faults List (Chapters 1-7)

function cleanLine(l) {
  return l.replace(/^\u00A0+/g, '').trim();
}

for (let i = 0; i < lines.length; i++) {
  let line = cleanLine(lines[i]);
  if (!line) continue;

  if (line.includes('Правила дорожного движения') && i < 40) {
    currentPart = 'Правила дорожного движения';
  } else if (line.includes('Приложение 1 к Правилам')) {
    currentPart = 'Приложение 1. Дорожные знаки';
  } else if (line.includes('Приложение 2 к Правилам')) {
    currentPart = 'Приложение 2. Дорожная разметка';
  } else if (line.includes('Основные положения по допуску')) {
    currentPart = 'Основные положения по допуску ТС к эксплуатации';
  } else if (line.includes('ПЕРЕЧЕНЬ неисправностей')) {
    currentPart = 'Перечень неисправностей и условий';
  }

  // Heading check
  const isRuleChapter = (currentPart === 'Правила дорожного движения' && /^Глава\s+\d+\./i.test(line));
  const isSignChapter = (currentPart === 'Приложение 1. Дорожные знаки' && /^Глава\s+\d+\./i.test(line));
  const isMarkingChapter = (currentPart === 'Приложение 2. Дорожная разметка' && /^Глава\s+\d+\./i.test(line));
  const isFaultsChapter = (currentPart === 'Перечень неисправностей и условий' && /^Глава\s+\d+\./i.test(line));
  const isBasicMain = (currentPart === 'Основные положения по допуску ТС к эксплуатации' && line.startsWith('Основные положения'));

  if (isRuleChapter || isSignChapter || isMarkingChapter || isFaultsChapter || isBasicMain) {
    if (currentChapter) {
      chapters.push(currentChapter);
    }
    let title = line;
    currentChapter = {
      part: currentPart,
      title: title,
      id: 'ch_' + (chapters.length + 1),
      content: []
    };
    continue;
  }

  if (currentChapter) {
    // Skip empty artifacts like "Скачать" or raw empty table dumps if any
    if (line === 'Скачать') continue;
    // Don't add header labels
    if (line.startsWith('Приложение ') && line.includes('к Правилам')) continue;
    currentChapter.content.push(line);
  }
}

if (currentChapter) {
  chapters.push(currentChapter);
}

console.log(`Parsed ${chapters.length} chapters/sections.`);
chapters.forEach((c, idx) => {
  console.log(`[${idx+1}] (${c.part}) ${c.title} -> ${c.content.length} lines`);
});
