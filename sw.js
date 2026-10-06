// Offline support.
// - The page itself: network first (so updates arrive), cached copy when offline.
// - Data files: served from cache instantly, refreshed in the background.
// - Fonts: cached. Recitation audio is streamed, not cached (it would fill the phone).
const V = "quran-v16";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon.svg"];  // css/ and js/ are cached on first load (network first)
self.addEventListener("install", e => e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== "quran-audio").map(k => caches.delete(k)))).then(() => self.clients.claim())
));
const put = (req, res) => { if (res && (res.ok || res.type === "opaque")) { const c = res.clone(); caches.open(V).then(x => x.put(req, c)); } return res; };
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (req.mode === "navigate" || url.pathname.endsWith("/") || /\.(html|js|css)$/.test(url.pathname)) {
      e.respondWith(fetch(req).then(r => put(req, r)).catch(() => caches.match(req).then(h => h || caches.match("index.html"))));
    } else {
      e.respondWith(caches.match(req).then(hit => {
        const net = fetch(req).then(r => put(req, r)).catch(() => hit);
        return hit || net;
      }));
    }
  } else if (url.hostname === "everyayah.com") {
    // recitation saved offline by the user ("Save this surah's recitation offline"); otherwise streamed
    e.respondWith(caches.open("quran-audio").then(c => c.match(req.url)).then(hit => hit || fetch(req)));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => put(req, r))));
  }
});
