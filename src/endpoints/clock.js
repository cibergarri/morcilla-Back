import moment from 'moment';
import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { Clock } from '../models/clock';
import { getUserById } from '../queries/user';
import { USER_STATUS, CLOCK_OPS, NOTIFICATION_STATUS } from '../utils/constants';
import { sendPushNotification } from '../helpers/notifications/sender';
import { Notification } from '../models/notification';
import { getClocksSummary } from '../helpers/clock';

export const clockRoute = Router();

clockRoute.use((req, res, next) => {
  logger.info('Clock request %o', req.body);
  next();
});

clockRoute.get('/', async (req, res, next) => {
  try {
    const {
      from = moment().add(-7, 'd').hours(0).minutes(0).seconds(0),
      to = moment().hours(23).minutes(59).seconds(59),
    } = req.query;

    const clocks = await Clock
      .find({ hour: { $gte: from.format(), $lte: to.format() } })
      .populate('user', 'name')
      .populate('project', 'name')
      .sort({ hour: -1 });

    return res.status(200).json(clocks);
  } catch (error) {
    next(error);
  }
});

clockRoute.get('/me', async (req, res, next) => {
  try {
    const {
      from = moment().add(-7, 'd').hours(0).minutes(0).seconds(0),
      to = moment().hours(23).minutes(59).seconds(59),
    } = req.query;

    const clocks = await Clock
      .find({ hour: { $gte: moment(from).format(), $lte: moment(to).format() }, user: req.user._id })
      .populate('project', 'name')
      .sort({ hour: -1 }); ;

    return res.status(200).json(clocks || []);
  } catch (error) {
    next(error);
  }
});

clockRoute.get('/summary', async (req, res, next) => {
  try {
    const {
      from = moment().add(-7, 'd').hours(0).minutes(0).seconds(0),
      to = moment().hours(23).minutes(59).seconds(59),
    } = req.query;

    const filter = {
      hour: {
        $gte: moment(from).format(),
        $lte: moment(to).format(),
      },
      user: req.user._id,
    };
    const summary = await getClocksSummary(filter);
    return res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
});

clockRoute.post('/in', async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);
    if (user.status === USER_STATUS.ACTIVE) {
      return res.status(409).json({ error: 'user already active' });
    }
    user.status = USER_STATUS.ACTIVE;

    const { project } = req.body;
    const clock = new Clock({ type: CLOCK_OPS.IN, user: req.user._id, project });
    await Promise.all([clock.save(), user.save()]);
    res.status(201).json(clock);
    Notification.find({
      destination: req.user._id,
      status: NOTIFICATION_STATUS.PENDING,
    }).then(pending => {
      return Promise.all(pending.map(sendPushNotification));
    }).catch(logger.error);
  } catch (error) {
    next(error);
  }
});

clockRoute.post('/out', async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);
    if (user.status === USER_STATUS.INACTIVE) {
      return res.status(409).json({ error: 'user already inactive' });
    }
    user.status = USER_STATUS.INACTIVE;
    const clock = new Clock({ type: CLOCK_OPS.OUT, user: req.user._id });
    await Promise.all([clock.save(), user.save()]);
    return res.status(201).json(clock);
  } catch (error) {
    next(error);
  }
});
