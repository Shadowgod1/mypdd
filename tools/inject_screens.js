const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const screensCode = `
/* ============================================================
   РАЗДЕЛ: ДОРОЖНЫЕ ЗНАКИ (256 знаков по 7 группам)
   ============================================================ */
let SIGNS_STATE = { g: 'all', q: '' };

function searchSigns(query, group){
  const q = query.trim().toLowerCase();
  let list = SIGNS_DATA;
  if(group && group !== 'all'){
    list = list.filter(s => s.group === group);
  }
  if(!q) return list;
  const words = q.split(/\\s+/).filter(Boolean);
  return list.filter(s => {
    const full = (s.num + ' ' + s.title + ' ' + s.desc).toLowerCase();
    return words.every(w => full.includes(w));
  });
}

function screenSigns(group, query){
  S = null; stopTimer(); barSlot.innerHTML = '';
  if(group !== undefined) SIGNS_STATE.g = group;
  if(query !== undefined) SIGNS_STATE.q = query;

  const groups = [
    { id: 'all', title: 'Все знаки (256)', titleKk: 'Барлық белгілер (256)' },
    { id: '1', title: '1. Предупреждающие', titleKk: '1. Ескерту' },
    { id: '2', title: '2. Приоритета', titleKk: '2. Басымдық' },
    { id: '3', title: '3. Запрещающие', titleKk: '3. Тыйым салатын' },
    { id: '4', title: '4. Предписывающие', titleKk: '4. Міндеттейтін' },
    { id: '5', title: '5. Информационные', titleKk: '5. Ақпараттық' },
    { id: '6', title: '6. Сервиса', titleKk: '6. Сервис' },
    { id: '7', title: '7. Таблички', titleKk: '7. Табличкалар' },
    { id: '8', title: '8. Опознавательные', titleKk: '8. Айырым белгілері' }
  ];

  const filterChips = groups.map(g =>
    '<button class="p-filter-chip'+(SIGNS_STATE.g===g.id?' active':'')+'" data-sg="'+g.id+'">'+
      esc(LANG==='kk'?g.titleKk:g.title)+
    '</button>'
  ).join('');

  const items = searchSigns(SIGNS_STATE.q, SIGNS_STATE.g);

  const cardsHtml = items.length ? items.map(s =>
    '<div class="sign-card">'+
      '<div class="sign-card-head">'+
        '<span class="sign-num-badge">'+esc(s.num)+'</span>'+
        '<span class="sign-cat-badge">'+esc(LANG==='kk'?s.groupTitleKk:s.groupTitle)+'</span>'+
      '</div>'+
      '<h3 class="sign-card-title">'+highlightMatches(s.title, SIGNS_STATE.q)+'</h3>'+
      '<p class="sign-card-desc">'+highlightMatches(s.desc, SIGNS_STATE.q)+'</p>'+
    '</div>'
  ).join('') : '<div class="rules-search-stat" style="grid-column:1/-1">'+t('signsEmpty', esc(SIGNS_STATE.q))+'</div>';

  const searchSvg = '<svg class="rules-search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';

  app.innerHTML =
    renderMobileNav('signs') +
    '<section class="hero rules-hero">'+
      '<div class="eyebrow">'+t('signsEyebrow')+'</div>'+
      '<h1>'+t('signsTitle')+'</h1>'+
    '</section>'+
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

  // Handlers
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

/* ============================================================
   РАЗДЕЛ: ДОРОЖНАЯ РАЗМЕТКА
   ============================================================ */
let MARKINGS_STATE = { g: 'all', q: '' };

function searchMarkings(query, group){
  const q = query.trim().toLowerCase();
  let all = [];
  MARKINGS_DATA.forEach(g => {
    if(group === 'all' || group === g.group){
      g.items.forEach(it => {
        all.push({ ...it, groupTitle: g.groupTitle, groupTitleKk: g.groupTitleKk });
      });
    }
  });
  if(!q) return all;
  const words = q.split(/\\s+/).filter(Boolean);
  return all.filter(m => {
    const full = (m.num + ' ' + m.title + ' ' + m.desc).toLowerCase();
    return words.every(w => full.includes(w));
  });
}

function screenMarkings(group, query){
  S = null; stopTimer(); barSlot.innerHTML = '';
  if(group !== undefined) MARKINGS_STATE.g = group;
  if(query !== undefined) MARKINGS_STATE.q = query;

  const groups = [
    { id: 'all', title: 'Вся разметка (34)', titleKk: 'Барлық таңбалар (34)' },
    { id: 'h', title: '1. Горизонтальная (1.1–1.25)', titleKk: '1. Көлденең таңбалар' },
    { id: 'v', title: '2. Вертикальная (2.1–2.7)', titleKk: '2. Тік таңбалар' }
  ];

  const filterChips = groups.map(g =>
    '<button class="p-filter-chip'+(MARKINGS_STATE.g===g.id?' active':'')+'" data-mg="'+g.id+'">'+
      esc(LANG==='kk'?g.titleKk:g.title)+
    '</button>'
  ).join('');

  const items = searchMarkings(MARKINGS_STATE.q, MARKINGS_STATE.g);

  const cardsHtml = items.length ? items.map(m =>
    '<div class="sign-card">'+
      '<div class="sign-card-head">'+
        '<span class="sign-num-badge">'+esc(m.num)+'</span>'+
        '<span class="sign-cat-badge">'+esc(LANG==='kk'?m.groupTitleKk:m.groupTitle)+'</span>'+
      '</div>'+
      '<h3 class="sign-card-title">'+highlightMatches(LANG==='kk'?m.titleKk:m.title, MARKINGS_STATE.q)+'</h3>'+
      '<p class="sign-card-desc">'+highlightMatches(m.desc, MARKINGS_STATE.q)+'</p>'+
    '</div>'
  ).join('') : '<div class="rules-search-stat" style="grid-column:1/-1">'+t('signsEmpty', esc(MARKINGS_STATE.q))+'</div>';

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

/* ============================================================
   РАЗДЕЛ: ТАБЛИЦА ШТРАФОВ (КоАП РК)
   ============================================================ */
let FINES_STATE = { cat: 'all', q: '' };

function formatTen(n){
  return n.toLocaleString('ru-RU');
}

function searchFines(query, category){
  const q = query.trim().toLowerCase();
  let list = FINES_DATA;
  if(category && category !== 'all'){
    list = list.filter(f => f.cat === category);
  }
  if(!q) return list;
  const words = q.split(/\\s+/).filter(Boolean);
  return list.filter(f => {
    const full = (f.art + ' ' + f.title + ' ' + (f.titleKk||'') + ' ' + (f.repeat||'')).toLowerCase();
    return words.every(w => full.includes(w));
  });
}

function screenFines(cat, query){
  S = null; stopTimer(); barSlot.innerHTML = '';
  if(cat !== undefined) FINES_STATE.cat = cat;
  if(query !== undefined) FINES_STATE.q = query;

  const cats = [
    { id: 'all', title: 'Все нарушения ('+FINES_DATA.length+')', titleKk: 'Барлық бұзушылықтар ('+FINES_DATA.length+')' },
    { id: 'speed', title: '⚡ Скорость (ст. 592)', titleKk: '⚡ Жылдамдық (592-бап)' },
    { id: 'lights', title: '🚦 Красный свет (ст. 599)', titleKk: '🚦 Бағдаршам (599-бап)' },
    { id: 'distract', title: '📱 Ремень и телефон (ст. 591, 593)', titleKk: '📱 Белдік пен телефон (591, 593)' },
    { id: 'lane', title: '↔️ Встречка и рядность (ст. 595, 596)', titleKk: '↔️ Қарсы бағыт (595, 596)' },
    { id: 'parking', title: '🅿️ Парковка и стоянка (ст. 597)', titleKk: '🅿️ Тұрақ пен тоқтау (597-бап)' },
    { id: 'peds', title: '🚶 Пешеходы и самокаты (ст. 600, 615)', titleKk: '🚶 Жаяулар мен самокаттар' },
    { id: 'emergency', title: '🚑 Спецтранспорт и аварии (ст. 598, 606)', titleKk: '🚑 Жедел қызметтер мен апат' },
    { id: 'docs', title: '📄 Документы и номера (ст. 590, 612)', titleKk: '📄 Құжаттар мен нөмірлер' },
    { id: 'alcohol', title: '🚫 Опьянение (ст. 608, 613)', titleKk: '🚫 Масаң күй (608, 613-баптар)' },
    { id: 'accident', title: '💥 ДТП (ст. 610, 611)', titleKk: '💥 ЖКО (610, 611-баптар)' }
  ];

  const filterChips = cats.map(c =>
    '<button class="p-filter-chip'+(FINES_STATE.cat===c.id?' active':'')+'" data-fc="'+c.id+'">'+
      esc(LANG==='kk'?c.titleKk:c.title)+
    '</button>'
  ).join('');

  const items = searchFines(FINES_STATE.q, FINES_STATE.cat);

  const cardsHtml = items.length ? items.map(f => {
    const fullSum = f.mrp * MRP_VALUE;
    const discSum = Math.round(fullSum / 2);
    return '<div class="fine-card">'+
      '<div class="fine-card-top">'+
        '<span class="fine-art-badge">'+esc(f.art)+'</span>'+
        '<div class="fine-price-wrap">'+
          (f.mrp > 0 ?
            '<div class="fine-mrp">'+t('finesMrp', f.mrp)+'</div>'+
            '<div class="fine-sum">'+t('finesSum', formatTen(fullSum))+'</div>'+
            '<div class="fine-sum-disc">'+t('finesDiscount', formatTen(discSum))+'</div>' :
            '<div class="fine-sum" style="font-size:15px;color:var(--bad)">'+esc(f.special||'Лишение прав')+'</div>'
          )+
        '</div>'+
      '</div>'+
      '<h3 class="fine-title">'+highlightMatches(LANG==='kk'?f.titleKk:f.title, FINES_STATE.q)+'</h3>'+
      (f.repeat && f.repeat !== '-' ? '<div class="fine-repeat"><b>Повторность:</b> '+esc(f.repeat)+'</div>' : '')+
    '</div>';
  }).join('') : '<div class="rules-search-stat">'+t('finesEmpty', esc(FINES_STATE.q))+'</div>';

  const searchSvg = '<svg class="rules-search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';
  const infoSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

  app.innerHTML =
    renderMobileNav('fines') +
    '<section class="hero rules-hero">'+
      '<div class="eyebrow">'+t('finesEyebrow')+'</div>'+
      '<h1>'+t('finesTitle')+'</h1>'+
    '</section>'+
    '<div class="fines-info-banner">'+infoSvg+'<span>'+t('finesBanner')+'</span></div>'+
    '<div class="rules-bar">'+
      '<button class="btn ghost" id="fines-back-btn" style="min-width:auto;padding:0 18px">← '+t('toHome')+'</button>'+
      '<div class="rules-search-wrap">'+
        searchSvg+
        '<input type="search" class="rules-search-input" id="fines-search-inp" placeholder="'+t('finesSearchPh')+'" value="'+esc(FINES_STATE.q)+'">'+
        (FINES_STATE.q ? '<button class="rules-search-clear" id="fines-clear-btn">✕</button>' : '')+
      '</div>'+
    '</div>'+
    '<div class="p-filter-bar">'+filterChips+'</div>'+
    '<div class="rules-search-stat">'+t('finesFound', items.length)+'</div>'+
    '<div class="fines-grid">'+cardsHtml+'</div>';

  document.getElementById('fines-back-btn').onclick = () => { screenHome(); window.scrollTo({top:0,behavior:'smooth'}); };
  
  const searchInp = document.getElementById('fines-search-inp');
  searchInp.oninput = (e) => {
    screenFines(FINES_STATE.cat, e.target.value);
    const inp = document.getElementById('fines-search-inp');
    if(inp){ inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
  };

  const clearBtn = document.getElementById('fines-clear-btn');
  if(clearBtn) clearBtn.onclick = () => screenFines(FINES_STATE.cat, '');

  app.querySelectorAll('[data-fc]').forEach(b => {
    b.onclick = () => screenFines(b.dataset.fc, FINES_STATE.q);
  });

  hookMobileNav();
}

/* ============================================================
   РАЗДЕЛ: ПЕРВАЯ ПОМОЩЬ И АПТЕЧКА (ПМП)
   ============================================================ */
function screenPmp(){
  S = null; stopTimer(); barSlot.innerHTML = '';

  const sectionsHtml = PMP_DATA.sections.map(sec => {
    const title = LANG === 'kk' ? sec.titleKk : sec.title;
    const body = sec.content.map(p => {
      let formatted = esc(p).replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
      return '<p>' + formatted + '</p>';
    }).join('');
    return '<div class="pmp-section"><h3>' + esc(title) + '</h3>' + body + '</div>';
  }).join('');

  app.innerHTML =
    renderMobileNav('pmp') +
    '<section class="hero rules-hero">'+
      '<div class="eyebrow">'+t('pmpEyebrow')+'</div>'+
      '<h1>'+t('pmpTitle')+'</h1>'+
    '</section>'+
    '<div class="rules-bar">'+
      '<button class="btn ghost" id="pmp-back-btn" style="min-width:auto;padding:0 18px">← '+t('toHome')+'</button>'+
    '</div>'+
    '<div class="pmp-content" style="margin-top:24px">' + sectionsHtml + '</div>';

  document.getElementById('pmp-back-btn').onclick = () => { screenHome(); window.scrollTo({top:0,behavior:'smooth'}); };
  hookMobileNav();
}

/* ============================================================
   МОБИЛЬНАЯ ПАНЕЛЬ НАВИГАЦИИ
   ============================================================ */
function renderMobileNav(activeTab){
  const tabs = [
    { id: 'tests', label: t('navTests') },
    { id: 'rules', label: t('navRules') },
    { id: 'signs', label: t('navSigns') },
    { id: 'markings', label: t('navMarkings') },
    { id: 'fines', label: t('navFines') },
    { id: 'pmp', label: t('navPmp') }
  ];
  const pills = tabs.map(t =>
    '<button class="mobile-nav-pill'+(activeTab===t.id?' active':'')+'" data-mnav="'+t.id+'">'+t.label+'</button>'
  ).join('');
  return '<div class="mobile-nav-bar">'+pills+'</div>';
}

function hookMobileNav(){
  app.querySelectorAll('[data-mnav]').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.mnav;
      if(id === 'tests') screenHome();
      else if(id === 'rules') screenRules('ch1', '');
      else if(id === 'signs') screenSigns('all', '');
      else if(id === 'markings') screenMarkings('all', '');
      else if(id === 'fines') screenFines('all', '');
      else if(id === 'pmp') screenPmp();
      window.scrollTo({top:0,behavior:'smooth'});
    };
  });
}
`;

// Replace rules code or add screens before screenHome
indexContent = indexContent.replace('function screenHome(){', screensCode + '\nfunction screenHome(){');

// 6. Update screenHome to include the Portal Hub
const hubSvgQuiz = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>';
const hubSvgRules = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
const hubSvgSigns = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="12 2 2 22 22 22"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
const hubSvgMarkings = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
const hubSvgFines = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20"/></svg>';
const hubSvgPmp = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M2 12h20"/></svg>';

const hubCardSnippet = `
    '<section class="portal-hub">'+
      '<h2 class="sec-h">'+t('hubTitle')+'</h2>'+
      '<div class="portal-hub-grid">'+
        '<div class="hub-card" data-hub="rules">'+
          '<div class="hub-card-head">'+
            '<div class="hub-card-icon">${hubSvgRules}</div>'+
            '<div><h3 class="hub-card-title">'+t('hubRules')+'</h3></div>'+
          '</div>'+
          '<p class="hub-card-desc">'+t('hubRulesD')+'</p>'+
          '<div class="hub-card-foot">26 глав · поиск →</div>'+
        '</div>'+
        '<div class="hub-card" data-hub="signs">'+
          '<div class="hub-card-head">'+
            '<div class="hub-card-icon">${hubSvgSigns}</div>'+
            '<div><h3 class="hub-card-title">'+t('hubSigns')+'</h3></div>'+
          '</div>'+
          '<p class="hub-card-desc">'+t('hubSignsD')+'</p>'+
          '<div class="hub-card-foot">256 знаков · 7 групп →</div>'+
        '</div>'+
        '<div class="hub-card" data-hub="markings">'+
          '<div class="hub-card-head">'+
            '<div class="hub-card-icon">${hubSvgMarkings}</div>'+
            '<div><h3 class="hub-card-title">'+t('hubMarkings')+'</h3></div>'+
          '</div>'+
          '<p class="hub-card-desc">'+t('hubMarkingsD')+'</p>'+
          '<div class="hub-card-foot">34 таңба · схемалар →</div>'+
        '</div>'+
        '<div class="hub-card" data-hub="fines">'+
          '<div class="hub-card-head">'+
            '<div class="hub-card-icon">${hubSvgFines}</div>'+
            '<div><h3 class="hub-card-title">'+t('hubFines')+'</h3></div>'+
          '</div>'+
          '<p class="hub-card-desc">'+t('hubFinesD')+'</p>'+
          '<div class="hub-card-foot">ст. 590–615 · калькулятор →</div>'+
        '</div>'+
        '<div class="hub-card" data-hub="pmp">'+
          '<div class="hub-card-head">'+
            '<div class="hub-card-icon">${hubSvgPmp}</div>'+
            '<div><h3 class="hub-card-title">'+t('hubPmp')+'</h3></div>'+
          '</div>'+
          '<p class="hub-card-desc">'+t('hubPmpD')+'</p>'+
          '<div class="hub-card-foot">СЛР · аптечка РК →</div>'+
        '</div>'+
      '</div>'+
    '</section>'+
`;

// Insert mobile nav bar into screenHome hero and portal hub before topics
indexContent = indexContent.replace(
  "'<section class=\"hero\">'+",
  "renderMobileNav('tests') +\n    '<section class=\"hero\">'+"
);

indexContent = indexContent.replace(
  "'<h2 class=\"sec-h\">'+t('topicsH')+'</h2>'+",
  hubCardSnippet + "\n    '<h2 class=\"sec-h\">'+t('topicsH')+'</h2>'+"
);

// Add event handlers for hub cards in screenHome
const hubHandlers = `
  hookMobileNav();
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
`;

indexContent = indexContent.replace(
  "app.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>start('topic',b.dataset.t));",
  "app.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>start('topic',b.dataset.t));\n  " + hubHandlers
);

// 7. Global Top Bar Nav handlers
const navBarGlobalCode = `
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
    window.scrollTo({top:0,behavior:'smooth'});
  };
});
`;

indexContent = indexContent.replace(
  "document.getElementById('home-link').onclick",
  navBarGlobalCode + "\ndocument.getElementById('home-link').onclick"
);

// 8. Update applyLang to update data-t in navigation
indexContent = indexContent.replace(
  "if(bs) bs.textContent = T[LANG].brandSub;",
  "if(bs) bs.textContent = T[LANG].brandSub;\n  document.querySelectorAll('[data-t]').forEach(el => { const k = el.dataset.t; if(T[LANG][k]) el.textContent = T[LANG][k]; });"
);

fs.writeFileSync(indexPath, indexContent);
console.log('Successfully injected portal screens and navigation into index.html');
