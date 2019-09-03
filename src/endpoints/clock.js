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
      from = moment().add('d', -7).hours(0).minutes(0).seconds(0),
      to  = moment().hours(23).minutes(59).seconds(59),
    } = req.query;
    
    const clocks = await Clock
      .find({ hour: { $gte: from.format(), $lte: to.format() } })
      .populate('user', 'name')
      .sort({ hour: -1 });

    return res.status(200).json(clocks);
  } catch(error){
    next(error);
  }
});

clockRoute.get('/me', async (req, res, next) => {
  try {
    const {
      from = moment().add('d', -7).hours(0).minutes(0).seconds(0),
      to  = moment().hours(23).minutes(59).seconds(59),
    } = req.query;
    
    const clocks = await Clock
    .find({ hour: { $gte: moment(from).format(), $lte: moment(to).format() }, user: req.user._id })
    .sort({ hour: -1 });;

    return res.status(200).json(clocks || []);
  } catch(error){
    next(error);
  }
});

clockRoute.get('/summary', async (req, res, next) => {
  try {
    const {
      from = moment().add('d', -7).hours(0).minutes(0).seconds(0),
      to  = moment().hours(23).minutes(59).seconds(59),
    } = req.query;
    
    const clocks = await Clock
      .find({ hour: { $gte: moment(from).format(), $lte: moment(to).format() }, user: req.user._id });

    const clocksByDay = clocks.reduce((total, clock) => {
      const hour = moment(clock.hour);
      const date = hour.format('DD/MM/YYYY');
      total[date] = total[date] || [];
      total[date].push(clock);
      return total;
    }, {});
    const summary = {}
    for(const day in clocksByDay){
       const dayResult = clocksByDay[day]
        .reduce((result, clock)=> {
          const hour = moment(clock.hour);
          if(clock.type === CLOCK_OPS.IN){
            if(result.start){
              result.smm.push(`${result.start.format('HH:mm:ss')} - XX:XX:XX (duration = ???)`);
            }
            result.start = hour;
            return result;
          } else {
            if(!result.start){
              result.smm.push(`XX:XX:XX - ${hour.format('HH:mm:ss')} (duration = ???)`);
            } else {
              const diff = hour.diff(result.start, 'minutes');
              result.minutes += diff
              result.smm.push(`${result.start.format('HH:mm:ss')} - ${hour.format('HH:mm:ss')} (duration = ${diff} minutes)`);
            }
            
          }
          result.start = null;
          return result;
        }, { smm: [], start: null, minutes: 0 });
      if (dayResult.start) {
        dayResult.smm.push(`${dayResult.start.format('HH:mm:ss')} - XX:XX:XX (duration = ???)`);
        dayResult.start = null;
      }
      summary[day] = { schedule: dayResult.smm, hours: (dayResult.minutes /60).toFixed(2)};
    }
    
    return res.status(200).json(summary);
  } catch(error){
    next(error);
  }
});

clockRoute.post('/in', async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);
    if(user.status === USER_STATUS.ACTIVE) {
      return res.status(409).json({ error: 'user already active' });
    }
    user.status = USER_STATUS.ACTIVE;
    const clock = new Clock({ type: CLOCK_OPS.IN, user: req.user._id });
    await Promise.all([clock.save(), user.save()])
    
    return res.status(201).json(clock);
  } catch(error){
    next(error);
  }
});

clockRoute.post('/out', async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);
    if(user.status === USER_STATUS.INACTIVE) {
      return res.status(409).json({ error: 'user already inactive' });
    }
    user.status = USER_STATUS.INACTIVE;
    const clock = new Clock({ type: CLOCK_OPS.OUT, user: req.user._id });
    await Promise.all([clock.save(), user.save()])
    return res.status(201).json(clock);
  } catch(error){
    next(error);
  }
  
});