const CACHE_NAME = 'trebek-soundboard-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/jeopardy-bg.jpg',
  '/jeopardy-icon.png',
  '/jeopardy.png',
  '/jeopardy-trebek-soundboard.jpg',
  '/swiss-911-compressed-regular.otf'
];

const AUDIO_FILES = [
  'yes.mp3',
  'yess.mp3',
  'correct.mp3',
  'youre-so-close.mp3',
  'back-on-the-plus-side.mp3',
  'be-more-specific-thats-it-yes.mp3',
  'good-for-you.mp3',
  'right-you-are-enjoy-the-moment.mp3',
  'you-are-right.mp3',
  'boo-hiss.mp3',
  'well-accept-that-yes.mp3',
  'you-picked-the-right-one-yeah.mp3',
  'youre-on-the-board.mp3',
  'thats-it.mp3',
  'say-it-again-yes.mp3',
  'not-a-bad-guess.mp3',
  'thats-the-14-letter-word.mp3',
  'youve-just-doubled-your-score.mp3',
  'right-you-are.mp3',
  'correct-again.mp3',
  'you-got-it.mp3',
  'thats-it-its-a-common-mistake.mp3',
  'newton-watson.mp3',
  'respect-correct.mp3',
  'thats-the-word.mp3',
  'good-less-than-a-minute-now.mp3',
  'yes-you-have-now-moved-into-the-lead.mp3',
  'ha-ha-ha-no.mp3',
  'rick-astley.mp3',
  'you-got-it-that-was-a-tough-one.mp3',
  'board-fill.mp3',
  'daily-double.mp3',
  'j-woosh.wav'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache audio files on first request
  if (url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Cache images and fonts
  if (url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.otf')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Network-first for HTML and other assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
