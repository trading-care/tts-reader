// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open('tts-cache').then(cache => {
//       return cache.addAll([
//         '/',
//         '/index.html',
//         '/manifest.json',
//         '/icons/icon-192.png',
//         '/icons/icon-512.png'
//       ]);
//     })
//   );
// });

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("static").then(cache => {
      return cache.addAll(["./", "./index.html", "./icons/icon-192.png"]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


