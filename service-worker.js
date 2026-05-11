/**
 * Service Worker para AgriculturaI
 * Estrategia: cache-first para estáticos, network-first para datos JSON
 */

const CACHE_VERSION = 'agriai-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE_URLS = [
    './',
    './index.html',
    './manifest.json',
    './favicon.svg',
    './favicon.ico',
    './assets/css/main.css',
    './assets/css/components.css',
    './assets/css/responsive.css',
    './assets/js/utils.js',
    './assets/js/router.js',
    './assets/js/app.js',
    './pages/home.html',
    './pages/diagnosis.html',
    './pages/crops.html',
    './pages/chat.html',
    './pages/marketplace.html',
    './pages/orders.html',
    './modules/diagnosis/diagnosis.js',
    './modules/chatbot/chatbot.js',
    './modules/marketplace/marketplace.js',
    './modules/growstuff-api.js',
    './modules/epa-api.js',
    './modules/greenbook-api.js',
    './data/chat-intents.json',
    './data/crops-database.json',
    './data/diseases-info.json',
    './data/products-catalog.json'
];

// Instalación: precachear recursos esenciales
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS).catch((err) => {
                console.warn('[SW] Algunos recursos no se pudieron precachear:', err);
            }))
            .then(() => self.skipWaiting())
    );
});

// Activación: limpiar caches viejos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => !key.startsWith(CACHE_VERSION))
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// Estrategia de fetch
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Solo GET
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // No interceptar peticiones a otros orígenes (CDN, APIs externas)
    if (url.origin !== self.location.origin) return;

    // Network-first para JSON de datos (para reflejar actualizaciones)
    if (url.pathname.endsWith('.json')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Cache-first para el resto
    event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response && response.status === 200 && response.type === 'basic') {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        // Fallback a index.html para navegación SPA offline
        if (request.mode === 'navigate') {
            return caches.match('./index.html');
        }
        throw err;
    }
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (err) {
        const cached = await caches.match(request);
        if (cached) return cached;
        throw err;
    }
}
