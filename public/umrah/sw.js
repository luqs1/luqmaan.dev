/* Offline support for the umrah guide.
   The page is served from cache first so it opens instantly with no signal,
   then refreshed from the network in the background for next time. */
const CACHE = 'umrah-v1';
const PAGE = '/umrah/';
const ASSETS = [
  PAGE,
  '/umrah/manifest.webmanifest',
  '/umrah/icon-192.png',
  '/umrah/icon-512.png',
  '/umrah/apple-touch-icon.png',
  '/umrah/fonts/alegreya-sans-latin-500.woff2',
  '/umrah/fonts/alegreya-sans-latin-700.woff2',
  '/umrah/fonts/amiri-arabic-700.woff2',
  '/umrah/fonts/archivo-latin-600.woff2',
  '/umrah/fonts/ibm-plex-mono-latin-500.woff2',
  '/umrah/fonts/ibm-plex-mono-latin-600.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('umrah-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.pathname.startsWith('/umrah')) return;

  const isPage = req.mode === 'navigate' || url.pathname === '/umrah' || url.pathname === PAGE || url.pathname === '/umrah/index.html';
  if (isPage) {
    e.respondWith(caches.open(CACHE).then(async cache => {
      const cached = await cache.match(PAGE);
      const fresh = fetch(PAGE, { cache: 'no-cache' })
        .then(res => { if (res.ok && !res.redirected) cache.put(PAGE, res.clone()); return res; })
        .catch(() => null);
      if (cached) { e.waitUntil(fresh); return cached; }
      return (await fresh) || new Response('Offline, and the guide has not been saved yet. Open it once with a connection.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }));
    return;
  }

  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
