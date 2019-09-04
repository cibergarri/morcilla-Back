import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { Topic } from '../models/question';

export const topicsRoute = Router();

topicsRoute.use((req, res, next) => {
  logger.info('Topics request %o', req.body);
  next();
});

topicsRoute.get('/', async (req, res, next) => {
  try {
    const topics = await Topic.find({});
    return res.status(200).json(topics);
  } catch (error) {
    next(error);
  }
});

topicsRoute.post('/', async (req, res, next) => {
  try {
    const topicData = {
      ...req.body,
      user: req.user._id,
      responses: [],
    };
    const topic = new Topic(topicData);
    topic.save();
    return res.status(201).json(topic);
  } catch (error) {
    next(error);
  }
});
