const fs = require('fs');
const path = require('path');

const signsData = require('./signs_dataset.json');
const portalData = require('./portal_datasets.json');
const rulesData = require('./rules_data.json');

const indexPath = path.join(__dirname, '../index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// 1. CSS for portal navigation, signs, markings, fines, and PMP
const portalStyles = `
/* ============================================================
   ПОРТАЛ: НАВИГАЦИЯ И РАЗДЕЛЫ
   ============================================================ */
.nav-links{display:flex;gap:6px;align-items:center}
.nav-link{
  background:none;border:0;color:var(--ink-2);padding:8px 12px;border-radius:var(--r-sm);
  font-family:var(--sans);font-size:14.5px;font-weight:500;cursor:pointer;
  display:inline-flex;align-items:center;gap:6px;transition:all .15s ease;text-decoration:none;
}
.nav-link:hover{background:var(--surface-2);color:var(--ink)}
.nav-link.active{background:var(--surface-2);color:var(--accent);font-weight:600}

@media (max-width:960px){
  .nav-links{display:none}
}

/* Мобильная панель навигации (горизонтальный скролл) */
.mobile-nav-bar{
  display:none;background:var(--surface);border-bottom:1px solid var(--line);
  padding:8px 14px;overflow-x:auto;scrollbar-width:none;white-space:nowrap;
  position:sticky;top:54px;z-index:90;-webkit-overflow-scrolling:touch;
}
.mobile-nav-bar::-webkit-scrollbar{display:none}
.mobile-nav-pill{
  display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:20px;
  background:var(--surface-2);color:var(--ink-2);border:1px solid var(--line);
  font-size:13px;font-weight:500;margin-right:6px;cursor:pointer;
}
.mobile-nav-pill.active{background:var(--accent);color:#fff;border-color:var(--accent)}

@media (max-width:960px){
  .mobile-nav-bar{display:flex}
}

/* Витрина разделов (Portal Hub на главной) */
.portal-hub{margin:40px 0 24px}
.portal-hub-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-top:16px}
.hub-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:22px 20px;cursor:pointer;transition:all .18s ease;display:flex;flex-direction:column;gap:10px;
}
.hub-card:hover{border-color:var(--accent);transform:translateY(-2px);box-shadow:var(--shadow)}
.hub-card-head{display:flex;align-items:center;gap:12px}
.hub-card-icon{
  width:42px;height:42px;border-radius:10px;background:var(--accent-soft);color:var(--accent);
  display:flex;align-items:center;justify-content:center;flex:0 0 auto;
}
.hub-card-icon svg{width:22px;height:22px}
.hub-card-title{font-size:17.5px;font-weight:600;color:var(--ink);margin:0}
.hub-card-desc{font-size:14px;line-height:1.55;color:var(--ink-2);margin:0}
.hub-card-foot{margin-top:auto;padding-top:8px;font-family:var(--mono);font-size:12px;color:var(--accent);font-weight:500}

/* Фильтры и вкладки разделов */
.p-filter-bar{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:12px;margin:20px 0 24px;-webkit-overflow-scrolling:touch}
.p-filter-bar::-webkit-scrollbar{display:none}
.p-filter-chip{
  flex:0 0 auto;padding:8px 16px;border-radius:20px;background:var(--surface);
  border:1px solid var(--line);color:var(--ink-2);font-size:13.5px;font-weight:500;cursor:pointer;
  transition:all .15s ease;
}
.p-filter-chip:hover{background:var(--surface-2);color:var(--ink)}
.p-filter-chip.active{background:var(--accent);color:#fff;border-color:var(--accent)}

/* Сетка карточек знаков и разметки */
.signs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-top:16px}
.sign-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:20px;display:flex;flex-direction:column;gap:10px;transition:border-color .15s ease;
}
.sign-card:hover{border-color:var(--accent)}
.sign-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
.sign-num-badge{
  font-family:var(--mono);font-size:12px;font-weight:600;background:var(--surface-2);
  border:1px solid var(--line);padding:3px 8px;border-radius:4px;color:var(--accent);
}
.sign-cat-badge{font-family:var(--mono);font-size:11px;color:var(--ink-3)}
.sign-card-title{font-size:16px;font-weight:600;color:var(--ink);margin:0;line-height:1.4}
.sign-card-desc{font-size:14px;line-height:1.6;color:var(--ink-2);margin:0}

/* Таблица штрафов */
.fines-info-banner{
  background:var(--accent-soft);border:1px solid var(--accent-deep);border-radius:var(--r);
  padding:16px 20px;margin-bottom:24px;font-size:14.5px;line-height:1.6;color:var(--ink);
  display:flex;align-items:center;gap:12px;
}
.fines-info-banner svg{width:22px;height:22px;flex:0 0 auto;color:var(--accent)}

.fines-grid{display:grid;gap:12px;margin-top:16px}
.fine-card{
  background:var(--surface);border:1px solid var(--line);border-radius:var(--r);
  padding:20px 22px;transition:all .15s ease;
}
.fine-card:hover{border-color:var(--accent)}
.fine-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:10px}
.fine-art-badge{
  font-family:var(--mono);font-size:13px;font-weight:600;background:var(--surface-2);
  border:1px solid var(--line);padding:3px 8px;border-radius:4px;color:var(--accent);
}
.fine-price-wrap{text-align:right}
.fine-mrp{font-family:var(--mono);font-size:13px;color:var(--ink-3)}
.fine-sum{font-size:20px;font-weight:700;color:var(--bad);letter-spacing:-.01em}
.fine-sum-disc{font-size:13.5px;color:var(--ok);font-weight:600}
.fine-title{font-size:16px;font-weight:500;color:var(--ink);line-height:1.55;margin:0 0 8px}
.fine-repeat{font-size:13px;color:var(--ink-3);line-height:1.45;border-top:1px solid var(--line);padding-top:8px;margin-top:8px}

/* Раздел ПМП */
.pmp-section{background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:28px 30px;margin-bottom:20px}
.pmp-section h3{font-size:20px;margin:0 0 16px;color:var(--ink)}
.pmp-section p{margin:0 0 12px;color:var(--ink-2);font-size:15.5px;line-height:1.68}
.pmp-section p:last-child{margin-bottom:0}
.pmp-section strong{color:var(--ink);font-weight:600}
`;

// Insert styles before </style>
if (!indexContent.includes('.nav-links')) {
  indexContent = indexContent.replace('</style>', portalStyles + '\n</style>');
}

// 2. Inject Data Objects into script
const dataToInject = `
const FINES_DATA = ${JSON.stringify(portalData.fines)};
const MARKINGS_DATA = ${JSON.stringify(portalData.markings)};
const PMP_DATA = ${JSON.stringify(portalData.pmp)};
const SIGNS_DATA = ${JSON.stringify(signsData)};
const MRP_VALUE = 4325; // 1 МРП в Республике Казахстан на 2026 год
`;

if (!indexContent.includes('const FINES_DATA')) {
  indexContent = indexContent.replace('const EXAM_N = 40', dataToInject + '\nconst EXAM_N = 40');
}

// 3. Update Header markup in index.html to include full navigation bar
const newHeaderBar = `
  <div class="bar-in">
    <a class="brand" id="home-link" aria-label="Jol Ustazy">
      <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="var(--accent-deep)"/>
        <path d="M16 4 L28 28 L20 28 L16 16 L12 28 L4 28 Z" fill="var(--on-accent)"/>
        <line x1="16" y1="18" x2="16" y2="28" stroke="var(--accent-deep)" stroke-width="2" stroke-dasharray="2 2"/>
      </svg>
      <div>
        <b>Jol Ustazy</b>
        <span class="sub" id="brand-sub">тренажёр ПДД РК</span>
      </div>
    </a>

    <nav class="nav-links" id="main-nav">
      <button class="nav-link" data-nav="tests"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg><span data-t="navTests">Тесты</span></button>
      <button class="nav-link" data-nav="rules"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg><span data-t="navRules">Правила</span></button>
      <button class="nav-link" data-nav="signs"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="12 2 2 22 22 22"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span data-t="navSigns">Знаки</span></button>
      <button class="nav-link" data-nav="markings"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg><span data-t="navMarkings">Разметка</span></button>
      <button class="nav-link" data-nav="fines"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20"/></svg><span data-t="navFines">Штрафы</span></button>
      <button class="nav-link" data-nav="pmp"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M2 12h20"/></svg><span data-t="navPmp">ПМП</span></button>
    </nav>

    <div class="actions" id="bar-actions" style="display:flex;gap:8px;align-items:center;padding:0">
      <div id="bar-slot"></div>
      <button class="icon-btn lang-btn" id="lang-btn" title="Тілді ауыстыру / Сменить язык" aria-label="Язык интерфейса">ҚАЗ</button>
      <button class="icon-btn theme-btn" id="theme-btn" title="Тема оформления" aria-label="Тема оформления">
        <svg class="ic-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg class="ic-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
    </div>
  </div>
`;

// Replace <header class="bar">...</header>
indexContent = indexContent.replace(/<header class="bar">[\s\S]*?<\/header>/, '<header class="bar">\n' + newHeaderBar + '\n</header>');

// 4. Update translations in T.ru and T.kk
const portalRu = `
  navTests: 'Тесты',
  navRules: 'Правила',
  navSigns: 'Знаки',
  navMarkings: 'Разметка',
  navFines: 'Штрафы',
  navPmp: 'ПМП',

  hubTitle: 'Разделы портала ПДД',
  hubTests: 'Тренажёр и тесты',
  hubTestsD: '251 вопрос по 12 темам, экзамен по стандарту СпецЦОН, марафон, статистика',
  hubRules: 'Правила движения',
  hubRulesD: 'Полный официальный текст 26 глав ПДД РК с живым поиском и подсветкой',
  hubSigns: 'Дорожные знаки',
  hubSignsD: 'Каталог всех 7 групп знаков (256 знаков) и опознавательных табличек ТС',
  hubMarkings: 'Дорожная разметка',
  hubMarkingsD: 'Горизонтальная и вертикальная разметка со схемами и правилами применения',
  hubFines: 'Таблица штрафов 2026',
  hubFinesD: 'КоАП РК (ст. 590–615), расчет в МРП и тенге (1 МРП = 4 325 ₸), скидка 50%',
  hubPmp: 'Первая помощь и аптечка',
  hubPmpD: 'Алгоритмы СЛР 30:2, остановка кровотечений при ДТП, состав автоаптечки РК',

  signsTitle: 'Каталог дорожных знаков РК',
  signsEyebrow: 'Приложение 1 к ПДД РК · 256 дорожных знаков',
  signsSearchPh: 'Поиск знака по номеру или названию (например: 3.27, стоянка, обгон)...',
  signsFound: 'Найдено знаков: {0}',
  signsEmpty: 'Знаков по запросу «{0}» не найдено',

  markingsTitle: 'Дорожная разметка РК',
  markingsEyebrow: 'Приложение 2 к ПДД РК · Горизонтальная и вертикальная',
  markingsSearchPh: 'Поиск по разметке (например: 1.1, сплошная, зебра)...',

  finesTitle: 'Таблица штрафов за нарушение ПДД РК',
  finesEyebrow: 'КоАП РК · Статьи 590–615 · Актуально на 2026 год',
  finesSearchPh: 'Поиск по статье или нарушению (например: 592, скорость, ремень, парковка)...',
  finesFound: 'Найдено статей: {0}',
  finesEmpty: 'Штрафов по запросу «{0}» не найдено',
  finesBanner: '1 МРП в 2026 году = 4 325 тенге. Согласно ст. 811 КоАП РК, в течение 7 дней действует скидка 50% при оплате штрафа.',
  finesMrp: '{0} МРП',
  finesSum: '{0} ₸',
  finesDiscount: '50% за 7 дней: {0} ₸',

  pmpTitle: 'Первая помощь при ДТП и аптечка',
  pmpEyebrow: 'Медицинские алгоритмы · Приказ Минздрава РК',
`;

const portalKk = `
  navTests: 'Тесттер',
  navRules: 'Ережелер',
  navSigns: 'Белгілер',
  navMarkings: 'Таңбалар',
  navFines: 'Айыппұлдар',
  navPmp: 'АМК',

  hubTitle: 'ЖҚЕ порталының бөлімдері',
  hubTests: 'Тренажер және тесттер',
  hubTestsD: '12 тақырып бойынша 251 сұрақ, Мамандандырылған ХҚКО стандарты бойынша емтихан',
  hubRules: 'Жол жүрісі қағидалары',
  hubRulesD: 'ҚР ЖҚЕ 26 тарауының толық ресми мәтіні, жедел іздеумен',
  hubSigns: 'Жол белгілері',
  hubSignsD: 'Барлық 7 топтағы белгілер каталогы (256 белгі) және көліктің айырым белгілері',
  hubMarkings: 'Жол таңбалары',
  hubMarkingsD: 'Көлденең және тік таңбалардың сипаттамасы мен ережелері',
  hubFines: 'Айыппұлдар кестесі 2026',
  hubFinesD: 'ҚР ӘҚБтК (590–615-баптар), АЕК және теңгемен есептеу (1 АЕК = 4 325 ₸), 50% жеңілдік',
  hubPmp: 'Алғашқы көмек және дәрі қобдишасы',
  hubPmpD: 'ЖКО кезіндегі ЖӨР 30:2 алгоритмдері, қан тоқтату, автодәріхана құрамы',

  signsTitle: 'ҚР Жол белгілерінің каталогы',
  signsEyebrow: 'ҚР ЖҚЕ 1-қосымшасы · 256 жол белгісі',
  signsSearchPh: 'Белгіні нөмірі немесе атауы бойынша іздеу (мысалы: 3.27, тұрақ, басып озу)...',
  signsFound: 'Табылған белгілер: {0}',
  signsEmpty: '«{0}» сұранысы бойынша белгілер табылмады',

  markingsTitle: 'ҚР Жол таңбалары',
  markingsEyebrow: 'ҚР ЖҚЕ 2-қосымшасы · Көлденең және тік таңбалар',
  markingsSearchPh: 'Таңбалар бойынша іздеу (мысалы: 1.1, тұтас, зебра)...',

  finesTitle: 'ҚР ЖҚЕ бұзғаны үшін айыппұлдар кестесі',
  finesEyebrow: 'ҚР ӘҚБтК · 590–615-баптар · 2026 жылға өзекті',
  finesSearchPh: 'Бап немесе бұзушылық бойынша іздеу (мысалы: 592, жылдамдық, белдік, тұрақ)...',
  finesFound: 'Табылған баптар саны: {0}',
  finesEmpty: '«{0}» сұранысы бойынша айыппұлдар табылмады',
  finesBanner: '2026 жылы 1 АЕК = 4 325 теңге. ҚР ӘҚБтК 811-бабына сәйкес 7 күн ішінде 50% жеңілдік қолданылады.',
  finesMrp: '{0} АЕК',
  finesSum: '{0} ₸',
  finesDiscount: '7 күнде 50%: {0} ₸',

  pmpTitle: 'ЖКО кезіндегі алғашқы көмек және дәрі қобдишасы',
  pmpEyebrow: 'Медициналық алгоритмдер · ҚР Денсаулық сақтау министрлігінің бұйрығы',
`;

indexContent = indexContent.replace("rulesToTop:'Наверх ↑',", "rulesToTop:'Наверх ↑',\n" + portalRu);
indexContent = indexContent.replace("rulesToTop:'Жоғарыға ↑',", "rulesToTop:'Жоғарыға ↑',\n" + portalKk);

fs.writeFileSync(indexPath, indexContent);
console.log('Injected styles, data, header, and translations into index.html');
