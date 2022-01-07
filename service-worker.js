const CACHE_NAME = 'pwa-workshop-v1';

const URLS_TO_CACHE = [
  './index.html',
  './logo-192.png'
];


self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(URLS_TO_CACHE);
  })());
});

self.addEventListener('fetch', (e) => {
  e.respondWith( 
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // if we don't find matching cache, then pass to internet
      return fetch(e.request);
    })
  );
});