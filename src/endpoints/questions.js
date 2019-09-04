import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { Question, Answer } from '../models/question';

export const questionsroute = Router();

questionsroute.use((req, res, next) => {
  logger.info('Questions request %o', req.body);
  next();
});

questionsroute.get('/', async (req, res) => {
  const {
    text,
    topic,
    user,
  } = req.query;
  const filter = {};
  if(topic) filter.topic = topic;
  if(user) filter.user = user;
  if(text) filter.text = { $regex: text, $options: 'i',};

  const questions = await Question.find({...filter});
  return res.status(200).json(questions);
});

questionsroute.get('/me', async (req, res) => {
  const questions = await Question.find({user: req.user._id });
  return res.status(200).json(questions);
});

questionsroute.post('/', async (req, res) => {
  const questionData = {
    ...req.body,
    user: req.user._id,
    responses: [],
  };
  const question = new Question(questionData);
  question.save()
  return res.status(201).json(question);
});

questionsroute.get('/:questionId', async (req, res) => {
  const question = await Question
    .findById(req.params.questionId)
    .populate('user', 'name')
    .populate('topic', 'title');

  return res.status(200).json(question);
});

questionsroute.post('/:questionId/answers', async (req, res) => {
  const answerData = {
    text: req.body.text,
    question: req.params.questionId,
    user: req.user._id,
  };
  const answer =  new Answer(answerData);
  await answer.save();
  return res.status(201).json(answer);
});

questionsroute.get('/:questionId/answers', async (req, res) => {
  const answers = await Answer
    .find({question: req.params.questionId})
    .populate('user', 'name')
    .populate('user', 'photo');

  return res.status(200).json(answers);
});

questionsroute.post('/:questionId/answers', async (req, res) => {
  const answerData = {
    text: req.body.text,
    question: req.params.questionId,
    user: req.user._id,
  };
  const answer =  new Answer(answerData);
  await answer.save();
  return res.status(201).json(answer);
});
