const CACHE_NAME = 'pwa-workshop-v8';

const URLS_TO_CACHE = [
  './',
  './app.js',
  './logo-192.png'
];


// Creates the cache
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  self.skipWaiting();

  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Responsible for responding from cache
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

// Clears the cache
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === CACHE_NAME) { 
        return;
      }
      // key !== cache_name
      return caches.delete(key);
    }))
  }));
});