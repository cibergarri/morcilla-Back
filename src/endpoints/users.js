import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { User } from '../models/user';

export const usersRoute = Router();

usersRoute.use((req, res, next) => {
  logger.info('Users request %o', req.body);
  next();
});

usersRoute.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

usersRoute.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json('user not found');
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});
