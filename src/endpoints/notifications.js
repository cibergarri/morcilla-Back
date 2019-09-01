import { Router } from 'express';
import passport from 'passport';
import * as dbHelper from '../helpers/mongo/dbHelper';
import { User } from '../models/user';
import { logger } from '../helpers/winston/log';
import { Subscription } from '../models/subscription';
import { webpush } from '../helpers/notifications/web-push';

export const notificationsRoute = Router();

notificationsRoute.use((req, res, next) => {
  logger.info('Notifications request', req);
  next();
});

notificationsRoute.post('/subscribe',
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json('user not found');
      const subscription = new Subscription(req.body);
      dbHelper.save(subscription)
      
      user.subscriptions = user.subscriptions || [];
      user.subscriptions.push(subscription._id);
      dbHelper.save(user);
      return res.status(200).json({subscription});
    } catch(error){
      console.error('error subscribing', error)
    }
    return;
  }
);

notificationsRoute.get('/test', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({ path: 'subscriptions' });
    if (!user) return res.status(404).json('user not found');

    const payload = JSON.stringify({ title: `hola ${user.name}` });
    for(const subscription of user.subscriptions) {
      await webpush.sendNotification(subscription, payload).catch(error => {
        logger.error(error.stack);
      });
    }
    return res.status(200).json({});
  } catch(error) {
    console.error('error testing', error)
  }
  return res.status(500).json({});
});