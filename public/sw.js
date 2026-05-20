const CACHE_NAME = 'wellness-hub-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

// Instalar el service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.log('Cache addAll error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activar el service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Ignorar solicitudes que no sean GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar API requests (cross-origin o rutas del backend) - siempre ir a la red
  const requestUrl = new URL(event.request.url);
  const isApiCall =
    requestUrl.origin !== self.location.origin ||
    requestUrl.pathname.startsWith('/auth') ||
    requestUrl.pathname.startsWith('/fitness') ||
    requestUrl.pathname.startsWith('/health') ||
    requestUrl.pathname.startsWith('/nutrition') ||
    requestUrl.pathname.startsWith('/sleep') ||
    requestUrl.pathname.startsWith('/meditation') ||
    requestUrl.pathname.startsWith('/hydration') ||
    requestUrl.pathname.startsWith('/goals') ||
    requestUrl.pathname.startsWith('/api/');

  if (isApiCall) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'Network error' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // Para otros recursos, usar cache first, luego network
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // No cachear respuestas de error
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clonar la respuesta
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Retornar la versión en caché si disponible
        return caches.match('/index.html');
      })
  );
});
