const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Load clean signs dataset
const cleanSigns = JSON.parse(fs.readFileSync('tools/signs_dataset_clean.json', 'utf8'));

// Import sign vector generator
const { generateSignVector } = require('./build_all_signs_svg.js');

// Add vector SVG string to every sign in SIGNS_DATA
const signsWithSvg = cleanSigns.map(s => {
  const svg = generateSignVector(s.num, s.title, s.group);
  return { ...s, svg };
});

const signsJsonStr = JSON.stringify(signsWithSvg);
html = html.replace(/const SIGNS_DATA = \[[\s\S]*?\];/, 'const SIGNS_DATA = ' + signsJsonStr + ';');

// 2. Updated clean styles for dense, balanced, editorial main page & cards
const newDashboardStyles = `
/* ============================================================
   ГЛАВНАЯ СТРАНИЦА: ПЛОТНЫЙ РЕДАКТОРСКИЙ ДАШБОРД (STYLE.md)
   ============================================================ */
.home-hero{margin-bottom:28px}
.home-hero h1{font-size:clamp(34px,4.5vw,48px);line-height:1.15;letter-spacing:-.015em;margin:0 0 12px;color:var(--ink)}
.home-hero p{font-size:16.5px;line-height:1.62;color:var(--ink-2);max-width:72ch;margin:0}

/* Верхний дашборд готовности и быстрых действий */
.home-dash{
  display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:18px;margin-bottom:32px;
}
.dash-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:22px;display:flex;flex-direction:column;justify-content:space-between;gap:14px;box-shadow:var(--shadow);
}
.dash-card-ready{
  display:flex;align-items:center;gap:18px;
}
.dash-ready-t{font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink);letter-spacing:-.01em;line-height:1.25}
.dash-ready-d{font-family:var(--sans);font-size:13.5px;line-height:1.5;color:var(--ink-2);margin-top:4px}
.dash-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:auto}
.dash-stat-box{
  background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:10px 8px;text-align:center;
}
.dash-stat-box b{display:block;font-family:var(--mono);font-size:16px;font-weight:700;color:var(--ink);letter-spacing:-.01em}
.dash-stat-box span{display:block;font-family:var(--mono);font-size:9.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-3);margin-top:3px}
.dash-stat-box.has-err b{color:var(--bad)}

.dash-actions{display:flex;flex-direction:column;gap:8px;justify-content:center}
.dash-btn-primary{
  background:var(--accent-deep);color:var(--on-accent);border:1px solid var(--accent);border-radius:var(--r-sm);
  padding:12px 16px;font-family:var(--sans);font-size:14.5px;font-weight:600;cursor:pointer;
  display:flex;align-items:center;justify-content:space-between;transition:background .15s,transform .15s;
}
.dash-btn-sec{
  background:var(--surface-2);color:var(--ink);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:10px 14px;font-family:var(--sans);font-size:13.5px;font-weight:500;cursor:pointer;
  display:flex;align-items:center;justify-content:space-between;transition:border-color .15s,color .15s;
}
@media (hover:hover){
  .dash-btn-primary:hover{transform:translateY(-1px);box-shadow:var(--shadow)}
  .dash-btn-sec:hover:not([disabled]){border-color:var(--accent);color:var(--accent)}
}

@media (max-width:960px){
  .home-dash{grid-template-columns:1fr;gap:14px}
}

/* Две сбалансированные колонки */
.home-layout{
  display:grid;grid-template-columns:1.15fr .85fr;gap:32px;align-items:start;
}
.home-col{display:flex;flex-direction:column;gap:24px}

/* Карточки режимов */
.mode-card-item{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:22px;cursor:pointer;transition:border-color .18s,transform .18s;
  display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:12px;
}
.mode-card-item.primary{
  background:var(--accent-deep);color:var(--on-accent);border-color:var(--accent);
}
.mode-card-item.primary .m-title{color:var(--on-accent)}
.mode-card-item.primary .m-desc{color:rgba(255,255,255,.85)}
.mode-card-item.primary .m-icon{background:rgba(255,255,255,.15);color:var(--on-accent)}
.mode-card-item.primary .m-arrow{color:var(--on-accent);background:rgba(255,255,255,.2)}

.mode-card-left{display:flex;align-items:center;gap:16px}
.m-icon{
  width:44px;height:44px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid var(--line);
  color:var(--accent);display:flex;align-items:center;justify-content:center;flex:0 0 auto;
}
.m-title{font-family:var(--serif);font-size:18.5px;font-weight:600;letter-spacing:-.01em;color:var(--ink);margin:0}
.m-desc{font-family:var(--sans);font-size:14px;line-height:1.55;color:var(--ink-2);margin:3px 0 0}
.m-arrow{
  width:32px;height:32px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;
  color:var(--ink-3);flex:0 0 auto;
}
.mode-card-item[disabled]{opacity:.45;cursor:not-allowed;pointer-events:none}
@media (hover:hover){
  .mode-card-item:hover:not([disabled]){border-color:var(--accent);transform:translateY(-1px);box-shadow:var(--shadow)}
}

/* Блок полезных советов слева */
.tips-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:22px;
}
.tips-head{font-family:var(--serif);font-size:18px;font-weight:600;letter-spacing:-.01em;color:var(--ink);margin:0 0 12px}
.tips-list{margin:0;padding-left:18px;color:var(--ink-2);font-family:var(--sans);font-size:14px;line-height:1.68}
.tips-list li{margin-bottom:6px}
.tips-list li:last-child{margin-bottom:0}

/* Блок быстрого перехода в справочные разделы справа */
.ref-hub-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.ref-hub-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:14px 16px;cursor:pointer;display:flex;align-items:center;gap:12px;
  transition:border-color .15s,background .15s;
}
.ref-hub-card:hover{border-color:var(--accent);background:var(--surface-2)}
.ref-hub-icon{
  width:32px;height:32px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid var(--line);
  color:var(--accent);display:flex;align-items:center;justify-content:center;flex:0 0 auto;
}
.ref-hub-icon svg{width:16px;height:16px}
.ref-hub-title{font-family:var(--serif);font-size:15px;font-weight:600;color:var(--ink);margin:0}
.ref-hub-sub{font-family:var(--sans);font-size:12px;color:var(--ink-3);margin:2px 0 0}

@media (max-width:960px){
  .home-layout{grid-template-columns:1fr;gap:24px}
  .ref-hub-grid{grid-template-columns:1fr}
}
`;

// Replace custom styles block in index.html
if (html.includes('/* ============================================================') && html.includes('ГЛАВНАЯ СТРАНИЦА:')) {
  html = html.replace(/\/\* ============================================================[\s\S]*?ГЛАВНАЯ СТРАНИЦА:[\s\S]*?<\/style>/, newDashboardStyles + '\n</style>');
} else {
  html = html.replace('</style>', newDashboardStyles + '\n</style>');
}

// 3. Update screenSigns to display authentic SVG for every sign
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
    const figHtml = '<div class="sign-figure-real">' + (s.svg || '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="#1565C0"/></svg>') + '</div>';
    return '<div class="sign-card">'+
      figHtml +
      '<div class="sign-card-head">'+
        '<span class="sign-num-badge">'+esc(s.num)+'</span>'+
        '<span class="sign-cat-badge">'+esc(LANG==='kk'?s.groupTitleKk:s.groupTitle)+'</span>'+
      '</div>'+
      '<h3 class="sign-card-title">'+highlightMatches(s.title, SIGNS_STATE.q)+'</h3>'+
      '<p class="sign-card-desc">'+highlightMatches(s.desc, SIGNS_STATE.q)+'</p>'+
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

// 4. Update screenHome with full-width top dashboard + balanced 2-column layout (no empty holes!)
const newScreenHome = `
function screenHome(){
  barSlot.innerHTML = '';
  const total = Q.length;
  const seen = Object.keys(DB.done).length;
  const exams = DB.exams.length;
  const passed = DB.exams.filter(e=>e.p).length;
  const mist = DB.mistakes.length;

  /* готовность: доля вопросов, отвеченных верно и не висящих в ошибках */
  const good = Q.filter(q=>DB.done[q.id] && DB.done[q.id].ok>0 && !DB.mistakes.includes(q.id)).length;
  const ready = total ? Math.round(good/total*100) : 0;
  const advice = ready===0 ? t('ready0') : (ready<40 ? t('ready1') : (ready<80 ? t('ready2') : t('ready3')));

  const icExam = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>';
  const icMar  = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
  const icErr  = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  const mistLabel = LANG==='kk' ? (mist+' сұрақ') : (mist+' '+plural(mist,['вопрос','вопроса','вопросов']));

  /* последние попытки экзамена */
  const dloc = LANG==='kk' ? 'kk-KZ' : 'ru-RU';
  const exRows = DB.exams.slice(0,4).map(e=>{
    let dd = '';
    try{ dd = new Date(e.d).toLocaleDateString(dloc,{day:'numeric',month:'short'}); }catch(err){ dd = ''; }
    return '<div class="exrow"><span class="exd">'+dd+'</span>'+
           '<span class="exn">'+e.r+'/'+e.n+'</span>'+
           '<span class="exv '+(e.p?'ok':'no')+'">'+(e.p?t('examOk'):t('examNo'))+'</span></div>';
  }).join('');
  const examsBlock = exams ?
    '<div class="tips-card" style="margin-top:20px">'+
      '<h2 class="tips-head" style="margin-bottom:14px">'+t('secExams')+'</h2>'+
      '<div class="exams">'+exRows+'</div>'+
    '</div>' : '';

  /* Тематический зачёт (12 тем) */
  const topicCards = TOPICS.map((x, idx)=>{
    const qs = Q.filter(q=>q.t===x.id);
    const g = qs.filter(q=>DB.done[q.id] && DB.done[q.id].ok>0 && !DB.mistakes.includes(q.id)).length;
    const errInTopic = qs.filter(q=>DB.mistakes.includes(q.id)).length;
    const pct = qs.length ? Math.round(g/qs.length*100) : 0;
    const statusNote = errInTopic > 0 ? ('<span style="color:var(--bad);font-family:var(--mono);font-size:11px;margin-left:6px">· '+errInTopic+' '+(LANG==='kk'?'қате':'ошибок')+'</span>') : '';

    return '<button class="topic" data-topic="'+x.id+'">'+
      '<span class="topic-n">'+(idx+1)+'. '+tn(x.id)+statusNote+'</span>'+
      '<span class="topic-c">'+g+'/'+qs.length+'</span>'+
      '<span class="tprog"><i style="width:'+pct+'%"></i></span>'+
    '</button>';
  }).join('');

  const refHubHtml =
    '<div class="tips-card" style="margin-top:20px">'+
      '<h2 class="tips-head" style="margin-bottom:4px">'+t('hubTitle')+'</h2>'+
      '<div class="ref-hub-grid">'+
        '<div class="ref-hub-card" data-hub="rules">'+
          '<div class="ref-hub-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>'+
          '<div><h3 class="ref-hub-title">'+t('navRules')+'</h3><p class="ref-hub-sub">26 глав ПДД</p></div>'+
        '</div>'+
        '<div class="ref-hub-card" data-hub="signs">'+
          '<div class="ref-hub-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 22 22 22"/></svg></div>'+
          '<div><h3 class="ref-hub-title">'+t('navSigns')+'</h3><p class="ref-hub-sub">224 знака</p></div>'+
        '</div>'+
        '<div class="ref-hub-card" data-hub="markings">'+
          '<div class="ref-hub-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/></svg></div>'+
          '<div><h3 class="ref-hub-title">'+t('navMarkings')+'</h3><p class="ref-hub-sub">34 схемы</p></div>'+
        '</div>'+
        '<div class="ref-hub-card" data-hub="fines">'+
          '<div class="ref-hub-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/></svg></div>'+
          '<div><h3 class="ref-hub-title">'+t('navFines')+'</h3><p class="ref-hub-sub">КоАП РК 2026</p></div>'+
        '</div>'+
      '</div>'+
    '</div>';

  app.innerHTML =
    renderMobileNav('tests') +
    '<section class="home-hero">'+
      '<div class="eyebrow">'+t('heroEyebrow')+'</div>'+
      '<h1>'+t('heroTitle')+'</h1>'+
      '<p>'+t('heroText',total,plural(total,['вопрос','вопроса','вопросов']))+'</p>'+
    '</section>'+

    /* 1. Верхний дашборд готовности и быстрого запуска */
    '<div class="home-dash">'+
      '<div class="dash-card">'+
        '<div class="dash-card-ready">'+
          ringMini(ready)+
          '<div>'+
            '<div class="dash-ready-t">'+t('readyT')+'</div>'+
            '<div class="dash-ready-d">'+t('readySub',good,total)+' · '+advice+'</div>'+
          '</div>'+
        '</div>'+
      '</div>'+

      '<div class="dash-card">'+
        '<div style="font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3)">Статистика базы</div>'+
        '<div class="dash-stats-grid">'+
          '<div class="dash-stat-box"><b>'+seen+'/'+total+'</b><span>'+t('stDone')+'</span></div>'+
          '<div class="dash-stat-box"><b>'+passed+'/'+exams+'</b><span>'+t('stPassed')+'</span></div>'+
          '<div class="dash-stat-box'+(mist?' has-err':'')+'"><b>'+mist+'</b><span>'+t('stErrors')+'</span></div>'+
        '</div>'+
      '</div>'+

      '<div class="dash-card">'+
        '<div style="font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3)">Быстрый запуск</div>'+
        '<div class="dash-actions">'+
          '<button class="dash-btn-primary" data-go="exam"><span>🎓 Начать экзамен</span><span>→</span></button>'+
          '<button class="dash-btn-sec" data-go="marathon"><span>🏃 Марафон ('+total+')</span><span>→</span></button>'+
        '</div>'+
      '</div>'+
    '</div>'+

    /* 2. Две сбалансированные колонки: режимы и советы слева, темы и справочник справа */
    '<div class="home-layout">'+
      '<div class="home-col">'+
        '<div class="sec-h" style="margin-top:0">'+t('modesH')+'</div>'+
        '<div class="modes-list">'+
          '<div class="mode-card-item primary" data-go="exam">'+
            '<div class="mode-card-left">'+
              '<div class="m-icon">'+icExam+'</div>'+
              '<div>'+
                '<h3 class="m-title">'+t('mExam')+'</h3>'+
                '<p class="m-desc">'+t('mExamD',EXAM_N,EXAM_MIN,EXAM_PASS,EXAM_ERR)+'</p>'+
              '</div>'+
            '</div>'+
            '<div class="m-arrow"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg></div>'+
          '</div>'+

          '<div class="mode-card-item" data-go="marathon">'+
            '<div class="mode-card-left">'+
              '<div class="m-icon">'+icMar+'</div>'+
              '<div>'+
                '<h3 class="m-title">'+t('mMar')+'</h3>'+
                '<p class="m-desc">'+t('mMarD',total,plural(total,['вопрос','вопроса','вопросов']))+'</p>'+
              '</div>'+
            '</div>'+
            '<div class="m-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>'+
          '</div>'+

          '<div class="mode-card-item" data-go="mistakes"'+(mist?'':' disabled')+'>'+
            '<div class="mode-card-left">'+
              '<div class="m-icon">'+icErr+'</div>'+
              '<div>'+
                '<h3 class="m-title">'+t('mErr')+'</h3>'+
                '<p class="m-desc">'+(mist ? t('mErrD',mistLabel) : t('mErrEmpty'))+'</p>'+
              '</div>'+
            '</div>'+
            '<div class="m-arrow"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>'+
          '</div>'+
        '</div>'+

        examsBlock +

        '<div class="tips-card" style="margin-top:20px">'+
          '<h2 class="tips-head">Что важно знать перед сдачей</h2>'+
          '<ul class="tips-list">'+
            '<li><strong>СпецЦОН:</strong> билет состоит из 40 вопросов на 40 минут. Порог сдачи — не менее 32 верных ответов (до 8 ошибок).</li>'+
            '<li><strong>Случайный порядок:</strong> варианты ответов перемешиваются при каждом запуске, чтобы вы понимали логику правила, а не заучивали цифру.</li>'+
            '<li><strong>Горячие клавиши:</strong> на клавиатуре нажимайте <code>1</code>–<code>4</code> для выбора ответа и <code>Enter</code> для перехода к следующему.</li>'+
            '<li><strong>Офлайн-работа:</strong> сайт сохраняется в кэше браузера и работает без подключения к интернету.</li>'+
          '</ul>'+
        '</div>'+
      '</div>'+

      '<div class="home-col">'+
        '<div class="sec-h" style="margin-top:0">'+t('secTopics')+'</div>'+
        '<div class="topics">'+topicCards+'</div>'+

        refHubHtml +
      '</div>'+
    '</div>'+

    /* 3. Оговорка и подвал во всю ширину */
    '<div class="note" style="margin-top:36px"><b>'+t('noteB')+'</b> '+t('noteText')+' <button id="about-link" class="linkish">'+t('noteMore')+'</button></div>'+
    '<footer>'+t('footer')+'</footer>';

  hookMobileNav();
  app.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>start(b.dataset.go));
  app.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>start('topic',b.dataset.topic));
  app.querySelectorAll('[data-hub]').forEach(c=>{
    c.onclick = ()=>{
      const h = c.dataset.hub;
      if(h === 'rules') screenRules('ch1', '');
      else if(h === 'signs') screenSigns('all', '');
      else if(h === 'markings') screenMarkings('all', '');
      else if(h === 'fines') screenFines('all', '');
      else if(h === 'pmp') screenPmp();
      window.scrollTo({top:0,behavior:'smooth'});
    };
  });
  document.getElementById('about-link').onclick = screenAbout;
}
`;

const sHomeStart = html.indexOf('function screenHome(');
const sHomeEnd = html.indexOf('function screenQuiz(');
html = html.slice(0, sHomeStart) + newScreenHome.trim() + '\n\n' + html.slice(sHomeEnd);

fs.writeFileSync(indexPath, html);
console.log('Successfully completed full dashboard redesign and embedded all vector sign SVGs!');
