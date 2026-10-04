// Service worker offline-first: la app abre aunque no haya señal.
const CACHE = 'sitrack-v1'

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    const html = await (await fetch('./index.html', { cache: 'no-cache' })).text()
    const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map((m) => m[1])
    await cache.addAll(['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', ...assets])
    self.skipWaiting()
  })())
})

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k)
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return
  if (req.mode === 'navigate') {
    // Red primero para tener la última versión; si no hay señal, la copia guardada.
    e.respondWith(fetch(req).then((r) => {
      const copia = r.clone()
      caches.open(CACHE).then((c) => c.put('./index.html', copia))
      return r
    }).catch(() => caches.match('./index.html')))
    return
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok) { const copia = r.clone(); caches.open(CACHE).then((c) => c.put(req, copia)) }
    return r
  })))
})
