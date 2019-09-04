import passport from 'passport';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { logger } from '../helpers/winston/log';
import { jwtConfig } from '../helpers/passport/jwt';
const { secret, issuer: iss, audience: aud } = jwtConfig;

export const authRoute = Router();

const createToken = (req, res) => {
  const { _id: sub, githubId, name } = req.user;
  const token = jwt.sign({ sub, githubId, name, iss, aud }, secret, { expiresIn: '2h' });
  res.status(201).json(token);
};

authRoute.use((req, res, next) => {
  logger.info('Auth request', req);
  next();
});

authRoute.get('/github', passport.authenticate('github'));

authRoute.post('/github/token',
  passport.authenticate('github', { failureRedirect: '/' }),
  createToken);
