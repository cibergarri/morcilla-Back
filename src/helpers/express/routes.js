import express from 'express';
import passport from 'passport';

import { authRoute } from '../../endpoints/auth';
import { notificationsRoute } from '../../endpoints/notifications';
import { usersRoute } from '../../endpoints/users';
import { clockRoute } from '../../endpoints/clock';
import { topicsRoute } from '../../endpoints/topics';
import { questionsroute } from '../../endpoints/questions';
import { answersRoute } from '../../endpoints/answers';
// import { docsRoute } from '../swagger/docs';

const apiRoutes = express.Router();
apiRoutes.use('/answers', answersRoute);
apiRoutes.use('/clock', clockRoute);
apiRoutes.use('/notifications', notificationsRoute);
apiRoutes.use('/questions', questionsroute);
apiRoutes.use('/topics', topicsRoute);
apiRoutes.use('/users', usersRoute);

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
routes.use('/', express.static(process.cwd() + '/app/dist/app'));
routes.use('*', function(req, res) {
  res.sendfile('./app/dist/app/')
})

