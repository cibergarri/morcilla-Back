import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { Topic } from '../models/question';

export const topicsRoute = Router();

topicsRoute.use((req, res, next) => {
  logger.info('Topics request %o', req.body);
  next();
});

topicsRoute.get('/', async (req, res) => {
  const topics = await Topic.find({});
  return res.status(200).json(topics);
});


topicsRoute.post('/', async (req, res) => {
  const topicData = {
    ...req.body,
    user: req.user._id,
    responses: [],
  };
  const topic = new Topic(topicData);
  topic.save()
  return res.status(201).json(topic);
});
