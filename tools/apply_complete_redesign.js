const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Fix the "Тесты" icon in Header
const badIcon = '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>';
const testChecklistIcon = '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>';

html = html.replace(badIcon, testChecklistIcon);
html = html.replace(badIcon, testChecklistIcon);

// 2. Add SVG generators and card figure styles
const svgStyles = `
/* Иллюстрации в карточках знаков и разметки */
.sign-figure{
  display:flex;align-items:center;justify-content:center;
  background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:16px;min-height:88px;margin-bottom:4px;
}
.sign-figure svg{filter:drop-shadow(0 2px 4px rgba(0,0,0,.25))}
.mark-figure{
  display:flex;align-items:center;justify-content:center;
  background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:14px;min-height:72px;margin-bottom:4px;
}
.mark-figure svg{border-radius:4px;overflow:hidden}

/* Компактный справочный блок на главной справа */
.home-hub-list{display:grid;gap:12px}
.home-hub-item{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:16px 18px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:14px;
  transition:border-color .18s,background .18s;
}
.home-hub-item:hover{border-color:var(--accent);background:var(--surface-2)}
.home-hub-item-left{display:flex;align-items:center;gap:12px}
.home-hub-item-icon{
  width:36px;height:36px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid var(--line);
  color:var(--accent);display:flex;align-items:center;justify-content:center;flex:0 0 auto;
}
.home-hub-item-icon svg{width:18px;height:18px}
.home-hub-item-title{font-family:var(--serif);font-size:16px;font-weight:600;letter-spacing:-.01em;color:var(--ink);margin:0}
.home-hub-item-desc{font-family:var(--sans);font-size:13px;color:var(--ink-2);margin:2px 0 0}
.home-hub-item-arrow{font-family:var(--mono);font-size:14px;color:var(--ink-3)}
`;

if (!html.includes('.sign-figure')) {
  html = html.replace('</style>', svgStyles + '\n</style>');
}

// 3. Inject Sign and Marking SVG functions
const svgGenerators = `
function getSignGraphic(num, title, group){
  num = (num || '').trim();
  group = (group || '').trim();

  // 2.1 Главная дорога
  if(num === '2.1'){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="10" y="10" width="40" height="40" rx="3" transform="rotate(45 30 30)" fill="#FFD54F" stroke="#FFFFFF" stroke-width="4"/><rect x="16" y="16" width="28" height="28" rx="2" transform="rotate(45 30 30)" fill="#FFD54F" stroke="#1A1A1A" stroke-width="1.5"/></svg>';
  }
  // 2.2 Конец главной дороги
  if(num === '2.2'){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="10" y="10" width="40" height="40" rx="3" transform="rotate(45 30 30)" fill="#E0E0E0" stroke="#FFFFFF" stroke-width="4"/><line x1="12" y1="12" x2="48" y2="48" stroke="#1A1A1A" stroke-width="4"/></svg>';
  }
  // 2.4 Уступите дорогу
  if(num === '2.4'){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><polygon points="30,52 6,10 54,10" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/></svg>';
  }
  // 2.5 STOP
  if(num === '2.5'){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><polygon points="19,6 41,6 54,19 54,41 41,54 19,54 6,41 6,19" fill="#D83025" stroke="#FFFFFF" stroke-width="2"/><text x="30" y="36" fill="#FFFFFF" font-family="Source Sans 3, sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">STOP</text></svg>';
  }
  // 3.1 Въезд запрещен ("Кирпич")
  if(num === '3.1'){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><circle cx="30" cy="30" r="26" fill="#D83025"/><rect x="14" y="25" width="32" height="10" rx="1.5" fill="#FFFFFF"/></svg>';
  }
  // 3.27 Остановка запрещена
  if(num === '3.27'){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><circle cx="30" cy="30" r="26" fill="#1565C0" stroke="#D83025" stroke-width="6"/><line x1="12" y1="12" x2="48" y2="48" stroke="#D83025" stroke-width="5"/><line x1="48" y1="12" x2="12" y2="48" stroke="#D83025" stroke-width="5"/></svg>';
  }
  // 3.28 Стоянка запрещена
  if(num === '3.28'){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><circle cx="30" cy="30" r="26" fill="#1565C0" stroke="#D83025" stroke-width="6"/><line x1="48" y1="12" x2="12" y2="48" stroke="#D83025" stroke-width="5"/></svg>';
  }
  // 3.24 Скорость
  if(num.startsWith('3.24')){
    const sp = num.split('(')[1] ? num.split('(')[1].replace(')', '') : '50';
    return '<svg viewBox="0 0 60 60" width="54" height="54"><circle cx="30" cy="30" r="26" fill="#FFFFFF" stroke="#D83025" stroke-width="6"/><text x="30" y="38" fill="#1A1A1A" font-family="Source Sans 3, sans-serif" font-size="18" font-weight="900" text-anchor="middle">'+(sp||'50')+'</text></svg>';
  }
  // 5.1 Автомагистраль
  if(num === '5.1'){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="6" y="6" width="48" height="48" rx="4" fill="#2E7D32"/><line x1="20" y1="48" x2="20" y2="12" stroke="#FFFFFF" stroke-width="3"/><line x1="40" y1="48" x2="40" y2="12" stroke="#FFFFFF" stroke-width="3"/><rect x="14" y="24" width="32" height="5" fill="#FFFFFF"/><line x1="14" y1="36" x2="46" y2="36" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="3 3"/></svg>';
  }
  // 5.16.1 / 5.16.2 Пешеходный переход
  if(num.startsWith('5.16')){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="6" y="6" width="48" height="48" rx="4" fill="#1565C0"/><polygon points="30,12 48,46 12,46" fill="#FFFFFF"/><line x1="18" y1="42" x2="42" y2="42" stroke="#1565C0" stroke-width="2"/><circle cx="30" cy="22" r="3.5" fill="#1565C0"/><path d="M30 25 L30 35 L35 43 M30 31 L24 37" stroke="#1565C0" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>';
  }
  // 5.5 Одностороннее движение
  if(num === '5.5'){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="6" y="6" width="48" height="48" rx="4" fill="#1565C0"/><line x1="30" y1="46" x2="30" y2="16" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/><polygon points="30,10 20,24 40,24" fill="#FFFFFF"/></svg>';
  }

  // 1.x Предупреждающие (красный треугольник)
  if(group === '1' || num.startsWith('1.')){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><polygon points="30,8 54,50 6,50" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/><circle cx="30" cy="38" r="3" fill="#1A1A1A"/><rect x="28" y="24" width="4" height="10" rx="1" fill="#1A1A1A"/></svg>';
  }
  // 2.x Приоритет
  if(group === '2' || num.startsWith('2.')){
    if(num.startsWith('2.3')){
      return '<svg viewBox="0 0 60 60" width="54" height="54"><polygon points="30,8 54,50 6,50" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/><line x1="30" y1="46" x2="30" y2="18" stroke="#1A1A1A" stroke-width="4"/><line x1="20" y1="32" x2="40" y2="32" stroke="#1A1A1A" stroke-width="2.5"/></svg>';
    }
    return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="10" y="10" width="40" height="40" rx="3" transform="rotate(45 30 30)" fill="#FFD54F" stroke="#FFFFFF" stroke-width="4"/></svg>';
  }
  // 3.x Запрещающие (красный круг)
  if(group === '3' || num.startsWith('3.')){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><circle cx="30" cy="30" r="26" fill="#FFFFFF" stroke="#D83025" stroke-width="6"/><line x1="12" y1="48" x2="48" y2="12" stroke="#D83025" stroke-width="4"/><circle cx="30" cy="30" r="8" fill="none" stroke="#1A1A1A" stroke-width="2"/></svg>';
  }
  // 4.x Предписывающие (синий круг)
  if(group === '4' || num.startsWith('4.')){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><circle cx="30" cy="30" r="26" fill="#1565C0"/><line x1="30" y1="44" x2="30" y2="18" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/><polygon points="30,12 22,24 38,24" fill="#FFFFFF"/></svg>';
  }
  // 5.x Информационные (синий квадрат)
  if(group === '5' || num.startsWith('5.')){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="6" y="6" width="48" height="48" rx="4" fill="#1565C0"/><rect x="14" y="14" width="32" height="32" rx="2" fill="none" stroke="#FFFFFF" stroke-width="2"/><text x="30" y="34" fill="#FFFFFF" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="600" text-anchor="middle">'+num.slice(0,4)+'</text></svg>';
  }
  // 6.x Сервис (синий прямоугольник)
  if(group === '6' || num.startsWith('6.')){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="8" y="4" width="44" height="52" rx="4" fill="#1565C0"/><rect x="14" y="10" width="32" height="32" rx="2" fill="#FFFFFF"/><rect x="24" y="20" width="12" height="12" rx="1" fill="#D83025"/></svg>';
  }
  // 7.x Таблички (белый прямоугольник)
  if(group === '7' || num.startsWith('7.')){
    return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="4" y="14" width="52" height="32" rx="3" fill="#FFFFFF" stroke="#1A1A1A" stroke-width="2"/><text x="30" y="34" fill="#1A1A1A" font-family="IBM Plex Mono, monospace" font-size="11" font-weight="600" text-anchor="middle">'+num+'</text></svg>';
  }
  // 8.x Опознавательные знаки
  if(group === '8' || num.startsWith('ОЗ')){
    if(num === 'ОЗ-2'){
      return '<svg viewBox="0 0 60 60" width="54" height="54"><polygon points="30,8 54,50 6,50" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/><text x="30" y="44" fill="#1A1A1A" font-family="Source Sans 3, sans-serif" font-size="22" font-weight="900" text-anchor="middle">Ш</text></svg>';
    }
    if(num === 'ОЗ-5'){
      return '<svg viewBox="0 0 60 60" width="54" height="54"><polygon points="30,8 54,50 6,50" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/><text x="30" y="44" fill="#1A1A1A" font-family="Source Sans 3, sans-serif" font-size="22" font-weight="900" text-anchor="middle">У</text></svg>';
    }
    if(num === 'ОЗ-10' || num === 'ОЗ-4'){
      return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="8" y="8" width="44" height="44" rx="4" fill="#FFD54F" stroke="#1A1A1A" stroke-width="2"/><circle cx="30" cy="22" r="4" fill="#1A1A1A"/><circle cx="20" cy="36" r="4" fill="#1A1A1A"/><circle cx="40" cy="36" r="4" fill="#1A1A1A"/></svg>';
    }
    return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="8" y="8" width="44" height="44" rx="4" fill="#FFD54F" stroke="#D83025" stroke-width="3"/><text x="30" y="34" fill="#1A1A1A" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="700" text-anchor="middle">'+num+'</text></svg>';
  }

  return '<svg viewBox="0 0 60 60" width="54" height="54"><rect x="8" y="8" width="44" height="44" rx="6" fill="#1565C0"/><text x="30" y="35" fill="#FFFFFF" font-family="IBM Plex Mono, monospace" font-size="12" font-weight="600" text-anchor="middle">'+num+'</text></svg>';
}

function getMarkingGraphic(num, group){
  num = (num || '').trim();
  group = (group || '').trim();

  // Вертикальная разметка (2.1–2.7)
  if(group === 'v' || num.startsWith('2.')){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><polygon points="0,0 20,0 0,48" fill="#FFFFFF"/><polygon points="25,0 45,0 5,48" fill="#FFFFFF"/><polygon points="50,0 70,0 30,48" fill="#FFFFFF"/><polygon points="75,0 95,0 55,48" fill="#FFFFFF"/><polygon points="100,0 100,20 80,48 100,48" fill="#FFFFFF"/></svg>';
  }

  // 1.1 Сплошная
  if(num === '1.1'){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="24" x2="100" y2="24" stroke="#FFFFFF" stroke-width="4"/></svg>';
  }
  // 1.3 Двойная сплошная
  if(num === '1.3'){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="20" x2="100" y2="20" stroke="#FFFFFF" stroke-width="3"/><line x1="0" y1="28" x2="100" y2="28" stroke="#FFFFFF" stroke-width="3"/></svg>';
  }
  // 1.4 Желтая сплошная
  if(num === '1.4'){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="8" x2="100" y2="8" stroke="#FFD54F" stroke-width="5"/></svg>';
  }
  // 1.5 Прерывистая
  if(num === '1.5'){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="24" x2="100" y2="24" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="10 16"/></svg>';
  }
  // 1.6 Линия приближения
  if(num === '1.6'){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="24" x2="100" y2="24" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="20 6"/></svg>';
  }
  // 1.10 Желтая прерывистая
  if(num === '1.10'){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="8" x2="100" y2="8" stroke="#FFD54F" stroke-width="5" stroke-dasharray="16 10"/></svg>';
  }
  // 1.11 Сплошная с прерывистой
  if(num === '1.11'){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="20" x2="100" y2="20" stroke="#FFFFFF" stroke-width="3"/><line x1="0" y1="28" x2="100" y2="28" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="12 8"/></svg>';
  }
  // 1.12 Стоп-линия
  if(num === '1.12'){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="28" y1="0" x2="28" y2="48" stroke="#FFFFFF" stroke-width="8"/><text x="65" y="28" fill="#FFFFFF" font-family="Source Sans 3, sans-serif" font-size="10" font-weight="700">STOP</text></svg>';
  }
  // 1.14 Зебра
  if(num.startsWith('1.14')){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="15" y1="0" x2="15" y2="48" stroke="#FFFFFF" stroke-width="6"/><line x1="30" y1="0" x2="30" y2="48" stroke="#FFFFFF" stroke-width="6"/><line x1="45" y1="0" x2="45" y2="48" stroke="#FFFFFF" stroke-width="6"/><line x1="60" y1="0" x2="60" y2="48" stroke="#FFFFFF" stroke-width="6"/><line x1="75" y1="0" x2="75" y2="48" stroke="#FFFFFF" stroke-width="6"/><line x1="90" y1="0" x2="90" y2="48" stroke="#FFFFFF" stroke-width="6"/></svg>';
  }
  // 1.17 Зигзаг
  if(num === '1.17'){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><path d="M5 8 L20 38 L35 8 L50 38 L65 8 L80 38 L95 8" stroke="#FFD54F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
  }
  // 1.23 Выделенная полоса А
  if(num === '1.23'){
    return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><text x="50" y="34" fill="#FFFFFF" font-family="Source Serif 4, Georgia, serif" font-size="26" font-weight="700" text-anchor="middle">А</text></svg>';
  }

  // Generic
  return '<svg viewBox="0 0 100 48" width="80" height="40"><rect width="100" height="48" rx="4" fill="#1E2A22"/><line x1="0" y1="24" x2="100" y2="24" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="14 10"/></svg>';
}
`;

if (!html.includes('function getSignGraphic')) {
  html = html.replace('let SIGNS_STATE =', svgGenerators + '\nlet SIGNS_STATE =');
}

// 4. Update screenSigns to include the visual sign graphics
const updatedScreenSigns = `
  const cardsHtml = items.length ? items.map(s =>
    '<div class="sign-card">'+
      '<div class="sign-figure">'+getSignGraphic(s.num, s.title, s.group)+'</div>'+
      '<div class="sign-card-head">'+
        '<span class="sign-num-badge">'+esc(s.num)+'</span>'+
        '<span class="sign-cat-badge">'+esc(LANG==='kk'?s.groupTitleKk:s.groupTitle)+'</span>'+
      '</div>'+
      '<h3 class="sign-card-title">'+highlightMatches(s.title, SIGNS_STATE.q)+'</h3>'+
      '<p class="sign-card-desc">'+highlightMatches(s.desc, SIGNS_STATE.q)+'</p>'+
    '</div>'
  ).join('') : '<div class="rules-search-stat" style="grid-column:1/-1">'+t('signsEmpty', esc(SIGNS_STATE.q))+'</div>';
`;

html = html.replace(/const cardsHtml = items\.length \? items\.map\(s =>[\s\S]*?t\('signsEmpty', esc\(SIGNS_STATE\.q\)\)\+'<\/div>';/, updatedScreenSigns.trim());

// 5. Update screenMarkings to include the visual marking graphics
const updatedScreenMarkings = `
  const cardsHtml = items.length ? items.map(m =>
    '<div class="sign-card">'+
      '<div class="mark-figure">'+getMarkingGraphic(m.num, m.group)+'</div>'+
      '<div class="sign-card-head">'+
        '<span class="sign-num-badge">'+esc(m.num)+'</span>'+
        '<span class="sign-cat-badge">'+esc(LANG==='kk'?m.groupTitleKk:m.groupTitle)+'</span>'+
      '</div>'+
      '<h3 class="sign-card-title">'+highlightMatches(LANG==='kk'?m.titleKk:m.title, MARKINGS_STATE.q)+'</h3>'+
      '<p class="sign-card-desc">'+highlightMatches(m.desc, MARKINGS_STATE.q)+'</p>'+
    '</div>'
  ).join('') : '<div class="rules-search-stat" style="grid-column:1/-1">'+t('signsEmpty', esc(MARKINGS_STATE.q))+'</div>';
`;

html = html.replace(/const cardsHtml = items\.length \? items\.map\(m =>[\s\S]*?t\('signsEmpty', esc\(MARKINGS_STATE\.q\)\)\+'<\/div>';/, updatedScreenMarkings.trim());

// 6. Update screenHome to have a balanced, editorial 2-column structure:
// Left: Hero + Primary Test Modes + 12 Topics Grid
// Right: Exam Readiness + Fines/Signs/Rules/PMP Quick Hub + Priority Cheat Signs + History
const hubSvgRules = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
const hubSvgSigns = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="12 2 2 22 22 22"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
const hubSvgMarkings = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
const hubSvgFines = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20"/></svg>';
const hubSvgPmp = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M2 12h20"/></svg>';

const rightHubList = `
      <h2 class="sec-h">\${t('hubTitle')}</h2>
      <div class="home-hub-list">
        <div class="home-hub-item" data-hub="rules">
          <div class="home-hub-item-left">
            <div class="home-hub-item-icon">${hubSvgRules}</div>
            <div>
              <h3 class="home-hub-item-title">\${t('hubRules')}</h3>
              <p class="home-hub-item-desc">\${t('hubRulesD')}</p>
            </div>
          </div>
          <span class="home-hub-item-arrow">→</span>
        </div>
        <div class="home-hub-item" data-hub="signs">
          <div class="home-hub-item-left">
            <div class="home-hub-item-icon">${hubSvgSigns}</div>
            <div>
              <h3 class="home-hub-item-title">\${t('hubSigns')}</h3>
              <p class="home-hub-item-desc">\${t('hubSignsD')}</p>
            </div>
          </div>
          <span class="home-hub-item-arrow">→</span>
        </div>
        <div class="home-hub-item" data-hub="markings">
          <div class="home-hub-item-left">
            <div class="home-hub-item-icon">${hubSvgMarkings}</div>
            <div>
              <h3 class="home-hub-item-title">\${t('hubMarkings')}</h3>
              <p class="home-hub-item-desc">\${t('hubMarkingsD')}</p>
            </div>
          </div>
          <span class="home-hub-item-arrow">→</span>
        </div>
        <div class="home-hub-item" data-hub="fines">
          <div class="home-hub-item-left">
            <div class="home-hub-item-icon">${hubSvgFines}</div>
            <div>
              <h3 class="home-hub-item-title">\${t('hubFines')}</h3>
              <p class="home-hub-item-desc">\${t('hubFinesD')}</p>
            </div>
          </div>
          <span class="home-hub-item-arrow">→</span>
        </div>
        <div class="home-hub-item" data-hub="pmp">
          <div class="home-hub-item-left">
            <div class="home-hub-item-icon">${hubSvgPmp}</div>
            <div>
              <h3 class="home-hub-item-title">\${t('hubPmp')}</h3>
              <p class="home-hub-item-desc">\${t('hubPmpD')}</p>
            </div>
          </div>
          <span class="home-hub-item-arrow">→</span>
        </div>
      </div>
`;

// Replace full screenHome implementation with clean editorial structure
const fullScreenHome = `
function screenHome(){
  S = null; stopTimer(); barSlot.innerHTML = '';
  const errCount = DB.getErrCount();
  const total = Q.length;
  const ready = DB.getReadiness();

  const icExam = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
  const icMar = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
  const icErr = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  const topicCards = TOPICS.map((top, idx) => {
    const num = idx + 1;
    const cnt = Q.filter(q => q.t === top.id).length;
    const answered = DB.getTopicScore(top.id);
    const scoreText = answered > 0 ? t('score', answered, cnt) : t('notStarted');
    return '<button class="topic" data-t="'+top.id+'">'+
      '<span class="tn">'+num+'</span>'+
      '<div>'+
        '<b>'+esc(LANG==='kk'?top.nk:top.n)+'</b>'+
        '<span class="sub">'+cnt+' '+plural(cnt, ['вопрос','вопроса','вопросов'])+' · '+scoreText+'</span>'+
      '</div>'+
    '</button>';
  }).join('');

  const cheatSvg = '<svg width="44" height="44" viewBox="0 0 60 60"><rect x="10" y="10" width="40" height="40" rx="3" transform="rotate(45 30 30)" fill="#FFD54F" stroke="#FFFFFF" stroke-width="4"/><rect x="16" y="16" width="28" height="28" rx="2" transform="rotate(45 30 30)" fill="#FFD54F" stroke="#1A1A1A" stroke-width="1.5"/></svg>' +
    '<svg width="44" height="44" viewBox="0 0 60 60"><polygon points="30,52 6,10 54,10" fill="#FFFFFF" stroke="#D83025" stroke-width="6" stroke-linejoin="round"/></svg>' +
    '<svg width="44" height="44" viewBox="0 0 60 60"><polygon points="19,6 41,6 54,19 54,41 41,54 19,54 6,41 6,19" fill="#D83025" stroke="#FFFFFF" stroke-width="2"/><text x="30" y="36" fill="#FFFFFF" font-family="Source Sans 3, sans-serif" font-size="13" font-weight="900" text-anchor="middle" letter-spacing="1">STOP</text></svg>';

  app.innerHTML =
    renderMobileNav('tests') +
    '<section class="hero">'+
      '<div class="eyebrow">'+t('heroEyebrow')+'</div>'+
      '<h1>'+t('heroTitle')+'</h1>'+
      '<p>'+t('heroSub')+'</p>'+
    '</section>'+
    '<div class="home-grid">'+
      '<div class="home-a">'+
        '<h2 class="sec-h" style="margin-top:0">'+t('modesH')+'</h2>'+
        '<div class="modes">'+
          modeCard('primary', icExam, t('mExam'), t('mExamD', EXAM_N, EXAM_TIME_MIN, EXAM_MAX_ERR), 'data-go="exam"')+
          modeCard('', icMar, t('mMar'), t('mMarD', total, plural(total,['вопрос','вопроса','вопросов'])), 'data-go="marathon"')+
          (errCount > 0 ?
            modeCard('', icErr, t('mErr'), t('mErrD', errCount, plural(errCount,['ошибка','ошибки','ошибок'])), 'data-go="errors"') :
            modeCard('', icErr, t('mErr'), t('mErrEmpty'), 'disabled'))+
        '</div>'+
        '<h2 class="sec-h">'+t('topicsH')+'</h2>'+
        '<div class="topics">'+topicCards+'</div>'+
      '</div>'+
      '<div class="home-b">'+
        '<h2 class="sec-h" style="margin-top:0">'+t('readyH')+'</h2>'+
        '<div class="ready">'+
          '<div class="ready-head">'+
            ringMini(ready.pct)+
            '<div>'+
              '<div class="ready-t">'+ready.verdict+'</div>'+
              '<div class="ready-d">'+ready.detail+'</div>'+
            '</div>'+
          '</div>'+
          '<div class="stats">'+
            statBox(ready.solved, t('statPassed'), total)+
            statBox(ready.mastered, t('statMastered'), total)+
            statBox(errCount, t('statErrors'), total)+
          '</div>'+
        '</div>'+
        '${rightHubList.trim()}'+
        '<h2 class="sec-h">'+t('cheatH')+'</h2>'+
        '<div class="cheat">'+
          '<div class="cheat-signs">'+cheatSvg+'</div>'+
          '<p class="cheat-t">'+t('cheatP1')+'</p>'+
        '</div>'+
        '<div class="cheat">'+
          '<p class="cheat-t" style="margin:0">'+t('cheatP2')+'</p>'+
        '</div>'+
        '<h2 class="sec-h">'+t('historyH')+'</h2>'+
        examHistoryList()+
      '</div>'+
    '</div>';

  hookMobileNav();
  app.querySelectorAll('[data-go]').forEach(b => {
    b.onclick = () => start(b.dataset.go);
  });
  app.querySelectorAll('[data-t]').forEach(b => {
    b.onclick = () => start('topic', b.dataset.t);
  });
  app.querySelectorAll('[data-hub]').forEach(c => {
    c.onclick = () => {
      const h = c.dataset.hub;
      if(h === 'rules') screenRules('ch1', '');
      else if(h === 'signs') screenSigns('all', '');
      else if(h === 'markings') screenMarkings('all', '');
      else if(h === 'fines') screenFines('all', '');
      else if(h === 'pmp') screenPmp();
      window.scrollTo({top:0,behavior:'smooth'});
    };
  });
}
`;

// Replace function screenHome in indexContent
html = html.replace(/function screenHome\(\)\{[\s\S]*?\n\}\n(?=function screenQuiz)/, fullScreenHome.trim() + '\n\n');

fs.writeFileSync(indexPath, html);
console.log('Successfully applied complete visual and functional redesign to index.html!');
