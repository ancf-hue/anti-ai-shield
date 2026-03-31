const CACHE_NAME = 'ai-shield-v4';

// ВАЖНО: пути БЕЗ слеша в начале (кроме главной страницы)
// Должны полностью совпадать с тем, как они вызываются в index.html
const ASSETS = [
  '/',
  'index.html',
  'logo.jpeg',
  'logo.jpg',
  'aniskin.mp4',
  'manifest.json',
  'favicon.ico',
  // Автоответчик (9 фраз)
  'audio/phrase1.mp3',
  'audio/phrase2.mp3',
  'audio/phrase3.mp3',
  'audio/phrase4.mp3',
  'audio/phrase5.mp3',
  'audio/phrase6.mp3',
  'audio/phrase7.mp3',
  'audio/phrase8.mp3',
  'audio/phrase9.mp3',
  // Опасные фразы (20 штук)
  'audio1/phrase-001.mp3',
  'audio1/phrase-002.mp3',
  'audio1/phrase-003.mp3',
  'audio1/phrase-004.mp3',
  'audio1/phrase-005.mp3',
  'audio1/phrase-006.mp3',
  'audio1/phrase-007.mp3',
  'audio1/phrase-008.mp3',
  'audio1/phrase-009.mp3',
  'audio1/phrase-010.mp3',
  'audio1/phrase-011.mp3',
  'audio1/phrase-012.mp3',
  'audio1/phrase-013.mp3',
  'audio1/phrase-014.mp3',
  'audio1/phrase-015.mp3',
  'audio1/phrase-016.mp3',
  'audio1/phrase-017.mp3',
  'audio1/phrase-018.mp3',
  'audio1/phrase-019.mp3',
  'audio1/phrase-020.mp3',
  // Уроки (11 штук)
  'audio2/question-001.mp3',
  'audio2/question-002.mp3',
  'audio2/question-003.mp3',
  'audio2/question-004.mp3',
  'audio2/question-005.mp3',
  'audio2/question-006.mp3',
  'audio2/question-007.mp3',
  'audio2/question-008.mp3',
  'audio2/question-009.mp3',
  'audio2/question-010.mp3',
  'audio2/question-011.mp3'
];

// Установка: скачиваем всё в кэш
self.addEventListener('install', (event) => {
  console.log('🛡️ Service Worker: установка');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Кэширование начато:', ASSETS.length, 'файлов');
      return cache.addAll(ASSETS);
    }).then(() => {
      console.log('✅ Все файлы закэшированы успешно');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('❌ Ошибка кэширования:', error);
    })
  );
});

// Активация: удаляем старые версии
self.addEventListener('activate', (event) => {
  console.log('🛡️ Service Worker: активация');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log('🗑️ Удаляем старый кэш:', key);
          return caches.delete(key);
        })
      );
    }).then(() => {
      console.log('✅ Service Worker активирован, версия:', CACHE_NAME);
      return self.clients.claim();
    })
  );
});

// Работа: сначала кэш, потом сеть
self.addEventListener('fetch', (event) => {
  // Пропускаем запросы к аналитике и внешним ресурсам
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    return; // Не кэшируем сторонние ресурсы
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      // Если в кэше нет — идём в сеть
      return fetch(event.request).then((response) => {
        // Кэшируем только успешные ответы
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
