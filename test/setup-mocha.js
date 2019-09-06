import webpush from 'web-push';

const { publicKey, privateKey } = webpush.generateVAPIDKeys();
process.env.WEB_PUSH_EMAIL_CONTACT = 'test@test.com';
process.env.PUBLIC_VAPID_KEY = publicKey;
process.env.PRIVATE_VAPID_KEY = privateKey;
process.env.GITHUB_CLIENT_ID = 'fake_client_id';
process.env.GITHUB_CLIENT_SECRET = 'fake_client_secret';
process.env.ENV_URL = 'http://locahost:3000';
console.log('setup mocha');
