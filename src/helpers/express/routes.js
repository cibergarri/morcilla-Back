import { Router } from 'express';
import passport from 'passport';
import serve from 'express-static';

import { authRoute } from '../../endpoints/auth';
import { notificationsRoute } from '../../endpoints/notifications';
import { usersRoute } from '../../endpoints/users';
// import { docsRoute } from '../swagger/docs';

const apiRoutes = Router();
apiRoutes.use('/users', usersRoute);
apiRoutes.use('/notifications', notificationsRoute);


const rootRoute = (req, res) => {
  res.send('Welcome!');
};

export const routes = Router();
// routes.use(logRequestsMiddleware);
// routes.use('/api-docs', docsRoute);
routes.use('/api', passport.authenticate('jwt', { session: false }), apiRoutes);
routes.get('/alive', rootRoute);
routes.use('/auth', authRoute);
routes.use('/push', serve(process.cwd() + '/static/push'));
routes.use('/', serve(process.cwd() + '/app/dist/app'));
