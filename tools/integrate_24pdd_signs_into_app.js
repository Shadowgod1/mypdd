const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Load clean 24pdd dataset
const signs = JSON.parse(fs.readFileSync('tools/signs_24pdd_clean.json', 'utf8'));

// 1. Replace SIGNS_DATA
const signsJsonStr = JSON.stringify(signs);
html = html.replace(/const SIGNS_DATA = \[[\s\S]*?\];/, 'const SIGNS_DATA = ' + signsJsonStr + ';');

// 2. Add rich card styling for signs
const signCardStyles = `
/* ============================================================
   КАРТОЧКИ ЗНАКОВ С НАСТОЯЩИМИ ИЗОБРАЖЕНИЯМИ И ОСОБЕННОСТЯМИ
   ============================================================ */
.signs-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(380px,1fr));gap:20px;
}
.sign-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:20px;display:flex;flex-direction:column;gap:14px;box-shadow:var(--shadow);
  transition:border-color .15s,transform .15s;
}
@media (hover:hover){
  .sign-card:hover{border-color:var(--accent);transform:translateY(-1px)}
}

.sign-card-top{
  display:flex;gap:18px;align-items:flex-start;
}
.sign-img-frame{
  background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:10px;min-width:88px;width:88px;height:88px;flex:0 0 88px;display:flex;align-items:center;justify-content:center;
  box-sizing:border-box;
}
.sign-img-frame img{
  max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.18));
}
.sign-card-body{flex:1 1 auto;min-width:0}

.sign-card-meta{display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap}
.sign-num-badge{
  font-family:var(--mono);font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;
  background:var(--accent-soft);color:var(--accent);border:1px solid var(--accent);
}
.sign-cat-badge{
  font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);
}

.sign-card-title{
  font-family:var(--serif);font-size:17.5px;font-weight:600;line-height:1.3;letter-spacing:-.01em;color:var(--ink);margin:0 0 6px;
}
.sign-card-desc{
  font-family:var(--sans);font-size:14px;line-height:1.55;color:var(--ink-2);margin:0;
}

.sign-card-features{
  background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:12px 14px;margin-top:auto;font-family:var(--sans);font-size:13px;line-height:1.58;color:var(--ink-2);
}
.sign-feat-title{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700;display:block;margin-bottom:4px;
}

@media (max-width:640px){
  .signs-grid{grid-template-columns:1fr}
  .sign-card-top{gap:14px}
  .sign-img-frame{width:76px;height:76px;min-width:76px;flex:0 0 76px;padding:8px}
}
`;

// Replace previous sign card styles or append
if (html.includes('/* ============================================================') && html.includes('КАРТОЧКИ ЗНАКОВ С НАСТОЯЩИМИ ИЗОБРАЖЕНИЯМИ')) {
  html = html.replace(/\/\* ============================================================[\s\S]*?КАРТОЧКИ ЗНАКОВ С НАСТОЯЩИМИ ИЗОБРАЖЕНИЯМИ[\s\S]*?<\/style>/, signCardStyles + '\n</style>');
} else {
  html = html.replace('</style>', signCardStyles + '\n</style>');
}

// 3. Update screenSigns
const newScreenSigns = `
function screenSigns(group, query){
  S = null; stopTimer(); barSlot.innerHTML = '';
  if(group !== undefined) SIGNS_STATE.g = group;
  if(query !== undefined) SIGNS_STATE.q = query;

  const groups = [
    { id: 'all', title: 'Все знаки ('+SIGNS_DATA.length+')', titleKk: 'Барлық белгілер ('+SIGNS_DATA.length+')' },
    { id: '1', title: '1. Предупреждающие', titleKk: '1. Ескерту' },
    { id: '2', title: '2. Приоритета', titleKk: '2. Басымдық' },
    { id: '3', title: '3. Запрещающие', titleKk: '3. Тыйым салатын' },
    { id: '4', title: '4. Предписывающие', titleKk: '4. Бұйыру' },
    { id: '5', title: '5. Информационные', titleKk: '5. Ақпараттық' },
    { id: '6', title: '6. Сервиса', titleKk: '6. Сервис' },
    { id: '7', title: '7. Таблички', titleKk: '7. Тақтайшалар' },
    { id: '8', title: '8. Опознавательные', titleKk: '8. Айырым белгілері' }
  ];

  const filterChips = groups.map(g =>
    '<button class="p-filter-chip'+(SIGNS_STATE.g===g.id?' active':'')+'" data-sg="'+g.id+'">'+
      esc(LANG==='kk'?g.titleKk:g.title)+
    '</button>'
  ).join('');

  const items = searchSigns(SIGNS_STATE.q, SIGNS_STATE.g);

  const cardsHtml = items.length ? items.map(s => {
    const featHtml = s.features ?
      ('<div class="sign-card-features">'+
        '<span class="sign-feat-title">'+(LANG==='kk'?'Ерекшеліктері:':'Особенности:')+'</span>'+
        highlightMatches(s.features, SIGNS_STATE.q)+
      '</div>') : '';

    const imgTag = s.img ?
      ('<div class="sign-img-frame"><img src="'+s.img+'" alt="'+esc(s.title)+'" loading="lazy"></div>') :
      '<div class="sign-img-frame" style="font-family:var(--mono);font-size:10px;color:var(--ink-3);text-align:center">'+esc(s.num)+'</div>';

    return '<div class="sign-card">'+
      '<div class="sign-card-top">'+
        imgTag +
        '<div class="sign-card-body">'+
          '<div class="sign-card-meta">'+
            '<span class="sign-num-badge">'+esc(s.num)+'</span>'+
            '<span class="sign-cat-badge">'+esc(LANG==='kk'?s.groupTitleKk:s.groupTitle)+'</span>'+
          '</div>'+
          '<h3 class="sign-card-title">'+highlightMatches(s.title, SIGNS_STATE.q)+'</h3>'+
          '<p class="sign-card-desc">'+highlightMatches(s.desc, SIGNS_STATE.q)+'</p>'+
        '</div>'+
      '</div>'+
      featHtml +
    '</div>';
  }).join('') : '<div class="rules-search-stat" style="grid-column:1/-1">'+t('signsEmpty', esc(SIGNS_STATE.q))+'</div>';

  const cheatHtml = (SIGNS_STATE.g === 'all' && !SIGNS_STATE.q) ?
    '<div class="signs-cheat-wrap">'+
      '<h2 class="signs-cheat-head">'+t('secCheat')+'</h2>'+
      '<div class="signs-cheat-grid">'+
        '<div class="signs-cheat-item">'+
          '<div class="signs-cheat-pair">'+
            '<svg viewBox="0 0 60 60"><use href="#sg-giveway"/></svg>'+
            '<svg viewBox="0 0 60 60"><use href="#sg-stop"/></svg>'+
          '</div>'+
          '<p class="signs-cheat-desc">'+t('cheat1')+'</p>'+
        '</div>'+
        '<div class="signs-cheat-item">'+
          '<div class="signs-cheat-pair">'+
            '<svg viewBox="0 0 60 60"><use href="#sg-noentry"/></svg>'+
            '<svg viewBox="0 0 60 60"><use href="#sg-novehicle"/></svg>'+
          '</div>'+
          '<p class="signs-cheat-desc">'+t('cheat2')+'</p>'+
        '</div>'+
        '<div class="signs-cheat-item">'+
          '<div class="signs-cheat-pair">'+
            '<svg viewBox="0 0 60 60"><use href="#sg-noStop"/></svg>'+
            '<svg viewBox="0 0 60 60"><use href="#sg-noPark"/></svg>'+
          '</div>'+
          '<p class="signs-cheat-desc">'+t('cheat3')+'</p>'+
        '</div>'+
      '</div>'+
    '</div>' : '';

  const searchSvg = '<svg class="rules-search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';

  app.innerHTML =
    renderMobileNav('signs') +
    '<section class="hero rules-hero">'+
      '<div class="eyebrow">'+t('signsEyebrow')+'</div>'+
      '<h1>'+t('signsTitle')+'</h1>'+
    '</section>'+
    cheatHtml +
    '<div class="rules-bar">'+
      '<button class="btn ghost" id="signs-back-btn" style="min-width:auto;padding:0 18px">← '+t('toHome')+'</button>'+
      '<div class="rules-search-wrap">'+
        searchSvg+
        '<input type="search" class="rules-search-input" id="signs-search-inp" placeholder="'+t('signsSearchPh')+'" value="'+esc(SIGNS_STATE.q)+'">'+
        (SIGNS_STATE.q ? '<button class="rules-search-clear" id="signs-clear-btn">✕</button>' : '')+
      '</div>'+
    '</div>'+
    '<div class="p-filter-bar">'+filterChips+'</div>'+
    '<div class="rules-search-stat">'+t('signsFound', items.length)+'</div>'+
    '<div class="signs-grid">'+cardsHtml+'</div>';

  document.getElementById('signs-back-btn').onclick = () => { screenHome(); window.scrollTo({top:0,behavior:'smooth'}); };
  
  const searchInp = document.getElementById('signs-search-inp');
  searchInp.oninput = (e) => {
    screenSigns(SIGNS_STATE.g, e.target.value);
    const inp = document.getElementById('signs-search-inp');
    if(inp){ inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
  };

  const clearBtn = document.getElementById('signs-clear-btn');
  if(clearBtn) clearBtn.onclick = () => screenSigns(SIGNS_STATE.g, '');

  app.querySelectorAll('[data-sg]').forEach(b => {
    b.onclick = () => screenSigns(b.dataset.sg, SIGNS_STATE.q);
  });

  hookMobileNav();
}
`;

const sSignsStart = html.indexOf('function screenSigns(');
const sSignsEnd = html.indexOf('function searchMarkings(');
html = html.slice(0, sSignsStart) + newScreenSigns.trim() + '\n\n' + html.slice(sSignsEnd);

fs.writeFileSync(indexPath, html);
console.log('Successfully integrated 24pdd signs with real images and features into index.html!');
