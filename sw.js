// sw.js - Service Worker для "Анти-ИИ Щит" v5
const CACHE_NAME = 'anti-ai-shield-v5';

// ВАЖНО: пути должны совпадать с тем, как они в index.html
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.jpeg',
  '/aniskin.mp4',
  '/manifest.json',
  
  // Автоответчик (9 файлов)
  './audio/phrase1.mp3',
  './audio/phrase2.mp3',
  './audio/phrase3.mp3',
  './audio/phrase4.mp3',
  './audio/phrase5.mp3',
  './audio/phrase6.mp3',
  './audio/phrase7.mp3',
  './audio/phrase8.mp3',
  './audio/phrase9.mp3',
  
  // Опасные фразы (20 файлов)
  './audio1/phrase-001.mp3',
  './audio1/phrase-002.mp3',
  './audio1/phrase-003.mp3',
  './audio1/phrase-004.mp3',
  './audio1/phrase-005.mp3',
  './audio1/phrase-006.mp3',
  './audio1/phrase-007.mp3',
  './audio1/phrase-008.mp3',
  './audio1/phrase-009.mp3',
  './audio1/phrase-010.mp3',
  './audio1/phrase-011.mp3',
  './audio1/phrase-012.mp3',
  './audio1/phrase-013.mp3',
  './audio1/phrase-014.mp3',
  './audio1/phrase-015.mp3',
  './audio1/phrase-016.mp3',
  './audio1/phrase-017.mp3',
  './audio1/phrase-018.mp3',
  './audio1/phrase-019.mp3',
  './audio1/phrase-020.mp3',
  
  // Уроки (11 файлов)
  './audio2/question-001.mp3',
  './audio2/question-002.mp3',
  './audio2/question-003.mp3',
  './audio2/question-004.mp3',
  './audio2/question-005.mp3',
  './audio2/question-006.mp3',
  './audio2/question-007.mp3',
  './audio2/question-008.mp3',
  './audio2/question-009.mp3',
  './audio2/question-010.mp3',
  './audio2/question-011.mp3'
];

// Установка: кэшируем все файлы
self.addEventListener('install', (event) => {
  console.log('🛡️ Service Worker: установка началась');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Открыт кэш:', CACHE_NAME);
        console.log('📋 Файлов для кэширования:', FILES_TO_CACHE.length);
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('✅ Все файлы успешно закэшированы!');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Ошибка кэширования:', error);
        console.error('Не удалось закэшировать некоторые файлы');
      })
  );
});

// Активация: удаляем старые кэши
self.addEventListener('activate', (event) => {
  console.log('🛡️ Service Worker: активация');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('🗑️ Удаляем старый кэш:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker активирован');
        return self.clients.claim();
      })
  );
});

// Перехват запросов: сначала кэш, потом сеть
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('📂 Из кэша:', event.request.url);
          return cachedResponse;
        }
        
        console.log('🌐 Из сети:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('❌ Ошибка сети:', error);
            return new Response('Offline', { 
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});
