const CACHE_NAME = "ai-ideen-v44";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/config.js",
  "./js/supabaseClient.js",
  "./js/app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-192-round.png",
  "./icons/icon-512-round.png",
  "./icons/hoc-mark.png",
  "./icons/hoc-logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first: bei Updates immer die neueste Version holen, nur bei
// fehlendem Netz (offline) auf den Cache zurückfallen. "cache: no-store"
// ist hier wichtig - sonst kann der normale HTTP-Cache des Browsers eine
// veraltete Antwort liefern, bevor der Request überhaupt ins Netz geht,
// und Nutzer sehen trotz neuem Deploy weiter die alte Version.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
