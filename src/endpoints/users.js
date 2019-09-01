import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { User } from '../models/user';
import * as dbHelper from '../helpers/mongo/dbHelper';
import { notificationsRoute } from './notifications';

export const usersRoute = Router();

usersRoute.use((req, res, next) => {
  logger.info('User request', req.params);
  next();
});

usersRoute.post('/', (req, res) => {
  const user = new User(req.body);
  dbHelper.save(user)

  return res.status(201).json(user);
});

usersRoute.use('/:id', (req, res, next) => {
  res.locals.userId = req.params.id;
  next();
});
usersRoute.use('/:id', notificationsRoute);