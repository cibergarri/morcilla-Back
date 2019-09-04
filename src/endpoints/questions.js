import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { Question, Answer } from '../models/question';

export const questionsroute = Router();

questionsroute.use((req, res, next) => {
  logger.info('Questions request %o', req.body);
  next();
});

questionsroute.get('/', async (req, res, next) => {
  try {
    const {
      text,
      topic,
      user,
    } = req.query;
    const filter = {};
    if (topic) filter.topic = topic;
    if (user) filter.user = user;
    if (text) filter.text = { $regex: text, $options: 'i' };

    const questions = await Question.find({ ...filter });
    return res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
});

questionsroute.get('/me', async (req, res, next) => {
  try {
    const questions = await Question.find({ user: req.user._id });
    return res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
});

questionsroute.post('/', async (req, res, next) => {
  try {
    const questionData = {
      ...req.body,
      user: req.user._id,
      responses: [],
    };
    const question = new Question(questionData);
    question.save();
    return res.status(201).json(question);
  } catch (error) {
    next(error);
  }
});

questionsroute.get('/:questionId', async (req, res, next) => {
  try {
    const question = await Question
      .findById(req.params.questionId)
      .populate('user', 'name')
      .populate('topic', 'title');

    return res.status(200).json(question);
  } catch (error) {
    next(error);
  }
});

questionsroute.post('/:questionId/answers', async (req, res, next) => {
  try {
    const answerData = {
      text: req.body.text,
      question: req.params.questionId,
      user: req.user._id,
    };
    const answer = new Answer(answerData);
    await answer.save();
    return res.status(201).json(answer);
  } catch (error) {
    next(error);
  }
});

questionsroute.get('/:questionId/answers', async (req, res, next) => {
  try {
    const answers = await Answer
      .find({ question: req.params.questionId })
      .populate('user', 'name')
      .populate('user', 'photo');

    return res.status(200).json(answers);
  } catch (error) {
    next(error);
  }
});

questionsroute.post('/:questionId/answers', async (req, res, next) => {
  try {
    const answerData = {
      text: req.body.text,
      question: req.params.questionId,
      user: req.user._id,
    };
    const answer = new Answer(answerData);
    await answer.save();
    return res.status(201).json(answer);
  } catch (error) {
    next(error);
  }
});
