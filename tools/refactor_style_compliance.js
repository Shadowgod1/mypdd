const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Replace categories in JS without emojis
html = html.replace("{ id: 'speed', title: '⚡ Скорость (ст. 592)', titleKk: '⚡ Жылдамдық (592-бап)' }", "{ id: 'speed', title: 'Скорость (ст. 592)', titleKk: 'Жылдамдық (592-бап)' }");
html = html.replace("{ id: 'lights', title: '🚦 Красный свет (ст. 599)', titleKk: '🚦 Бағдаршам (599-бап)' }", "{ id: 'lights', title: 'Красный свет (ст. 599)', titleKk: 'Бағдаршам (599-бап)' }");
html = html.replace("{ id: 'distract', title: '📱 Ремень и телефон (ст. 591, 593)', titleKk: '📱 Белдік пен телефон (591, 593)' }", "{ id: 'distract', title: 'Ремень и телефон (ст. 591, 593)', titleKk: 'Белдік пен телефон (591, 593)' }");
html = html.replace("{ id: 'lane', title: '↔️ Встречка и рядность (ст. 595, 596)', titleKk: '↔️ Қарсы бағыт (595, 596)' }", "{ id: 'lane', title: 'Встречная полоса (ст. 595, 596)', titleKk: 'Қарсы бағыт (595, 596)' }");
html = html.replace("{ id: 'parking', title: '🅿️ Парковка и стоянка (ст. 597)', titleKk: '🅿️ Тұрақ пен тоқтау (597-бап)' }", "{ id: 'parking', title: 'Парковка и стоянка (ст. 597)', titleKk: 'Тұрақ пен тоқтау (597-бап)' }");
html = html.replace("{ id: 'peds', title: '🚶 Пешеходы и самокаты (ст. 600, 615)', titleKk: '🚶 Жаяулар мен самокаттар' }", "{ id: 'peds', title: 'Пешеходы и самокаты (ст. 600, 615)', titleKk: 'Жаяулар мен самокаттар' }");
html = html.replace("{ id: 'emergency', title: '🚑 Спецтранспорт и аварии (ст. 598, 606)', titleKk: '🚑 Жедел қызметтер мен апат' }", "{ id: 'emergency', title: 'Спецтранспорт (ст. 598, 606)', titleKk: 'Жедел қызметтер мен апат' }");
html = html.replace("{ id: 'docs', title: '📄 Документы и номера (ст. 590, 612)', titleKk: '📄 Құжаттар мен нөмірлер' }", "{ id: 'docs', title: 'Документы и номера (ст. 590, 612)', titleKk: 'Құжаттар мен нөмірлер' }");
html = html.replace("{ id: 'alcohol', title: '🚫 Опьянение (ст. 608, 613)', titleKk: '🚫 Масаң күй (608, 613-баптар)' }", "{ id: 'alcohol', title: 'Опьянение (ст. 608, 613)', titleKk: 'Масаң күй (608, 613-баптар)' }");
html = html.replace("{ id: 'accident', title: '💥 ДТП (ст. 610, 611)', titleKk: '💥 ЖКО (610, 611-баптар)' }", "{ id: 'accident', title: 'ДТП (ст. 610, 611)', titleKk: 'ЖКО (610, 611-баптар)' }");

// 2. Refactor CSS styles to strictly obey STYLE.md tokens, spacing, fonts, and hover rules
const strictStyles = `
/* ============================================================
   ПОРТАЛ: РАЗДЕЛЫ И НАВИГАЦИЯ (по регламенту STYLE.md)
   ============================================================ */
.nav-links{display:flex;gap:8px;align-items:center}
.nav-link{
  background:none;border:1px solid transparent;color:var(--ink-2);padding:8px 12px;border-radius:var(--r-sm);
  font-family:var(--sans);font-size:14.5px;font-weight:500;cursor:pointer;
  display:inline-flex;align-items:center;gap:6px;transition:background .18s,border-color .18s,color .18s;text-decoration:none;
}
.nav-link.active{background:var(--surface-2);border-color:var(--line);color:var(--accent);font-weight:600}

@media (hover:hover){
  .nav-link:hover{background:var(--surface-2);color:var(--ink);border-color:var(--line)}
}
@media (max-width:960px){
  .nav-links{display:none}
}

/* Мобильная панель навигации */
.mobile-nav-bar{
  display:none;background:var(--surface);border-bottom:1px solid var(--line);
  padding:8px 18px;overflow-x:auto;scrollbar-width:none;white-space:nowrap;
  position:sticky;top:54px;z-index:90;-webkit-overflow-scrolling:touch;gap:8px;
}
.mobile-nav-bar::-webkit-scrollbar{display:none}
.mobile-nav-pill{
  display:inline-flex;align-items:center;padding:8px 14px;border-radius:var(--r-sm);
  background:var(--surface-2);color:var(--ink-2);border:1px solid var(--line);
  font-family:var(--sans);font-size:13.5px;font-weight:500;cursor:pointer;flex:0 0 auto;
}
.mobile-nav-pill.active{background:var(--accent-deep);color:var(--on-accent);border-color:var(--accent-deep);font-weight:600}

@media (max-width:960px){
  .mobile-nav-bar{display:flex}
}

/* Витрина разделов (Portal Hub) */
.portal-hub{margin-top:44px}
.portal-hub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin-top:18px}
.hub-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:24px;cursor:pointer;transition:border-color .18s,transform .18s;
  display:flex;flex-direction:column;gap:12px;
}
.hub-card-head{display:flex;align-items:center;gap:12px}
.hub-card-icon{
  width:40px;height:40px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid var(--line);
  color:var(--accent);display:flex;align-items:center;justify-content:center;flex:0 0 auto;
}
.hub-card-icon svg{width:20px;height:20px}
.hub-card-title{font-family:var(--serif);font-size:19px;font-weight:600;letter-spacing:-.012em;color:var(--ink);margin:0;line-height:1.25}
.hub-card-desc{font-family:var(--sans);font-size:14.5px;line-height:1.62;color:var(--ink-2);margin:0}
.hub-card-foot{margin-top:auto;padding-top:12px;border-top:1px solid var(--line);font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3)}

@media (hover:hover){
  .hub-card:hover{border-color:var(--accent);box-shadow:var(--shadow)}
}
@media (hover:none){
  .hub-card:active{transform:scale(.994)}
}

/* Фильтры и вкладки разделов */
.p-filter-bar{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:12px;margin:24px 0 24px;-webkit-overflow-scrolling:touch}
.p-filter-bar::-webkit-scrollbar{display:none}
.p-filter-chip{
  flex:0 0 auto;padding:8px 16px;border-radius:var(--r-sm);background:var(--surface);
  border:1px solid var(--line);color:var(--ink-2);font-family:var(--sans);font-size:14px;font-weight:500;cursor:pointer;
  transition:background .18s,border-color .18s,color .18s;
}
.p-filter-chip.active{background:var(--accent-deep);color:var(--on-accent);border-color:var(--accent-deep);font-weight:600}

@media (hover:hover){
  .p-filter-chip:hover{background:var(--surface-2);color:var(--ink);border-color:var(--line-2)}
}

/* Сетка карточек знаков и разметки */
.signs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;margin-top:18px}
.sign-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:24px;display:flex;flex-direction:column;gap:12px;transition:border-color .18s;
}
.sign-card-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.sign-num-badge{
  font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:500;
  background:var(--surface-2);border:1px solid var(--line);padding:3px 8px;border-radius:var(--r-sm);color:var(--accent);
}
.sign-cat-badge{font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3)}
.sign-card-title{font-family:var(--serif);font-size:18px;font-weight:600;letter-spacing:-.012em;color:var(--ink);margin:0;line-height:1.3}
.sign-card-desc{font-family:var(--sans);font-size:14.5px;line-height:1.62;color:var(--ink-2);margin:0}

@media (hover:hover){
  .sign-card:hover{border-color:var(--line-2)}
}

/* Таблица штрафов */
.fines-info-banner{
  background:var(--surface);border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:var(--r-sm);
  padding:18px 24px;margin-bottom:24px;font-family:var(--sans);font-size:15px;line-height:1.62;color:var(--ink-2);
  display:flex;align-items:center;gap:14px;
}
.fines-info-banner svg{width:22px;height:22px;flex:0 0 auto;color:var(--accent)}

.fines-grid{display:grid;gap:12px;margin-top:18px}
.fine-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:24px;transition:border-color .18s;
}
.fine-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;flex-wrap:wrap;margin-bottom:12px}
.fine-art-badge{
  font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:500;
  background:var(--surface-2);border:1px solid var(--line);padding:3px 8px;border-radius:var(--r-sm);color:var(--accent);
}
.fine-price-wrap{text-align:right}
.fine-mrp{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3)}
.fine-sum{font-family:var(--serif);font-size:22px;font-weight:600;color:var(--bad);letter-spacing:-.012em;margin-top:2px}
.fine-sum-disc{font-family:var(--sans);font-size:13.5px;color:var(--ok);font-weight:600;margin-top:2px}
.fine-title{font-family:var(--sans);font-size:16px;font-weight:500;color:var(--ink);line-height:1.62;margin:0 0 12px}
.fine-repeat{font-family:var(--sans);font-size:13.5px;color:var(--ink-3);line-height:1.5;border-top:1px solid var(--line);padding-top:12px;margin-top:12px}

@media (hover:hover){
  .fine-card:hover{border-color:var(--line-2)}
}

/* Раздел ПМП */
.pmp-content{max-width:78ch;margin:24px auto 0}
.pmp-section{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:32px;margin-bottom:18px}
.pmp-section h3{font-family:var(--serif);font-size:21px;letter-spacing:-.012em;font-weight:600;margin:0 0 18px;color:var(--ink);line-height:1.3}
.pmp-section p{margin:0 0 12px;color:var(--ink-2);font-family:var(--sans);font-size:16px;line-height:1.68}
.pmp-section p:last-child{margin-bottom:0}
.pmp-section strong{color:var(--ink);font-weight:600}

/* Правила ПДД / читалка */
.rules-bar{display:flex;gap:12px;align-items:center;margin:24px 0 18px;flex-wrap:wrap}
.rules-search-wrap{flex:1 1 280px;position:relative}
.rules-search-input{
  width:100%;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:12px 16px 12px 42px;font-size:15px;color:var(--ink);font-family:inherit;
  outline:none;box-sizing:border-box;transition:border-color .18s;
}
.rules-search-input:focus{border-color:var(--accent)}
.rules-search-ic{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--ink-3);pointer-events:none}
.rules-search-clear{
  position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:0;
  color:var(--ink-3);cursor:pointer;padding:4px 8px;font-size:14px;border-radius:var(--r-sm);
}
@media (hover:hover){
  .rules-search-clear:hover{color:var(--ink)}
}

.rules-layout{display:grid;grid-template-columns:310px minmax(0,1fr);gap:32px;align-items:start;margin-top:18px}
.rules-sidebar{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:18px 12px;position:sticky;top:80px;max-height:calc(100vh - 100px);
  overflow-y:auto;scrollbar-width:thin;
}
.rules-part-title{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--ink-3);padding:14px 10px 6px;border-top:1px solid var(--line);margin-top:8px;
}
.rules-part-title:first-child{border-top:0;margin-top:0;padding-top:4px}
.rules-ch-item{
  display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;
  background:none;border:0;border-radius:var(--r-sm);padding:9px 12px;margin-bottom:2px;
  font-family:var(--sans);font-size:14px;color:var(--ink-2);cursor:pointer;line-height:1.4;transition:background .15s,color .15s;
}
.rules-ch-item.active{background:var(--accent-deep);color:var(--on-accent);font-weight:600}
.rules-ch-item .badge{
  font-family:var(--mono);font-size:11px;letter-spacing:.08em;opacity:.75;margin-left:6px;flex:0 0 auto;
}
@media (hover:hover){
  .rules-ch-item:hover:not(.active){background:var(--surface-2);color:var(--ink)}
}

.rules-reader{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:44px}
.rules-ch-header{margin-bottom:32px;padding-bottom:18px;border-bottom:1px solid var(--line)}
.rules-part-badge{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--moss);margin-bottom:8px;display:inline-block;
}
.rules-ch-header h2{font-family:var(--serif);font-size:26px;margin:0;line-height:1.25;letter-spacing:-.012em}

.clause{margin-bottom:24px;line-height:1.72;font-size:16.5px;color:var(--ink);border-radius:var(--r-sm);transition:background .25s}
.clause.flash{background:var(--accent-soft);padding:6px 12px;margin-left:-12px;margin-right:-12px}
.clause-num{
  display:inline-block;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;font-weight:500;
  background:var(--surface-2);border:1px solid var(--line);padding:2px 7px;
  border-radius:var(--r-sm);color:var(--accent);margin-right:8px;vertical-align:baseline;
}
.clause-footnote{
  background:var(--surface-2);border-left:3px solid var(--line-2);
  padding:12px 16px;border-radius:0 var(--r-sm) var(--r-sm) 0;font-family:var(--sans);font-size:13.5px;
  color:var(--ink-3);margin:14px 0 20px;line-height:1.6;
}

.rules-search-stat{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3);margin-bottom:18px}
.rules-search-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:18px 20px;margin-bottom:12px;cursor:pointer;transition:border-color .18s;
}
.rules-search-meta{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap}
.rules-search-ch{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--moss);font-weight:500}
.rules-search-txt{font-family:var(--sans);font-size:15.5px;line-height:1.62;color:var(--ink)}

mark.hl{background:var(--surface-2);color:var(--accent);border-bottom:1px solid var(--accent);padding:0 2px;border-radius:2px}

.ch-nav-bar{
  display:flex;justify-content:space-between;align-items:center;margin-top:44px;
  padding-top:24px;border-top:1px solid var(--line);gap:12px;flex-wrap:wrap;
}
.ch-mobile-sel{
  display:none;width:100%;background:var(--surface);border:1px solid var(--line);
  border-radius:var(--r-sm);padding:12px 14px;color:var(--ink);font-family:var(--sans);font-size:15px;margin-bottom:18px;
}
@media (max-width:900px){
  .rules-layout{display:block}
  .rules-sidebar{display:none}
  .ch-mobile-sel{display:block}
  .rules-reader{padding:24px 20px 28px}
}
`;

// Replace existing portal styles block in index.html
const startIdx = html.indexOf('/* ---------- раздел ПДД / справочник правил ---------- */');
const endIdx = html.indexOf('</style>');

if (startIdx !== -1 && endIdx !== -1) {
  html = html.slice(0, startIdx) + strictStyles + '\n' + html.slice(endIdx);
}

fs.writeFileSync(indexPath, html);
console.log('Successfully refactored index.html to follow STYLE.md strictly!');
