import { Router } from 'express';

import * as dbHelper from '../helpers/mongo/dbHelper';
import { User } from '../models/user';
import { logger } from '../helpers/winston/log';
import { Subscription } from '../models/subscription';
import { webpush } from '../helpers/notifications/web-push';
import { Notification } from '../models/notification';
import { isMandatory } from '../utils/validations';

export const notificationsRoute = Router();

notificationsRoute.use((req, res, next) => {
  logger.info('Notifications request %o', req.body);
  next();
});

notificationsRoute.post('/',
  async (req, res) => {
    try {
      const users = await User.find();
      const origin = users.find(usr => usr.id === req.user.id);
      if (!origin) return res.status(404).json('origin user not found');
      const {
        type = isMandatory('type'),
        title = isMandatory('title'),
        body = isMandatory('body'),
      } = req.body;
      const notifications = users.reduce((notifications, usr) => {
        if(usr !== origin) {
          const notification = new Notification({
            type,
            title,
            body,
            origin: origin._id,
            destination: usr._id,
          });
          notifications.push(notification);
        }
        return notifications;
      }, []);
      const notificationsSaved = await Notification.create(notifications);
      return res.status(201).json(notificationsSaved);
    } catch(error){
      res.status(500).json(error.toString());
    }
    return;
  }
);

notificationsRoute.post('/push/subscribe',
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json('user not found');
      const subscriptionData = {
        ...req.body,
        user: user._id,
      };
      const subscription = new Subscription(subscriptionData);
      await subscription.save();
      return res.status(200).json({subscription});
    } catch(error){
      console.error('error subscribing', error)
    }
    return;
  }
);

notificationsRoute.get('/push/test', async (req, res) => {
  try {
    const subscriptions = await Subscription.find({user: req.user._id });

    const payload = JSON.stringify({ title: `testing ${req.user.name}` });
    const subscriptionsToRemove = [];
    for(const subscription of subscriptions) {
      await webpush.sendNotification(subscription, payload)
        .catch(error => {
          logger.warn(error.stack);
          if(error.statusCode=== 410) {
            subscriptionsToRemove.push(subscription._id);
          }
        });
    }
    if(subscriptionsToRemove.length) {
      const { deletedCount } = await Subscription.deleteMany({_id: { $in: subscriptionsToRemove}});
      logger.info(`${deletedCount} subscriptions removed`);
    }
    return res.status(200).json({});
  } catch(error) {
    console.error('error testing', error)
  }
  return res.status(500).json({});
});