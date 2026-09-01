const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Load clean signs dataset
const cleanSigns = JSON.parse(fs.readFileSync('tools/signs_dataset_clean.json', 'utf8'));

// 1. Update SIGNS_DATA in index.html with the clean dataset
const signsJsonStr = JSON.stringify(cleanSigns);
html = html.replace(/const SIGNS_DATA = \[[\s\S]*?\];/, 'const SIGNS_DATA = ' + signsJsonStr + ';');

// 2. Add styles for Full-Width Readiness Banner and Enhanced Signs Screen
const customStyles = `
/* Полноширинный баннер готовности на главной */
.ready-banner{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:24px 32px;margin:24px 0 36px;display:flex;align-items:center;justify-content:space-between;
  gap:32px;flex-wrap:wrap;box-shadow:var(--shadow);
}
.ready-banner-left{display:flex;align-items:center;gap:20px;flex:1 1 360px}
.ready-banner-title{font-family:var(--serif);font-size:22px;font-weight:600;letter-spacing:-.012em;color:var(--ink);margin-bottom:4px}
.ready-banner-sub{font-family:var(--sans);font-size:15px;line-height:1.55;color:var(--ink-2)}
.ready-banner-stats{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.ready-stat-item{
  background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:12px 18px;min-width:100px;text-align:center;
}
.ready-stat-item b{display:block;font-family:var(--mono);font-size:18px;font-weight:700;color:var(--ink);letter-spacing:-.01em}
.ready-stat-item span{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3);margin-top:4px}
.ready-stat-item.has-err b{color:var(--bad)}

@media (max-width:900px){
  .ready-banner{padding:20px;gap:20px}
  .ready-banner-stats{width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .ready-stat-item{min-width:0;padding:10px 8px}
}

/* Карточки режимов тренировки */
.mode-primary{
  background:var(--accent-deep);color:var(--on-accent);border:1px solid var(--accent);border-radius:var(--r);
  padding:24px;display:flex;align-items:center;justify-content:space-between;gap:18px;cursor:pointer;
  transition:all .18s ease;text-align:left;width:100%;box-sizing:border-box;margin-bottom:12px;
}
.mode-primary .m-ic{
  width:44px;height:44px;border-radius:var(--r-sm);background:rgba(255,255,255,.15);
  display:flex;align-items:center;justify-content:center;flex:0 0 auto;color:var(--on-accent);
}
.mode-primary .m-t{font-family:var(--serif);font-size:21px;font-weight:600;letter-spacing:-.012em;display:block;color:var(--on-accent)}
.mode-primary .m-d{font-family:var(--sans);font-size:14.5px;line-height:1.5;color:rgba(255,255,255,.85);margin-top:4px;display:block}
.mode-primary .m-go{
  width:36px;height:36px;border-radius:var(--r-sm);background:rgba(255,255,255,.2);
  display:flex;align-items:center;justify-content:center;color:var(--on-accent);flex:0 0 auto;
}
@media (hover:hover){
  .mode-primary:hover{transform:translateY(-1px);box-shadow:var(--shadow)}
}

.mode-sec{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:18px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;cursor:pointer;
  transition:all .18s ease;text-align:left;width:100%;box-sizing:border-box;margin-bottom:10px;
}
.mode-sec .m-ic{
  width:38px;height:38px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid var(--line);
  display:flex;align-items:center;justify-content:center;flex:0 0 auto;color:var(--accent);
}
.mode-sec .m-t{font-family:var(--serif);font-size:17.5px;font-weight:600;color:var(--ink);display:block}
.mode-sec .m-d{font-family:var(--sans);font-size:13.5px;line-height:1.5;color:var(--ink-2);margin-top:2px;display:block}
.mode-sec .m-go{color:var(--ink-3);display:flex;align-items:center;flex:0 0 auto}
.mode-sec[disabled]{opacity:.45;cursor:not-allowed;pointer-events:none}
@media (hover:hover){
  .mode-sec:hover:not([disabled]){border-color:var(--accent);transform:translateY(-1px);box-shadow:var(--shadow)}
}

/* Карточки знаков (с честной обработкой SVG vs текст) */
.sign-card-noimg{
  background:var(--surface-2);border:1px dashed var(--line-2);border-radius:var(--r-sm);
  padding:10px 14px;font-family:var(--mono);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;
  color:var(--ink-3);text-align:center;margin-bottom:6px;
}
.sign-figure-real{
  display:flex;align-items:center;justify-content:center;
  background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:14px;min-height:84px;margin-bottom:6px;
}
.sign-figure-real svg{width:56px;height:56px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.25))}

/* Блок шпаргалки "Легко перепутать" в разделе знаков */
.signs-cheat-wrap{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:24px;margin-bottom:28px;
}
.signs-cheat-head{font-family:var(--serif);font-size:20px;font-weight:600;letter-spacing:-.012em;color:var(--ink);margin:0 0 16px}
.signs-cheat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.signs-cheat-item{
  background:var(--surface-2);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:16px;display:flex;flex-direction:column;gap:10px;
}
.signs-cheat-pair{display:flex;gap:12px;align-items:center}
.signs-cheat-pair svg{width:46px;height:46px;flex:0 0 auto}
.signs-cheat-desc{font-family:var(--sans);font-size:13.5px;line-height:1.55;color:var(--ink-2);margin:0}
`;

// Replace previous custom styles or append
if (html.includes('/* Полноширинный баннер готовности на главной */')) {
  html = html.replace(/\/\* Полноширинный баннер готовности на главной \*\/[\s\S]*?<\/style>/, customStyles + '\n</style>');
} else {
  html = html.replace('</style>', customStyles + '\n</style>');
}

// 3. Update dictionary T if needed for extra strings
html = html.replace("mErrEmpty:'Пока пусто. Сначала пройдите тест',", "mErrEmpty:'Ошибок нет. Все пройденные вопросы усвоены',");
html = html.replace("mErrEmpty:'Әзірге бос. Алдымен тест тапсырыңыз',", "mErrEmpty:'Қателер жоқ. Барлық сұрақтар игерілді',");

// 4. Update screenSigns to include "Легко перепутать" at the top and real SVG symbols
const screenSignsCode = `
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
    let figHtml = '';
    if(s.svgId){
      figHtml = '<div class="sign-figure-real"><svg viewBox="0 0 60 60"><use href="#'+s.svgId+'"/></svg></div>';
    } else {
      figHtml = '<div class="sign-card-noimg">Изображение добавляется</div>';
    }
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

// Replace screenSigns in index.html
html = html.replace(/function screenSigns\([\s\S]*?\n\}\n(?=let MARKINGS_STATE)/, screenSignsCode.trim() + '\n\n');

// 5. Update screenHome with full-width readiness banner, clear training hierarchy, and smart topics list
const screenHomeCode = `
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
  const exRows = DB.exams.slice(0,5).map(e=>{
    let dd = '';
    try{ dd = new Date(e.d).toLocaleDateString(dloc,{day:'numeric',month:'long'}); }catch(err){ dd = ''; }
    return '<div class="exrow"><span class="exd">'+dd+'</span>'+
           '<span class="exn">'+e.r+'/'+e.n+'</span>'+
           '<span class="exv '+(e.p?'ok':'no')+'">'+(e.p?t('examOk'):t('examNo'))+'</span></div>';
  }).join('');
  const examsBlock = exams ? '<div class="sec-h" style="margin-top:28px">'+t('secExams')+'</div><div class="exams">'+exRows+'</div>' : '';

  /* Умная сортировка и подсветка тем */
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

  app.innerHTML =
    renderMobileNav('tests') +
    '<section class="hero">'+
      '<div class="eyebrow">'+t('heroEyebrow')+'</div>'+
      '<h1>'+t('heroTitle')+'</h1>'+
      '<p>'+t('heroText',total,plural(total,['вопрос','вопроса','вопросов']))+'</p>'+
    '</section>'+

    /* 1. Полноширинный статус готовности */
    '<div class="ready-banner">'+
      '<div class="ready-banner-left">'+
        ringMini(ready)+
        '<div>'+
          '<div class="ready-banner-title">'+t('readyT')+'</div>'+
          '<div class="ready-banner-sub">'+t('readySub',good,total)+' · '+advice+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="ready-banner-stats">'+
        '<div class="ready-stat-item"><b>'+seen+'/'+total+'</b><span>'+t('stDone')+'</span></div>'+
        '<div class="ready-stat-item"><b>'+passed+'/'+exams+'</b><span>'+t('stPassed')+'</span></div>'+
        '<div class="ready-stat-item'+(mist?' has-err':'')+'"><b>'+mist+'</b><span>'+t('stErrors')+'</span></div>'+
      '</div>'+
    '</div>'+

    /* 2. Две сбалансированные колонки: режимы слева, темы справа */
    '<div class="home-grid">'+
      '<div class="home-a">'+
        '<div class="sec-h" style="margin-top:0">'+t('modesH')+'</div>'+
        '<div class="modes">'+
          '<button class="mode-primary" data-go="exam">'+
            '<div style="display:flex;align-items:center;gap:16px">'+
              '<span class="m-ic">'+icExam+'</span>'+
              '<div>'+
                '<span class="m-t">'+t('mExam')+'</span>'+
                '<span class="m-d">'+t('mExamD',EXAM_N,EXAM_MIN,EXAM_PASS,EXAM_ERR)+'</span>'+
              '</div>'+
            '</div>'+
            '<span class="m-go"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></span>'+
          '</button>'+

          '<button class="mode-sec" data-go="marathon">'+
            '<div style="display:flex;align-items:center;gap:14px">'+
              '<span class="m-ic">'+icMar+'</span>'+
              '<div>'+
                '<span class="m-t">'+t('mMar')+'</span>'+
                '<span class="m-d">'+t('mMarD',total,plural(total,['вопрос','вопроса','вопросов']))+'</span>'+
              '</div>'+
            '</div>'+
            '<span class="m-go"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></span>'+
          '</button>'+

          '<button class="mode-sec" data-go="mistakes"'+(mist?'':' disabled')+'>'+
            '<div style="display:flex;align-items:center;gap:14px">'+
              '<span class="m-ic">'+icErr+'</span>'+
              '<div>'+
                '<span class="m-t">'+t('mErr')+'</span>'+
                '<span class="m-d">'+(mist ? t('mErrD',mistLabel) : t('mErrEmpty'))+'</span>'+
              '</div>'+
            '</div>'+
            '<span class="m-go"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg></span>'+
          '</button>'+
        '</div>'+

        examsBlock +
      '</div>'+

      '<div class="home-b">'+
        '<div class="sec-h" style="margin-top:0">'+t('secTopics')+'</div>'+
        '<div class="topics">'+topicCards+'</div>'+
      '</div>'+
    '</div>'+

    /* 3. Оговорка и подвал во всю ширину */
    '<div class="note"><b>'+t('noteB')+'</b> '+t('noteText')+' <button id="about-link" class="linkish">'+t('noteMore')+'</button></div>'+
    '<footer>'+t('footer')+'</footer>';

  hookMobileNav();
  app.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>start(b.dataset.go));
  app.querySelectorAll('[data-topic]').forEach(b=>b.onclick=()=>start('topic',b.dataset.topic));
  document.getElementById('about-link').onclick = screenAbout;
}
`;

// Replace screenHome in index.html
html = html.replace(/function screenHome\(\)\{[\s\S]*?\n\}\n(?=function screenQuiz)/, screenHomeCode.trim() + '\n\n');

fs.writeFileSync(indexPath, html);
console.log('Successfully completed refactoring of screenHome and signs catalog!');
