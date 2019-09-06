import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { Answer } from '../models/question';

export const answersRoute = Router();

answersRoute.use((req, res, next) => {
  logger.info('Answers request %o', req.body);
  next();
});

answersRoute.get('/', async (req, res, next) => {
  try {
    const {
      text,
      user,
    } = req.query;
    const filter = {};
    if (user) filter.user = user;
    if (text) filter.text = { $regex: text, $options: 'i' };

    const answers = await Answer.find({ ...filter });
    return res.status(200).json(answers);
  } catch (error) {
    next(error);
  }
});

answersRoute.get('/me', async (req, res, next) => {
  try {
    const {
      accepted,
    } = (req.query || {});

    const filter = { user: req.user._id };
    if (accepted !== undefined) {
      filter.accepted = accepted === 'true'
        ? true
        : { $ne: true };
    }
    const answers = await Answer.find(filter);
    return res.status(200).json(answers);
  } catch (error) {
    next(error);
  }
});

answersRoute.get('/:answerId', async (req, res, next) => {
  try {
    const answer = await Answer
      .findById(req.params.answerId)
      .populate('question', 'text');

    return res.status(200).json(answer);
  } catch (error) {
    next(error);
  }
});

answersRoute.put('/:answerId/accepted', async (req, res, next) => {
  const { accepted } = (req.body || {});
  try {
    await Answer
      .findByIdAndUpdate(req.params.answerId, { accepted });

    return res.status(202).send();
  } catch (error) {
    next(error);
  }
});
