import moment from 'moment';
import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { Answer, Question } from '../models/question';
import { getClocksSummary } from '../helpers/clock';
import { User } from '../models/user';

export const statsRoute = Router();

statsRoute.use((req, res, next) => {
  logger.info('Stats request %o', req.body);
  next();
});

statsRoute.get('/', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const users = await User.find();
    const statsByUser = (fr, t) => (user) => getStats(user, fr, t).then(resul => ({ name: user.name, id: user._id, stats: resul }));
    const stats = await Promise.all(users.map(statsByUser(from, to)));
    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
});
statsRoute.get('/me', async (req, res, next) => {
  try {
    const user = req.user._id;
    const { from, to } = req.query;
    const stats = await getStats(user, from, to);
    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
});

statsRoute.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = (req.params || {});
    const { from, to } = req.query;
    const stats = await getStats(userId, from, to);
    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
});

async function getStats (user, from, to) {
  let dateFilter;
  if (from) {
    dateFilter = {
      createdAt: {
        $gte: moment(from, 'DD/MM/YY').format(),
      },
    };
  }
  if (to) {
    if (!dateFilter) {
      dateFilter = { createdAt: {} };
    }
    dateFilter.createdAt = {
      ...dateFilter.createdAt,
      $lte: moment(to, 'DD/MM/YY').format(),
    };
  }
  const filter = {
    user,
    ...(dateFilter && { createdAt: dateFilter.createdAt }),
  };
  const clockFilter = {
    user,
    ...(dateFilter && { hour: dateFilter.createdAt }),
  };

  const [
    totalAnswers,
    acceptedAnsers,
    questions,
    clockSummary,
  ] = await Promise.all([
    Answer.countDocuments(filter),
    Answer.countDocuments({ ...filter, accepted: true }),
    Question.countDocuments(filter),
    getClocksSummary(clockFilter),
  ]);

  const workingHours = Object.values(clockSummary).reduce((summ, clockElement = {}) => {
    const addTime = (elementOrig, elementDest) => {
      const { hours, minutes } = elementOrig || {};
      elementDest.total.hours += hours || 0;
      elementDest.total.minutes += minutes || 0;
    };
    addTime(clockElement.total, summ);
    for (const [projectName, projectClock] of Object.entries(clockElement.totalsByProject)) {
      summ.totalsByProject[projectName] = summ.totalsByProject[projectName] || { total: { hours: 0, minutes: 0 } };
      addTime(projectClock, summ.totalsByProject[projectName]);
    }
    return summ;
  }, { total: { hours: 0, minutes: 0 }, totalsByProject: {} });
  const stats = {
    answers: {
      total: totalAnswers,
      accepted: acceptedAnsers,
    },
    questions,
    workingHours,
  };
  return stats;
}
