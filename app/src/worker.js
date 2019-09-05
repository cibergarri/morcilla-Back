console.log('Loaded service worker!');

var pushNotificationEventListener =  ev => {
  const data = ev.data.json();
  console.log('Got push', data);
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon || '/push/morcilla.jpg',
    image: data.image || '/push/morcilla.jpg',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    requireInteraction: true,
    actions: [{action: "Ver", title: "Ver"}],
  });

  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (event.action === 'Ver') {
      clients.openWindow("/questions/all?openById="+data.data);
    }
  }, false);

};

self.addEventListener('push', pushNotificationEventListener);
