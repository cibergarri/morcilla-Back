import { webpush } from './web-push';
import { logger } from '../winston/log';
import { Subscription } from '../../models/subscription';
import { NOTIFICATION_STATUS } from '../../utils/constants';

export const sendPushNotification = async (notification) => {
  try {
    const {
      type,
      title,
      body,
      origin,
      destination,
      question,
    } = notification;

    if (type !== 'push') return;

    const subscriptions = await Subscription.find({ user: destination });
    const payload = JSON.stringify({ origin, title, body, question });
    const subscriptionsToRemove = [];
    let status = NOTIFICATION_STATUS.PENDING;
    await Promise.all(
      subscriptions.map((subscription) => {
        return webpush.sendNotification(subscription, payload)
          .then(() => {
            status = NOTIFICATION_STATUS.SENT;
          })
          .catch(error => {
            logger.warn(error.stack);
            if (error.statusCode === 410) {
              subscriptionsToRemove.push(subscription._id);
            }
            if (status === NOTIFICATION_STATUS.PENDING) {
              status = NOTIFICATION_STATUS.ERRORED;
            }
          });
      })
    );
    if (subscriptionsToRemove.length) {
      const { deletedCount } = await Subscription.deleteMany({ _id: { $in: subscriptionsToRemove } });
      logger.info(`${deletedCount} subscriptions removed`);
    }
    notification.status = status;
    await notification.save();
  } catch (error) {
    logger.error('Error sending push notification(s) %o', error);
  }
};
