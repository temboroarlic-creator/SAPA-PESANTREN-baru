/* SAPA Pesantren — service worker. Halaman selalu diambil dari internet dulu (tidak basi). Data Google tidak pernah disimpan. */
const VER = 'sapa-v10';
const SHELL = ['index.html', 'kiosk.html', 'manifest.json', 'manifest-kiosk.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const host = new URL(req.url).hostname;
  if (host.endsWith('google.com') || host.endsWith('googleusercontent.com')) return;
  if (new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(r => { if (r.ok) { const cp = r.clone(); caches.open(VER).then(c => c.put(req, cp)); } return r; }).catch(() => caches.match(req)));
});
