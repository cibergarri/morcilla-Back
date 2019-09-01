import webpush from 'web-push';

const webPushEmailContact = process.env.WEB_PUSH_EMAIL_CONTACT;
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(`mailto:${webPushEmailContact}`, publicVapidKey, privateVapidKey);

export { webpush };