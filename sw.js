const C = 'imfine-v1';
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C).then(c => c.add('index.html').catch(() => {})).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // 只缓存同源 GET（index.html / 图标），跨域的 GitHub API 等直接透传，不影响云端同步
  if (u.origin === self.location.origin && e.request.method === 'GET') {
    e.respondWith(
      fetch(e.request).then(res => {
        const cp = res.clone();
        caches.open(C).then(c => c.put(e.request, cp)).catch(() => {});
        return res;
      }).catch(() => caches.match(e.request))
    );
  }
});
