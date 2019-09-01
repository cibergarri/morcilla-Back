import { Router } from 'express';
import { usersRoute } from '../../endpoints/users';
import serve from 'express-static';

// import { docsRoute } from '../swagger/docs';

const apiRoutes = Router();
apiRoutes.use('/users', usersRoute);

const rootRoute = (req, res) => {
  res.send('Welcome!');
};

export const routes = Router();
// routes.use(logRequestsMiddleware);
// routes.use('/api-docs', docsRoute);
routes.use('/api', apiRoutes);
routes.get('/alive', rootRoute);
routes.use('/push', serve(__dirname + '../../../../static/push'));
routes.get('/', serve(__dirname + '../../../../app/dist'));
