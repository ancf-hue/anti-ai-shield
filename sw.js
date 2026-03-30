// sw.js - Service Worker для "Анти-ИИ Щит"
const CACHE = 'anti-ai-shield-v1';
const FILES = [
    '/', 
    '/index.html', 
    '/logo.jpeg', 
    '/aniskin.mp4',
    
    // Автоответчик (9 файлов)
    'audio/phrase1.mp3',
    'audio/phrase2.mp3',
    'audio/phrase3.mp3',
    'audio/phrase4.mp3',
    'audio/phrase5.mp3',
    'audio/phrase6.mp3',
    'audio/phrase7.mp3',
    'audio/phrase8.mp3',
    'audio/phrase9.mp3',
    
    // Опасные фразы (20 файлов)
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
    
    // Уроки (11 файлов)
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

// Установка: кэшируем все файлы
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => {
            console.log('📦 Кэширование файлов...');
            return cache.addAll(FILES);
        }).then(() => {
            console.log('✅ Все файлы закэшированы');
            self.skipWaiting();
        }).catch(err => {
            console.log('❌ Ошибка кэширования:', err);
        })
    );
});

// Активация: чистим старые кэши
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(names => 
            Promise.all(
                names.filter(n => n !== CACHE).map(n => {
                    console.log('🗑️ Удаляем старый кэш:', n);
                    return caches.delete(n);
                })
            )
        ).then(() => {
            console.log('✅ Старые кэши удалены');
            self.clients.claim();
        })
    );
});

// Запрос: отдаём из кэша или из сети
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(r => {
            if (r) {
                console.log('📂 Из кэша:', e.request.url);
                return r;
            }
            console.log('🌐 Из сети:', e.request.url);
            return fetch(e.request);
        }).catch(err => {
            console.log('❌ Ошибка запроса:', err);
        })
    );
});