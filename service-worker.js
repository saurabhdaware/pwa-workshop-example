const CACHE_NAME = 'pwa-workshop-v10';

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

// BACKGROUND SYNC
function sendDataToServer() {
  console.log('sendDataToServer here');
}


self.addEventListener('sync', (event) => {
  if (event.tag == 'pwa-workshop-sync') {
    event.waitUntil(sendDataToServer());
  }
})


// PUSH API (For Backend)
self.addEventListener('push', function(e) {
  const data = JSON.parse(e.data.text());
  const options = {
    body: data.body,
    icon: './logo-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});