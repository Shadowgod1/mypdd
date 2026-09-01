/* Сборка статического сайта для GitHub Pages из index.html.
   index.html — источник правды и одновременно версия для артефакта
   (фрагмент без <html>/<head>/<body>). Здесь он оборачивается
   в полноценный документ и дополняется манифестом и офлайн-кэшем.

   Запуск:  node tools/build.js
*/
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/* ---------- настройки проекта: имя меняется здесь и больше нигде ---------- */
const CFG = {
  name:      'Jol Ustazy',
  shortName: 'Jol Ustazy',
  descRu:    'Готовимся к теории ПДД Казахстана. 251 вопрос, у каждого объяснение, почему ответ именно такой. Бесплатно, без регистрации, работает без интернета.',
  descKk:    'Қазақстан ЖҚЕ теориясына дайындық. 251 сұрақ, әрқайсысында жауаптың неге дәл солай екені түсіндірілген. Тегін, тіркелусіз, интернетсіз жұмыс істейді.',
  lang:      'ru',
  themeDark: '#0A120E',
  themeLight:'#F2F0E9',
  /* адрес поставим, когда появится домен; пока оставляем пустым */
  siteUrl:   ''
};

const ROOT = path.join(__dirname, '..');
const OUT  = path.join(ROOT, 'docs');

const src = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* делим фрагмент на то, что относится к <head>, и на содержимое страницы */
const splitAt = src.indexOf('<header class="bar">');
if (splitAt < 0) throw new Error('не найдено начало разметки страницы');
const headPart = src.slice(0, splitAt).trim();
const bodyPart = src.slice(splitAt).trim();

const doc = `<!doctype html>
<html lang="${CFG.lang}">
<head>
<meta charset="utf-8">
<meta name="theme-color" content="${CFG.themeDark}">
<meta name="color-scheme" content="dark light">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="${CFG.shortName}">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:title" content="${CFG.name}">
<meta property="og:description" content="${CFG.descRu}">
<meta property="og:locale" content="ru_RU">
<meta property="og:locale:alternate" content="kk_KZ">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
${headPart}
</head>
<body>
${bodyPart}
<script>
/* офлайн-режим: регистрируем service worker, если браузер это умеет */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
}
</script>
</body>
</html>
`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), doc, 'utf8');

/* версия кэша завязана на содержимое: обновили сайт — обновился кэш */
const ver = crypto.createHash('sha1').update(doc).digest('hex').slice(0, 10);

const manifest = {
  name: CFG.name,
  short_name: CFG.shortName,
  description: CFG.descRu,
  lang: CFG.lang,
  dir: 'ltr',
  start_url: '.',
  scope: '.',
  display: 'standalone',
  orientation: 'portrait',
  background_color: CFG.themeDark,
  theme_color: CFG.themeDark,
  icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
};
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');

const sw = `/* Офлайн-кэш ${CFG.name}. Версия собирается автоматически. */
const CACHE = 'pdd-${ver}';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  /* страницу берём из сети, но при её отсутствии отдаём копию из кэша */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('./index.html', c)); return r; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  /* шрифты и иконки — сначала кэш, так быстрее и работает без сети */
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(r => {
        if (r.ok && (req.url.startsWith(self.location.origin) || req.url.indexOf('fonts.') > -1)) {
          const c = r.clone();
          caches.open(CACHE).then(x => x.put(req, c));
        }
        return r;
      }).catch(() => new Response('', { status: 504, statusText: 'offline' }));
    })
  );
});
`;
fs.writeFileSync(path.join(OUT, 'sw.js'), sw, 'utf8');

/* GitHub Pages: не пропускать файлы через Jekyll */
fs.writeFileSync(path.join(OUT, '.nojekyll'), '', 'utf8');

/* страница 404 — просто возвращаем на главную */
fs.writeFileSync(path.join(OUT, '404.html'),
`<!doctype html><html lang="ru"><head><meta charset="utf-8">
<title>${CFG.name}</title><meta http-equiv="refresh" content="0; url=./"></head>
<body><p>Страница не найдена. <a href="./">На главную</a>.</p></body></html>
`, 'utf8');

fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n', 'utf8');

const kb = n => Math.round(fs.statSync(path.join(OUT, n)).size / 1024 * 10) / 10;
console.log('Собрано в docs/');
console.log('  index.html            ' + kb('index.html') + ' КБ');
console.log('  manifest.webmanifest  ' + kb('manifest.webmanifest') + ' КБ');
console.log('  sw.js                 ' + kb('sw.js') + ' КБ  (кэш pdd-' + ver + ')');
console.log('  404.html, robots.txt, .nojekyll, иконки');
