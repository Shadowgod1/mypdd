const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Find start and end of screenSigns
const start = html.indexOf('function screenSigns(');
const end = html.indexOf('function searchMarkings(');

const newScreenSigns = `function screenSigns(group, query){
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

html = html.slice(0, start) + newScreenSigns + html.slice(end);
fs.writeFileSync(indexPath, html);
console.log('Successfully fixed screenSigns with real SVGs and cheat block!');
