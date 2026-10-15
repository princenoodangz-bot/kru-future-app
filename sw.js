// Service Worker: ครูในอนาคต (PWA)
const CACHE_NAME = 'kru-exam-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './login.html',
  './all-exams.html',
  './quiz.html',
  './history.html',
  './settings.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// ติดตั้ง Service Worker และดึงไฟล์สำคัญเข้า Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// เคลียร์ Cache เวอร์ชันเก่าเมื่อมีการอัปเดต
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// จัดการการเรียกดูข้อมูลผ่านเครือข่าย (Network First with Cache Fallback)
self.addEventListener('fetch', (event) => {
  // ไม่แคชคำขอไปยัง Supabase เพื่อให้ข้อมูลคะแนนและข้อสอบเป็นข้อมูลล่าสุดเสมอ
  if (event.request.url.includes('supabase.co')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});