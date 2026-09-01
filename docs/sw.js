/* Офлайн-кэш Jol Ustazy. Версия собирается автоматически. */
const CACHE = 'pdd-b6a8f30581';
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
