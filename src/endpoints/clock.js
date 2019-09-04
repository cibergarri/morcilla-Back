import moment from 'moment';
import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { Clock } from '../models/clock';
import { getUserById } from '../queries/user';
import { USER_STATUS, CLOCK_OPS } from '../utils/constants';

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
    const clocks = await Clock
      .find(filter)
      .populate('project', 'name');

    const clocksByDay = clocks.reduce((total, clock) => {
      const hour = moment(clock.hour);
      const date = hour.format('DD/MM/YYYY');
      total[date] = total[date] || [];
      total[date].push(clock);
      return total;
    }, {});
    const summary = {};
    for (const day in clocksByDay) {
      const dayResult = clocksByDay[day]
        .reduce((result, clock) => {
          const hour = moment(clock.hour);
          if (clock.type === CLOCK_OPS.IN) {
            if (result.lastStart) { // two 'ins' in a row
              result.smm.push({
                start: result.lastStart,
                end: null,
                duration: 0,
                project: result.currentProject,
              });
            }
            result.currentProject = clock.project;
            result.lastStart = hour;
            return result;
          } else if (!result.lastStart) { // two 'outs' in a row
            result.smm.push({
              start: null,
              end: hour.format('HH:mm:ss'),
              duration: 0,
              project: null,
            });
          } else { // 'in' & 'out'
            const diff = hour.diff(result.lastStart, 'minutes');
            result.minutes += diff;
            result.smm.push({
              start: result.lastStart.format('HH:mm:ss'),
              end: hour.format('HH:mm:ss'),
              duration: diff,
              project: result.currentProject,
            });
          }
          result.lastStart = null;
          result.currentProject = null;
          return result;
        }, { smm: [], lastStart: null, minutes: 0, currentProject: null });

      if (dayResult.lastStart) { // last 'in' without 'out'
        dayResult.smm.push({ start: dayResult.lastStart, end: null, duration: 0 });
        dayResult.lastStart = null;
      }
      const getHoursMinutes = (mins) => ({
        hours: Math.floor(mins / 60),
        minutes: mins % 60,
      });
      const durationsByProject = dayResult.smm
        .reduce((resultsByProj, proj) => {
          const projName = proj.project ? proj.project.name : '-';
          resultsByProj[projName] = (resultsByProj[projName] || 0) + proj.duration;
          return resultsByProj;
        }, {});
      for (const [key, value] of Object.entries(durationsByProject)) {
        durationsByProject[key] = getHoursMinutes(value);
      }
      summary[day] = {
        schedule: dayResult.smm,
        total: getHoursMinutes(dayResult.minutes),
        totalsByProject: durationsByProject,
      };
    }

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

    return res.status(201).json(clock);
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
