// Offline support: app shell is cached on install; every surah you open is cached
// the first time, so it works without internet afterwards.
const V = "quran-v1";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon.svg", "data/meta.json", "data/occ.json"];
self.addEventListener("install", e => e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(V).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match("index.html"))));
});
