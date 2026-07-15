/* =========================================================
   Service worker — production caching
   · cache-first   for static (css, js, svg, webp, mp4, woff2)
   · network-first for HTML so updates ship instantly
   · stale-while-revalidate for Google Fonts + SimpleIcons
   · self-cleans old cache versions on activate
   ========================================================= */

const VERSION   = 'v.2026.07-15b';
const STATIC    = `pf-static-${VERSION}`;
const HTML      = `pf-html-${VERSION}`;
const FONTS     = `pf-fonts-${VERSION}`;
const RUNTIME   = `pf-runtime-${VERSION}`;
const KEEP      = new Set([STATIC, HTML, FONTS, RUNTIME]);

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/i18n.js',
  '/js/data.js',
  '/js/main.js',
  '/js/effects.js',
  '/js/sphere.js',
  '/favicon.svg',
  '/og.jpg',
  '/manifest.json',
  '/intro_frames/001.webp',
  '/frames/001.webp',
  '/intro_frames_mobile/001.webp',
  '/frames_mobile/001.webp',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(STATIC);
    await cache.addAll(PRECACHE_URLS).catch(() => {});
    self.skipWaiting();
  })());
});

// Respond to skip-waiting requests so the new SW takes over immediately
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => KEEP.has(k) ? null : caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const accept = req.headers.get('accept') || '';
  const isHTML = accept.includes('text/html');
  const isFont = /fonts\.(gstatic|googleapis)\.com/.test(url.host);
  const isIcons = /cdn\.jsdelivr\.net/.test(url.host);
  const isStatic = sameOrigin && /\.(css|js|svg|woff2?|webp|jpg|jpeg|png|gif|mp4|webm|glb)$/i.test(url.pathname);

  // Never cache the GitHub API, Web3Forms, or jogruber API
  if (/api\.github\.com|web3forms\.com|jogruber\.de/.test(url.host)) return;

  if (isHTML && sameOrigin) {
    e.respondWith(networkFirst(req, HTML));
  } else if (isStatic) {
    e.respondWith(cacheFirst(req, STATIC));
  } else if (isFont || isIcons) {
    e.respondWith(staleWhileRevalidate(req, isFont ? FONTS : RUNTIME));
  }
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch {
    return hit || Response.error();
  }
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch {
    const hit = await cache.match(req);
    return hit || caches.match('/') || Response.error();
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const fetchPromise = fetch(req).then(res => {
    if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  }).catch(() => hit);
  return hit || fetchPromise;
}
