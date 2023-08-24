self.addEventListener("install", function (event) {
    // 캐싱 처리
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});


self.addEventListener('push', function(event) {
    const payload = event.data ? event.data.text() : 'No payload';
    const options = {
        body: payload,
        // 여기에 추가 옵션들을 넣을 수 있습니다. 예를 들면 아이콘, 이미지, 액션 버튼 등
    };

    event.waitUntil(
        self.registration.showNotification('알림 잘가니?', options)
    );
});