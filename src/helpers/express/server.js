import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { logger } from '../winston/log';
import { routes } from './routes';
import { initializePassport } from '../passport/auth';

const portNumber = process.env.PORT || 3000;
export const data = {};

export const initServer = async () => {
  return new Promise(async (resolve) => {
    const app = express();
    if(process.env.NODE_ENV === 'local'){
      console.log('cors activated')
      app.use(cors());
    }
    app.use('/api', bodyParser.urlencoded({ extended: true, limit: '16mb' }));
    app.use('/api', bodyParser.json({ limit: '16mb' }));
    initializePassport(app);
    app.use(routes);    
    const server = app.listen(portNumber, () => {
      logger.info('Server listening on port %s!', portNumber);
      data.app = app;
      data.server = server;
      resolve();
    });
  });
};

export const close = async () => {
  return new Promise((resolve) => {
    if (data.server) {
      data.server.close(() => {
        logger.info('Server closed');
        resolve();
      });
    } else {
      resolve();
    }
  });
};
