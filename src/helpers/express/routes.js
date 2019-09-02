import express from 'express';
import passport from 'passport';

import { authRoute } from '../../endpoints/auth';
import { notificationsRoute } from '../../endpoints/notifications';
import { usersRoute } from '../../endpoints/users';
// import { docsRoute } from '../swagger/docs';

const apiRoutes = express.Router();
apiRoutes.use('/users', usersRoute);
apiRoutes.use('/notifications', notificationsRoute);


const rootRoute = (req, res) => {
  res.send('Welcome!');
};

export const routes = express.Router();
// routes.use(logRequestsMiddleware);
// routes.use('/api-docs', docsRoute);
routes.use('/api', passport.authenticate('jwt', { session: false }), apiRoutes);
routes.get('/alive', rootRoute);
routes.use('/auth', authRoute);
routes.use('/push', express.static(process.cwd() + '/static/push'));
routes.get('*', function(req, res) {
  res.sendfile('./app/dist/app/index.html')
})
// routes.use(express.static(process.cwd() + '/app/dist/app'));
