/* Wochenkorb Service Worker: Offline-Nutzung.
   Optionaler Zusatz neben index.html (nur ueber http(s), z. B. GitHub Pages). Die App selbst bleibt eine
   Einzeldatei und funktioniert ohne diese Datei weiter (z. B. im Claude-Artifact). */
const PAGE_CACHE = 'wochenkorb-page-v1';
const RUNTIME_CACHE = 'wochenkorb-runtime-v1';
const PAGE_URL = new URL('./', self.location).href;
const RUNTIME_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

/* Antworten nach Weiterleitungen duerfen fuer Navigationen nicht direkt ausgeliefert werden. */
async function clean(res){
  if(!res.redirected) return res;
  return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers });
}
const signature = (r) => (r.headers.get('etag') || '') + (r.headers.get('last-modified') || '');

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil((async () => {
    const res = await fetch(new Request(PAGE_URL, { cache: 'reload' }));
    if(!res.ok) throw new Error('Seite konnte nicht vorgeladen werden');
    await (await caches.open(PAGE_CACHE)).put(PAGE_URL, await clean(res));
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for(const key of await caches.keys()){
      if(key !== PAGE_CACHE && key !== RUNTIME_CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

/* Seite: sofort aus dem Cache, im Hintergrund aktualisieren. Ohne Cache: Netzwerk. */
async function pageResponse(e){
  const cache = await caches.open(PAGE_CACHE);
  const cached = await cache.match(PAGE_URL);
  const update = (async () => {
    try{
      const res = await fetch(new Request(PAGE_URL, { cache: 'no-cache' }));
      if(!res.ok || res.type !== 'basic') return null;
      const fresh = await clean(res);
      await cache.put(PAGE_URL, fresh.clone());
      if(cached && signature(cached) && signature(cached) !== signature(fresh)){
        for(const client of await self.clients.matchAll()) client.postMessage({ type: 'update-ready' });
      }
      return fresh;
    }catch(err){ return null; }
  })();
  try{ e.waitUntil(update); }catch(err){ /* Lebensdauer reicht ueber respondWith */ }
  if(cached) return cached;
  return (await update) || new Response('<meta charset="utf-8"><title>Offline</title><p style="font:16px sans-serif;padding:24px">Wochenkorb ist offline und noch nicht zwischengespeichert. Bitte einmal mit Internet öffnen.</p>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

/* Schriften: aus dem Cache, im Hintergrund aktualisieren. */
async function runtimeResponse(req){
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  const network = fetch(req).then((res) => {
    if(res.ok || res.type === 'opaque') cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return cached || (await network) || Response.error();
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(req.mode === 'navigate' && url.origin === self.location.origin){ e.respondWith(pageResponse(e)); return; }
  if(RUNTIME_HOSTS.includes(url.hostname)) e.respondWith(runtimeResponse(req));
});
