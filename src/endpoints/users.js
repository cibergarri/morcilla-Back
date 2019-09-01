import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { User } from '../models/user';
import * as dbHelper from '../helpers/mongo/dbHelper';
import { notificationsRoute } from './notifications';

export const usersRoute = Router();

usersRoute.use((req, res, next) => {
  next();
});

usersRoute.get('/', async (req, res) => {
  const users = await User.find();
  return res.status(200).json(users);
});

usersRoute.get('/me', async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json('user not found');
  return res.status(200).json(user);
});