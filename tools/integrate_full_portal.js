const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Load scraped datasets
const markings = JSON.parse(fs.readFileSync('tools/markings_24pdd.json', 'utf8'));
const fines = JSON.parse(fs.readFileSync('tools/fines_24pdd.json', 'utf8'));
const prochie = JSON.parse(fs.readFileSync('tools/prochie_24pdd.json', 'utf8'));

// 1. Replace datasets in index.html
html = html.replace(/const MARKINGS_DATA = \[[\s\S]*?\];/, 'const MARKINGS_DATA = ' + JSON.stringify(markings) + ';');
html = html.replace(/const FINES_DATA = \[[\s\S]*?\];/, 'const FINES_DATA = ' + JSON.stringify(fines) + ';');

if (!html.includes('const PROCHIE_DATA =')) {
  html = html.replace('const FINES_DATA =', 'const PROCHIE_DATA = ' + JSON.stringify(prochie) + ';\n\nconst FINES_DATA =');
} else {
  html = html.replace(/const PROCHIE_DATA = \[[\s\S]*?\];/, 'const PROCHIE_DATA = ' + JSON.stringify(prochie) + ';');
}

// 2. Add styles for "Прочие", "Разметка", and "Штрафы"
const portalStyles = `
/* ============================================================
   СТИЛИ ДЛЯ РАЗДЕЛОВ: РАЗМЕТКА, ШТРАФЫ, ПРОЧИЕ И АВТОДРОМ
   ============================================================ */
.prochie-layout{display:grid;grid-template-columns:260px 1fr;gap:24px;align-items:start;margin-top:20px}
.prochie-sidebar{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:12px;display:flex;flex-direction:column;gap:4px;position:sticky;top:80px;box-shadow:var(--shadow);
}
.prochie-nav-btn{
  background:transparent;border:none;border-radius:var(--r-sm);padding:10px 14px;
  font-family:var(--sans);font-size:14px;font-weight:500;color:var(--ink-2);text-align:left;
  cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .15s ease;
}
.prochie-nav-btn.active{
  background:var(--surface-2);color:var(--accent);font-weight:600;border:1px solid var(--line);
}
@media (hover:hover){
  .prochie-nav-btn:hover:not(.active){background:var(--surface-2);color:var(--ink)}
}

.prochie-content-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:28px;box-shadow:var(--shadow);
}
.prochie-content-card h2{
  font-family:var(--serif);font-size:24px;font-weight:600;letter-spacing:-.015em;color:var(--ink);margin:0 0 16px;line-height:1.25;
}
.prochie-text{
  font-family:var(--sans);font-size:15px;line-height:1.75;color:var(--ink-2);white-space:pre-line;
}

/* Таблица штрафов */
.fines-table-wrap{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  overflow-x:auto;margin-top:16px;box-shadow:var(--shadow);
}
.fines-table{
  width:100%;border-collapse:collapse;text-align:left;font-family:var(--sans);font-size:14px;
}
.fines-table th{
  background:var(--surface-2);padding:14px 16px;font-family:var(--mono);font-size:11px;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink-3);border-bottom:1px solid var(--line);
}
.fines-table td{
  padding:14px 16px;border-bottom:1px solid var(--line);color:var(--ink-2);vertical-align:top;
}
.fines-table tr:last-child td{border-bottom:none}
.fines-table tr:hover td{background:var(--surface-2)}
.fine-art-badge{
  font-family:var(--mono);font-size:11.5px;font-weight:700;color:var(--accent);background:var(--surface-2);
  padding:3px 7px;border-radius:4px;border:1px solid var(--line);display:inline-block;white-space:nowrap;
}
.fine-sum{font-family:var(--mono);font-size:14px;font-weight:700;color:var(--bad);white-space:nowrap}
.fine-disc{font-family:var(--mono);font-size:11.5px;color:var(--ok);margin-top:3px;display:block}

@media (max-width:840px){
  .prochie-layout{grid-template-columns:1fr;gap:16px}
  .prochie-sidebar{position:static}
}
`;

if (html.includes('/* ============================================================') && html.includes('СТИЛИ ДЛЯ РАЗДЕЛОВ: РАЗМЕТКА, ШТРАФЫ')) {
  html = html.replace(/\/\* ============================================================[\s\S]*?СТИЛИ ДЛЯ РАЗДЕЛОВ: РАЗМЕТКА, ШТРАФЫ[\s\S]*?<\/style>/, portalStyles + '\n</style>');
} else {
  html = html.replace('</style>', portalStyles + '\n</style>');
}

// 3. Update topbar navigation in HTML to include "Прочие"
const oldNav = `<nav class="nav-links" id="main-nav">
      <button class="nav-link" data-nav="tests"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg><span data-t="navTests">Тесты</span></button>
      <button class="nav-link" data-nav="rules"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span data-t="navRules">Правила</span></button>
      <button class="nav-link" data-nav="signs"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="12 2 2 22 22 22"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span data-t="navSigns">Знаки</span></button>
      <button class="nav-link" data-nav="markings"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg><span data-t="navMarkings">Разметка</span></button>
      <button class="nav-link" data-nav="fines"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span data-t="navFines">Штрафы</span></button>
      <button class="nav-link" data-nav="pmp"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg><span data-t="navPmp">ПМП</span></button>
    </nav>`;

const newNav = `<nav class="nav-links" id="main-nav">
      <button class="nav-link" data-nav="tests"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg><span data-t="navTests">Тесты</span></button>
      <button class="nav-link" data-nav="rules"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span data-t="navRules">Правила</span></button>
      <button class="nav-link" data-nav="signs"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="12 2 2 22 22 22"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span data-t="navSigns">Знаки</span></button>
      <button class="nav-link" data-nav="markings"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg><span data-t="navMarkings">Разметка</span></button>
      <button class="nav-link" data-nav="fines"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg><span data-t="navFines">Штрафы</span></button>
      <button class="nav-link" data-nav="pmp"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg><span data-t="navPmp">ПМП</span></button>
      <button class="nav-link" data-nav="prochie"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg><span data-t="navProchie">Прочие</span></button>
    </nav>`;

if (html.includes(oldNav)) {
  html = html.replace(oldNav, newNav);
}

// 4. Update screenMarkings function to guarantee perfect rendering & click
const newScreenMarkings = `
function screenMarkings(group, query){
  S = null; stopTimer(); barSlot.innerHTML = '';
  if(group !== undefined) MARKINGS_STATE.g = group;
  if(query !== undefined) MARKINGS_STATE.q = query;

  const groups = [
    { id: 'all', title: 'Вся разметка ('+MARKINGS_DATA.length+')', titleKk: 'Барлық таңбалар ('+MARKINGS_DATA.length+')' },
    { id: 'h', title: '1. Горизонтальная (1.1–1.25)', titleKk: '1. Көлденең таңбалар' },
    { id: 'v', title: '2. Вертикальная (2.1–2.7)', titleKk: '2. Тік таңбалар' }
  ];

  const filterChips = groups.map(g =>
    '<button class="p-filter-chip'+(MARKINGS_STATE.g===g.id?' active':'')+'" data-mg="'+g.id+'">'+
      esc(LANG==='kk'?g.titleKk:g.title)+
    '</button>'
  ).join('');

  const items = searchMarkings(MARKINGS_STATE.q, MARKINGS_STATE.g);

  const cardsHtml = items.length ? items.map(m => {
    const featHtml = m.features ?
      ('<div class="sign-card-features">'+
        '<span class="sign-feat-title">'+(LANG==='kk'?'Ерекшеліктері:':'Особенности:')+'</span>'+
        highlightMatches(m.features, MARKINGS_STATE.q)+
      '</div>') : '';

    const imgTag = m.imgUrl ?
      ('<div class="sign-img-frame"><img src="'+m.imgUrl+'" alt="'+esc(m.title)+'" loading="lazy" style="filter:none"></div>') :
      ('<div class="mark-figure">'+getMarkingGraphic(m.num, m.group)+'</div>');

    return '<div class="sign-card">'+
      '<div class="sign-card-top">'+
        imgTag +
        '<div class="sign-card-body">'+
          '<div class="sign-card-meta">'+
            '<span class="sign-num-badge">'+esc(m.num)+'</span>'+
            '<span class="sign-cat-badge">'+esc(LANG==='kk'?m.groupTitleKk:m.groupTitle)+'</span>'+
          '</div>'+
          '<h3 class="sign-card-title">'+highlightMatches(m.title, MARKINGS_STATE.q)+'</h3>'+
          '<p class="sign-card-desc">'+highlightMatches(m.desc, MARKINGS_STATE.q)+'</p>'+
        '</div>'+
      '</div>'+
      featHtml +
    '</div>';
  }).join('') : '<div class="rules-search-stat" style="grid-column:1/-1">'+t('signsEmpty', esc(MARKINGS_STATE.q))+'</div>';

  const searchSvg = '<svg class="rules-search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';

  app.innerHTML =
    renderMobileNav('markings') +
    '<section class="hero rules-hero">'+
      '<div class="eyebrow">'+t('markingsEyebrow')+'</div>'+
      '<h1>'+t('markingsTitle')+'</h1>'+
    '</section>'+
    '<div class="rules-bar">'+
      '<button class="btn ghost" id="markings-back-btn" style="min-width:auto;padding:0 18px">← '+t('toHome')+'</button>'+
      '<div class="rules-search-wrap">'+
        searchSvg+
        '<input type="search" class="rules-search-input" id="markings-search-inp" placeholder="'+t('markingsSearchPh')+'" value="'+esc(MARKINGS_STATE.q)+'">'+
        (MARKINGS_STATE.q ? '<button class="rules-search-clear" id="markings-clear-btn">✕</button>' : '')+
      '</div>'+
    '</div>'+
    '<div class="p-filter-bar">'+filterChips+'</div>'+
    '<div class="rules-search-stat">'+t('signsFound', items.length)+'</div>'+
    '<div class="signs-grid">'+cardsHtml+'</div>';

  document.getElementById('markings-back-btn').onclick = () => { screenHome(); window.scrollTo({top:0,behavior:'smooth'}); };
  
  const searchInp = document.getElementById('markings-search-inp');
  searchInp.oninput = (e) => {
    screenMarkings(MARKINGS_STATE.g, e.target.value);
    const inp = document.getElementById('markings-search-inp');
    if(inp){ inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
  };

  const clearBtn = document.getElementById('markings-clear-btn');
  if(clearBtn) clearBtn.onclick = () => screenMarkings(MARKINGS_STATE.g, '');

  app.querySelectorAll('[data-mg]').forEach(b => {
    b.onclick = () => screenMarkings(b.dataset.mg, MARKINGS_STATE.q);
  });

  hookMobileNav();
}
`;

const sMarkStart = html.indexOf('function screenMarkings(');
const sMarkEnd = html.indexOf('function formatTen(');
html = html.slice(0, sMarkStart) + newScreenMarkings.trim() + '\n\n' + html.slice(sMarkEnd);

// 5. Update screenFines function with complete table of 82 fine articles
const newScreenFines = `
function screenFines(group, query){
  S = null; stopTimer(); barSlot.innerHTML = '';
  if(group !== undefined) FINES_STATE.g = group;
  if(query !== undefined) FINES_STATE.q = query;

  const groups = [
    { id: 'all', title: 'Все штрафы ('+FINES_DATA.length+')' },
    { id: 'speed', title: '1. Скорость' },
    { id: 'inter', title: '2. Перекрёстки' },
    { id: 'maneuver', title: '3. Манёвры и обгон' },
    { id: 'stop', title: '4. Остановка и стоянка' },
    { id: 'docs', title: '5. Документы и ТО' },
    { id: 'alc', title: '6. Опьянение' },
    { id: 'police', title: '7. Требования полиции' },
    { id: 'ped', title: '8. Пешеходы' }
  ];

  const filterChips = groups.map(g =>
    '<button class="p-filter-chip'+(FINES_STATE.g===g.id?' active':'')+'" data-fg="'+g.id+'">'+
      esc(g.title)+
    '</button>'
  ).join('');

  const items = searchFines(FINES_STATE.q, FINES_STATE.g);

  const rowsHtml = items.length ? items.map((f, idx) => {
    const rawSum = parseInt((f.sum || '').replace(/[^0-9]/g, ''), 10) || 0;
    const discSum = rawSum ? Math.round(rawSum / 2).toLocaleString('ru-RU') + ' ₸' : '';

    return '<tr>'+
      '<td style="font-family:var(--mono);color:var(--ink-3);font-size:12px">'+(idx+1)+'</td>'+
      '<td><div style="font-weight:600;color:var(--ink);margin-bottom:3px">'+highlightMatches(f.title, FINES_STATE.q)+'</div>'+
          (f.repeat ? '<div style="font-size:12px;color:var(--warn)">Повторно: '+f.repeat+'</div>' : '')+'</td>'+
      '<td><span class="fine-art-badge">'+esc(f.article)+'</span></td>'+
      '<td style="font-family:var(--mono);font-size:13px;color:var(--ink)">'+esc(f.mrp)+'</td>'+
      '<td><span class="fine-sum">'+esc(f.sum)+'</span>'+
          (discSum ? '<span class="fine-disc">Скидка 50%: '+discSum+'</span>' : '')+'</td>'+
    '</tr>';
  }).join('') : '<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--ink-3)">Штрафов не найдено</td></tr>';

  const searchSvg = '<svg class="rules-search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';

  app.innerHTML =
    renderMobileNav('fines') +
    '<section class="hero rules-hero">'+
      '<div class="eyebrow">КоАП РК 2026 · 1 МРП = 4 325 ₸</div>'+
      '<h1>Таблица штрафов за нарушение ПДД РК</h1>'+
      '<p>Актуальные статьи Кодекса об административных правонарушениях РК со скидкой 50% при оплате в течение 7 дней.</p>'+
    '</section>'+
    '<div class="rules-bar">'+
      '<button class="btn ghost" id="fines-back-btn" style="min-width:auto;padding:0 18px">← '+t('toHome')+'</button>'+
      '<div class="rules-search-wrap">'+
        searchSvg+
        '<input type="search" class="rules-search-input" id="fines-search-inp" placeholder="Поиск по статье или нарушению (592, ремень, скорость)..." value="'+esc(FINES_STATE.q)+'">'+
        (FINES_STATE.q ? '<button class="rules-search-clear" id="fines-clear-btn">✕</button>' : '')+
      '</div>'+
    '</div>'+
    '<div class="p-filter-bar">'+filterChips+'</div>'+
    '<div class="rules-search-stat">Найдено статей: '+items.length+'</div>'+
    '<div class="fines-table-wrap">'+
      '<table class="fines-table">'+
        '<thead><tr><th>№</th><th>Вид нарушения</th><th>Статья</th><th>МРП</th><th>Сумма штрафа</th></tr></thead>'+
        '<tbody>'+rowsHtml+'</tbody>'+
      '</table>'+
    '</div>';

  document.getElementById('fines-back-btn').onclick = () => { screenHome(); window.scrollTo({top:0,behavior:'smooth'}); };
  
  const searchInp = document.getElementById('fines-search-inp');
  searchInp.oninput = (e) => {
    screenFines(FINES_STATE.g, e.target.value);
    const inp = document.getElementById('fines-search-inp');
    if(inp){ inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
  };

  const clearBtn = document.getElementById('fines-clear-btn');
  if(clearBtn) clearBtn.onclick = () => screenFines(FINES_STATE.g, '');

  app.querySelectorAll('[data-fg]').forEach(b => {
    b.onclick = () => screenFines(b.dataset.fg, FINES_STATE.q);
  });

  hookMobileNav();
}
`;

const sFinesStart = html.indexOf('function screenFines(');
const sFinesEnd = html.indexOf('function screenPmp(');
html = html.slice(0, sFinesStart) + newScreenFines.trim() + '\n\n' + html.slice(sFinesEnd);

// 6. Add screenProchie function
const screenProchieCode = `
let PROCHIE_STATE = { activeId: 'docs' };

function screenProchie(activeId){
  S = null; stopTimer(); barSlot.innerHTML = '';
  if(activeId) PROCHIE_STATE.activeId = activeId;

  const cur = PROCHIE_DATA.find(p => p.id === PROCHIE_STATE.activeId) || PROCHIE_DATA[0];

  const sidebarButtons = PROCHIE_DATA.map(p =>
    '<button class="prochie-nav-btn'+(p.id === cur.id ? ' active' : '')+'" data-pid="'+p.id+'">'+
      '<span>'+esc(p.title)+'</span>'+
      '<span>→</span>'+
    '</button>'
  ).join('');

  app.innerHTML =
    renderMobileNav('prochie') +
    '<section class="hero rules-hero">'+
      '<div class="eyebrow">Справочные материалы водителя РК</div>'+
      '<h1>Прочие полезные разделы</h1>'+
      '<p>Законодательство, требования к ТС, налоговые ставки, методика автодрома СпецЦОН и памятки.</p>'+
    '</section>'+
    '<div class="rules-bar">'+
      '<button class="btn ghost" id="prochie-back-btn" style="min-width:auto;padding:0 18px">← '+t('toHome')+'</button>'+
    '</div>'+
    '<div class="prochie-layout">'+
      '<div class="prochie-sidebar">'+sidebarButtons+'</div>'+
      '<div class="prochie-content-card">'+
        '<h2>'+esc(cur.title)+'</h2>'+
        '<div class="prochie-text">'+esc(cur.content)+'</div>'+
      '</div>'+
    '</div>';

  document.getElementById('prochie-back-btn').onclick = () => { screenHome(); window.scrollTo({top:0,behavior:'smooth'}); };

  app.querySelectorAll('[data-pid]').forEach(b => {
    b.onclick = () => {
      screenProchie(b.dataset.pid);
      window.scrollTo({top:0,behavior:'smooth'});
    };
  });

  hookMobileNav();
}
`;

if (!html.includes('function screenProchie(')) {
  html = html.replace('function screenRules(', screenProchieCode.trim() + '\n\nfunction screenRules(');
} else {
  const pStart = html.indexOf('function screenProchie(');
  const pEnd = html.indexOf('function screenRules(');
  html = html.slice(0, pStart) + screenProchieCode.trim() + '\n\n' + html.slice(pEnd);
}

// 7. Update main navigation click bindings
const navBindingCode = `
document.querySelectorAll('#main-nav [data-nav]').forEach(btn => {
  btn.onclick = (e) => {
    e.preventDefault();
    const nav = btn.dataset.nav;
    document.querySelectorAll('#main-nav .nav-link').forEach(l => l.classList.remove('active'));
    btn.classList.add('active');
    if(nav === 'tests') screenHome();
    else if(nav === 'rules') screenRules('ch1', '');
    else if(nav === 'signs') screenSigns('all', '');
    else if(nav === 'markings') screenMarkings('all', '');
    else if(nav === 'fines') screenFines('all', '');
    else if(nav === 'pmp') screenPmp();
    else if(nav === 'prochie') screenProchie('docs');
    window.scrollTo({top:0,behavior:'smooth'});
  };
});
`;

const navBindStart = html.indexOf("document.querySelectorAll('#main-nav [data-nav]')");
const navBindEnd = html.indexOf("document.getElementById('home-link').onclick =");
html = html.slice(0, navBindStart) + navBindingCode.trim() + '\n\n' + html.slice(navBindEnd);

// 8. Update translation dictionary T
html = html.replace("navPmp: 'ПМП',", "navPmp: 'ПМП',\n  navProchie: 'Прочие',");
html = html.replace("navPmp: 'АМК',", "navPmp: 'АМК',\n  navProchie: 'Басқалар',");

fs.writeFileSync(indexPath, html);
console.log('Successfully integrated full portal: Markings, Fines, Prochie, and Autodrome!');
