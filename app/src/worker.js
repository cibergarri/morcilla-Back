console.log('Loaded service worker!');

window.pushNotificationEventListener =  ev => {
  const data = ev.data.json();
  console.log('Got push', data);
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || '/push/morcilla.jpg',
    image: data.image || '/push/morcilla.jpg',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    requireInteraction: true,
  });
};

self.addEventListener('push', window.pushNotificationEventListener);
