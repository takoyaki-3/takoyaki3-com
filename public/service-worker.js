// service-worker.js

// インストールイベント (キャッシュしない)
self.addEventListener("install", (event) => {
  // キャッシュのセットアップをしない
  console.log("Service Worker: Installed, no caching.");
});

// リソースフェッチイベント (常にネットワークから取得)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // オフライン時のフォールバックを設定しない場合
      console.error("Service Worker: Network request failed, and no cache is available.");
    })
  );
});

// キャッシュを一切保持しない (古いキャッシュを削除する場合)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => caches.delete(cache))
      );
    })
  );
});
