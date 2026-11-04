const CACHE = 'tekopora-v4';
const SHELL = ['/-yjv-electricidad/tekopora/', '/-yjv-electricidad/tekopora/index.html', '/-yjv-electricidad/tekopora/privacidad.html', '/-yjv-electricidad/tekopora/manifest.webmanifest', '/-yjv-electricidad/tekopora/logo-emblema.png', '/-yjv-electricidad/tekopora/icon-192.png', '/-yjv-electricidad/tekopora/favicon-48.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('/-yjv-electricidad/tekopora/')))
  );
});
