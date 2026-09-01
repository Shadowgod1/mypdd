const fs = require('fs');
const path = require('path');
const rulesData = require('./rules_data.json');

const indexPath = path.join(__dirname, '../index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// 1. Add CSS styles before </style>
const stylesToAdd = `
/* ---------- раздел ПДД / справочник правил ---------- */
.rules-bar{display:flex;gap:12px;align-items:center;margin:28px 0 20px;flex-wrap:wrap}
.rules-search-wrap{flex:1 1 280px;position:relative}
.rules-search-input{
  width:100%;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:12px 16px 12px 42px;font-size:15.5px;color:var(--ink);font-family:inherit;
  outline:none;box-sizing:border-box;transition:border-color .15s ease,box-shadow .15s ease;
}
.rules-search-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(34,164,93,.15)}
.rules-search-ic{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--ink-3);pointer-events:none}
.rules-search-clear{
  position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:0;
  color:var(--ink-3);cursor:pointer;padding:4px 8px;font-size:14px;border-radius:50%;
}
.rules-search-clear:hover{color:var(--ink)}

.rules-layout{display:grid;grid-template-columns:310px minmax(0,1fr);gap:32px;align-items:start;margin-top:16px}
.rules-sidebar{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:14px 10px;position:sticky;top:80px;max-height:calc(100vh - 100px);
  overflow-y:auto;scrollbar-width:thin;
}
.rules-part-title{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--ink-3);padding:14px 10px 6px;border-top:1px solid var(--line);margin-top:6px;
}
.rules-part-title:first-child{border-top:0;margin-top:0;padding-top:4px}
.rules-ch-item{
  display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;
  background:none;border:0;border-radius:var(--r-sm);padding:8px 10px;margin-bottom:2px;
  font-size:13.5px;color:var(--ink-2);cursor:pointer;line-height:1.35;transition:all .12s ease;
}
.rules-ch-item:hover{background:var(--surface-2);color:var(--ink)}
.rules-ch-item.active{background:var(--accent);color:#fff;font-weight:500}
.rules-ch-item .badge{
  font-family:var(--mono);font-size:11px;opacity:.75;margin-left:6px;flex:0 0 auto;
}

.rules-reader{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:36px 40px 44px}
.rules-ch-header{margin-bottom:28px;padding-bottom:18px;border-bottom:1px solid var(--line)}
.rules-part-badge{
  font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--accent);margin-bottom:8px;display:inline-block;
}
.rules-ch-header h2{font-size:24px;margin:0;line-height:1.3;letter-spacing:-.02em}

.clause{margin-bottom:20px;line-height:1.72;font-size:16px;color:var(--ink);border-radius:6px;transition:background .25s ease}
.clause.flash{background:rgba(34,164,93,.22);padding:4px 8px;margin-left:-8px;margin-right:-8px}
.clause-num{
  display:inline-block;font-family:var(--mono);font-size:12.5px;font-weight:600;
  background:var(--surface-2);border:1px solid var(--line);padding:2px 7px;
  border-radius:4px;color:var(--accent);margin-right:8px;vertical-align:baseline;
}
.clause-footnote{
  background:var(--surface-2);border-left:3px solid var(--line-2);
  padding:9px 13px;border-radius:0 6px 6px 0;font-size:13px;
  color:var(--ink-3);margin:12px 0 18px;line-height:1.55;
}

.rules-search-stat{font-size:15px;color:var(--ink-2);margin-bottom:16px}
.rules-search-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r-sm);
  padding:16px 18px;margin-bottom:10px;cursor:pointer;transition:border-color .15s ease,transform .15s ease;
}
.rules-search-card:hover{border-color:var(--accent);transform:translateY(-1px)}
.rules-search-meta{display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap}
.rules-search-ch{font-family:var(--mono);font-size:11.5px;color:var(--accent);font-weight:500}
.rules-search-txt{font-size:15px;line-height:1.6;color:var(--ink)}

mark.hl{background:rgba(240,180,28,.35);color:inherit;padding:0 2px;border-radius:3px}

.ch-nav-bar{
  display:flex;justify-content:space-between;align-items:center;margin-top:36px;
  padding-top:22px;border-top:1px solid var(--line);gap:10px;flex-wrap:wrap;
}
.ch-mobile-sel{
  display:none;width:100%;background:var(--surface);border:1px solid var(--line);
  border-radius:var(--r-sm);padding:10px 14px;color:var(--ink);font-size:14.5px;margin-bottom:14px;
}
.rules-nav-btn{width:auto!important;min-width:auto!important;padding:0 12px!important;display:inline-flex;align-items:center;gap:6px}
@media (max-width:900px){
  .rules-layout{display:block}
  .rules-sidebar{display:none}
  .ch-mobile-sel{display:block}
  .rules-reader{padding:24px 18px 28px}
}
`;

if (!indexContent.includes('.rules-layout')) {
  indexContent = indexContent.replace('</style>', stylesToAdd + '\n</style>');
}

// 2. Add header button if not present
if (!indexContent.includes('id="rules-nav-btn"')) {
  indexContent = indexContent.replace(
    '<button class="icon-btn lang-btn"',
    '<button class="icon-btn rules-nav-btn" id="rules-nav-btn" title="Текст ПДД" aria-label="Текст ПДД"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span id="rules-btn-lbl">ПДД</span></button><button class="icon-btn lang-btn"'
  );
}

// 3. Inject RULES_DATA into script
const rulesDataStr = `const RULES_DATA = ${JSON.stringify(rulesData)};\n`;

// 4. Update T.ru and T.kk
const ruTranslations = `
  mRules:'Текст ПДД РК',
  mRulesD:'Все 26 глав правил, знаки, разметка, допуск ТС и неисправности с поиском',
  rulesNavLbl:'ПДД',
  rulesTitle:'Правила дорожного движения РК',
  rulesEyebrow:'Официальный текст · приказ МВД РК № 534',
  rulesSearchPh:'Поиск по тексту правил (например: 140, буксировка, стоянка)...',
  rulesSearchResults:'Найдено пунктов: {0}',
  rulesSearchEmpty:'По запросу «{0}» ничего не найдено',
  rulesPrevCh:'← Предыдущая',
  rulesNextCh:'Следующая →',
  rulesToTop:'Наверх ↑',
`;

const kkTranslations = `
  mRules:'ҚР ЖҚЕ ережелері',
  mRulesD:'Ережелердің толық 26 тарауы, белгілер, таңбалар, жіберу және ақаулар тізбесі',
  rulesNavLbl:'ЖҚЕ',
  rulesTitle:'ҚР Жол жүрісі қағидалары',
  rulesEyebrow:'Ресми мәтін · ҚР ІІМ № 534 бұйрығы',
  rulesSearchPh:'Ережелер бойынша іздеу (мысалы: 140, сүйреу, тұрақ)...',
  rulesSearchResults:'Табылған тармақтар саны: {0}',
  rulesSearchEmpty:'«{0}» сұранысы бойынша ештеңе табылмады',
  rulesPrevCh:'← Алдыңғысы',
  rulesNextCh:'Келесісі →',
  rulesToTop:'Жоғарыға ↑',
`;

// Insert translations into T.ru and T.kk
indexContent = indexContent.replace("mErrEmpty:'Пока пусто. Сначала пройдите тест',", "mErrEmpty:'Пока пусто. Сначала пройдите тест',\n" + ruTranslations);
indexContent = indexContent.replace("mErrEmpty:'Әзірге бос. Алдымен тест тапсырыңыз',", "mErrEmpty:'Әзірге бос. Алдымен тест тапсырыңыз',\n" + kkTranslations);

// Insert RULES_DATA before const EXAM_N
indexContent = indexContent.replace('const EXAM_N = 40', rulesDataStr + '\nconst EXAM_N = 40');

// Add RULES logic and screenRules
const rulesCode = `
/* ============================================================
   РАЗДЕЛ ПРАВИЛ ПДД
   ============================================================ */
let RULES_STATE = { chId: 'ch1', q: '', targetPIdx: null };

function stemRu(w){
  return w.toLowerCase()
    .replace(/(?:ся|сь)$/, '')
    .replace(/(?:иями|ями|ами|ого|его|ому|ему|ыми|ими|ях|ах|ов|ев|ей|ия|ья|ие|ье|ые|ое|ее|ам|ям|ом|ем|а|е|и|й|о|у|ы|ь|ю|я)$/, '');
}

function searchRules(query){
  const q = query.trim().toLowerCase();
  if(!q) return [];
  const words = q.split(/\\s+/).filter(Boolean);
  const stems = words.map(stemRu).filter(s=>s.length>=2);
  const results = [];

  RULES_DATA.forEach(ch=>{
    ch.paragraphs.forEach((p, pIdx)=>{
      const fullText = (ch.title + ' ' + p.text).toLowerCase();
      const match = stems.every(st => fullText.includes(st) || (st.includes('самокат') && fullText.includes('самокат')));
      if(match){
        results.push({
          chapterId: ch.id,
          chapterTitle: ch.title,
          partTitle: LANG==='kk' ? ch.partTitleKk : ch.partTitle,
          pIdx,
          paragraph: p
        });
      }
    });
  });
  return results;
}

function highlightMatches(text, query){
  const words = query.trim().split(/\\s+/).filter(w=>w.length>=2);
  if(!words.length) return esc(text);
  const stems = words.map(stemRu).filter(s=>s.length>=2);
  let escaped = esc(text);
  stems.forEach(st=>{
    try{
      const re = new RegExp('(' + st.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&') + '[а-яa-z0-9]*)', 'gi');
      escaped = escaped.replace(re, '<mark class="hl">$1</mark>');
    }catch(e){}
  });
  return escaped;
}

function screenRules(chId, query, targetPIdx){
  S = null; stopTimer(); barSlot.innerHTML = '';
  if(chId) RULES_STATE.chId = chId;
  if(query !== undefined) RULES_STATE.q = query;
  if(targetPIdx !== undefined) RULES_STATE.targetPIdx = targetPIdx;

  const curCh = RULES_DATA.find(c=>c.id===RULES_STATE.chId) || RULES_DATA[0];
  const curIdx = RULES_DATA.indexOf(curCh);
  const prevCh = curIdx > 0 ? RULES_DATA[curIdx-1] : null;
  const nextCh = curIdx < RULES_DATA.length-1 ? RULES_DATA[curIdx+1] : null;

  const isSearching = !!(RULES_STATE.q && RULES_STATE.q.trim());
  const searchResults = isSearching ? searchRules(RULES_STATE.q) : [];

  // Group chapters by part for sidebar
  const parts = [];
  RULES_DATA.forEach(c=>{
    let p = parts.find(x=>x.id===c.partId);
    if(!p){
      p = { id:c.partId, title: (LANG==='kk'?c.partTitleKk:c.partTitle), chapters:[] };
      parts.push(p);
    }
    p.chapters.push(c);
  });

  const sidebarHtml = parts.map(p=>{
    const items = p.chapters.map(c=>
      '<button class="rules-ch-item'+(c.id===curCh.id&&!isSearching?' active':'')+'" data-chid="'+c.id+'">'+
        '<span>'+esc(c.title)+'</span>'+
        '<span class="badge">'+c.paragraphs.length+'</span>'+
      '</button>'
    ).join('');
    return '<div class="rules-part-title">'+esc(p.title)+'</div>'+items;
  }).join('');

  const mobileOptions = RULES_DATA.map(c=>
    '<option value="'+c.id+'"'+(c.id===curCh.id?' selected':'')+'>'+esc(c.title)+'</option>'
  ).join('');

  let bodyContent = '';
  if(isSearching){
    if(searchResults.length){
      const cards = searchResults.map(r=>
        '<div class="rules-search-card" data-jump-ch="'+r.chapterId+'" data-jump-pidx="'+r.pIdx+'">'+
          '<div class="rules-search-meta">'+
            '<span class="rules-search-ch">'+esc(r.partTitle)+' · '+esc(r.chapterTitle)+'</span>'+
            (r.paragraph.num ? '<span class="clause-num">п. '+esc(r.paragraph.num)+'</span>' : '')+
          '</div>'+
          '<div class="rules-search-txt">'+highlightMatches(r.paragraph.text, RULES_STATE.q)+'</div>'+
        '</div>'
      ).join('');
      bodyContent = '<div class="rules-search-stat">'+t('rulesSearchResults', searchResults.length)+'</div>'+
                    '<div class="rules-search-results">'+cards+'</div>';
    } else {
      bodyContent = '<div class="rules-search-stat">'+t('rulesSearchEmpty', esc(RULES_STATE.q))+'</div>';
    }
  } else {
    const paragraphsHtml = curCh.paragraphs.map((p, idx)=>{
      if(p.isFootnote){
        return '<div class="clause-footnote" id="p-'+idx+'">'+esc(p.text)+'</div>';
      }
      return '<div class="clause'+(RULES_STATE.targetPIdx===idx?' flash':'')+'" id="p-'+idx+'">'+
        (p.num ? '<span class="clause-num">п. '+esc(p.num)+'</span>' : '')+
        '<span>'+esc(p.text)+'</span>'+
      '</div>';
    }).join('');

    bodyContent =
      '<div class="rules-ch-header">'+
        '<span class="rules-part-badge">'+esc(LANG==='kk'?curCh.partTitleKk:curCh.partTitle)+'</span>'+
        '<h2>'+esc(curCh.title)+'</h2>'+
      '</div>'+
      '<div class="rules-clauses">'+paragraphsHtml+'</div>'+
      '<div class="ch-nav-bar">'+
        (prevCh ? '<button class="btn ghost" data-chid="'+prevCh.id+'">'+t('rulesPrevCh')+'</button>' : '<div></div>')+
        '<button class="btn ghost" id="scroll-top-btn">'+t('rulesToTop')+'</button>'+
        (nextCh ? '<button class="btn" data-chid="'+nextCh.id+'">'+t('rulesNextCh')+'</button>' : '<div></div>')+
      '</div>';
  }

  const searchSvg = '<svg class="rules-search-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>';

  app.innerHTML =
    '<section class="hero rules-hero">'+
      '<div class="eyebrow">'+t('rulesEyebrow')+'</div>'+
      '<h1>'+t('rulesTitle')+'</h1>'+
    '</section>'+
    '<div class="rules-bar">'+
      '<button class="btn ghost" id="rules-back-btn" style="min-width:auto;padding:0 18px">← '+t('toHome')+'</button>'+
      '<div class="rules-search-wrap">'+
        searchSvg+
        '<input type="search" class="rules-search-input" id="rules-search-inp" placeholder="'+t('rulesSearchPh')+'" value="'+esc(RULES_STATE.q)+'">'+
        (RULES_STATE.q ? '<button class="rules-search-clear" id="rules-clear-btn" title="Очистить">✕</button>' : '')+
      '</div>'+
    '</div>'+
    '<select class="ch-mobile-sel" id="ch-mobile-select">'+mobileOptions+'</select>'+
    '<div class="rules-layout">'+
      '<aside class="rules-sidebar">'+sidebarHtml+'</aside>'+
      '<main class="rules-reader">'+bodyContent+'</main>'+
    '</div>';

  // Event handlers
  document.getElementById('rules-back-btn').onclick = ()=>{ screenHome(); window.scrollTo({top:0,behavior:'smooth'}); };
  
  const searchInp = document.getElementById('rules-search-inp');
  searchInp.oninput = (e)=>{
    screenRules(RULES_STATE.chId, e.target.value);
    const inp = document.getElementById('rules-search-inp');
    if(inp){ inp.focus(); inp.selectionStart = inp.selectionEnd = inp.value.length; }
  };

  const clearBtn = document.getElementById('rules-clear-btn');
  if(clearBtn){
    clearBtn.onclick = ()=>{ screenRules(RULES_STATE.chId, ''); };
  }

  const mobSel = document.getElementById('ch-mobile-select');
  if(mobSel){
    mobSel.onchange = (e)=>{ screenRules(e.target.value, ''); window.scrollTo({top:180,behavior:'smooth'}); };
  }

  app.querySelectorAll('[data-chid]').forEach(b=>{
    b.onclick = ()=>{
      screenRules(b.dataset.chid, '');
      window.scrollTo({top:180,behavior:'smooth'});
    };
  });

  app.querySelectorAll('[data-jump-ch]').forEach(card=>{
    card.onclick = ()=>{
      const cId = card.dataset.jumpCh;
      const pIdx = +card.dataset.jumpPidx;
      screenRules(cId, '', pIdx);
      setTimeout(()=>{
        const el = document.getElementById('p-'+pIdx);
        if(el){
          el.scrollIntoView({behavior:'smooth', block:'center'});
          el.classList.add('flash');
          setTimeout(()=>el.classList.remove('flash'), 2500);
        }
      }, 50);
    };
  });

  const topBtn = document.getElementById('scroll-top-btn');
  if(topBtn){
    topBtn.onclick = ()=>window.scrollTo({top:180,behavior:'smooth'});
  }

  if(RULES_STATE.targetPIdx !== null && !isSearching){
    setTimeout(()=>{
      const el = document.getElementById('p-'+RULES_STATE.targetPIdx);
      if(el){
        el.scrollIntoView({behavior:'smooth', block:'center'});
        setTimeout(()=>el.classList.remove('flash'), 2500);
      }
      RULES_STATE.targetPIdx = null;
    }, 60);
  }
}
`;

indexContent = indexContent.replace('function screenHome(){', rulesCode + '\nfunction screenHome(){');

// 5. Update screenHome to include the Rules mode card
const icRules = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;

indexContent = indexContent.replace(
  "modeCard('',icMar,t('mMar'),t('mMarD',total,plural(total,['вопрос','вопроса','вопросов'])),'data-go=\"marathon\"')+",
  "modeCard('',icMar,t('mMar'),t('mMarD',total,plural(total,['вопрос','вопроса','вопросов'])),'data-go=\"marathon\"')+\n       modeCard('','${icRules}',t('mRules'),t('mRulesD'),'data-go=\"rules\"')+"
);

indexContent = indexContent.replace(
  "app.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>start(b.dataset.go));",
  "app.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ if(b.dataset.go==='rules') screenRules('ch1',''); else start(b.dataset.go); });"
);

// 6. Hook header rules button
indexContent = indexContent.replace(
  "document.getElementById('home-link').onclick",
  "const rNav = document.getElementById('rules-nav-btn'); if(rNav) rNav.onclick = ()=>{ screenRules('ch1',''); window.scrollTo({top:0,behavior:'smooth'}); };\n\ndocument.getElementById('home-link').onclick"
);

// 7. Update applyLang to update rules-btn-lbl
indexContent = indexContent.replace(
  "if(bs) bs.textContent = T[LANG].brandSub;",
  "if(bs) bs.textContent = T[LANG].brandSub;\n  const rl = document.getElementById('rules-btn-lbl'); if(rl) rl.textContent = T[LANG].rulesNavLbl;"
);

fs.writeFileSync(indexPath, indexContent);
console.log('Successfully written updated index.html! New size:', fs.statSync(indexPath).size);
