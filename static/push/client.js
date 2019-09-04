const publicVapidKey = 'BJWz0WH_FhdpLtLG_meBK1U-nkVvZJ4VtS7F3sLSWhPIvasHZ3qxpRJNNItZZYju0qU3T4UeacBOqbciagW0fSg';

if ('serviceWorker' in navigator) {
  console.log('Registering service worker');

  run().catch(error => console.error(error));
}

async function run () {
  console.log('Registering service worker');
  const registration = await navigator.serviceWorker
    .register('/push/worker.js', { scope: '/push/' });
  console.log('Registered service worker');

  console.log('Registering push');
  const subscription = await registration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
  console.log('Registered push');

  // ToDo: use session token if necessary:
  // eslint-disable-next-line no-undef
  await fetch('/api/notifications/push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDZiYjcyMzJhYzQyNDhkOTIxOTNiMjgiLCJnaXRodWJJZCI6IjIwMTU1NTY0IiwibmFtZSI6IkphdmllciBHYXJyaWRvIiwiaXNzIjoibW9yY2lsbGEiLCJhdWQiOiJtb3JjaWxsYS1jb25mLWhhY2thdGhvbi5oZXJva3VhcHAuY29tIiwiaWF0IjoxNTY3MzcwMjM0fQ.iv_jJ_BUjJlfLRwvyxssafVMNySYlRKW2XmyIJAp-eQ',
    },
  });
  console.log('Sent push');
}

function urlBase64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
