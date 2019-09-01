import { initServer } from './helpers/express/server';
import { initializeDb } from './helpers/mongo/db';
import { logger } from './helpers/winston/log';

const run = async () => {
  try {
    await initializeDb();
    await initServer();
    logger.info('App initialized');
  } catch (err) {
    logger.error('Error initializing app');
  }
};

run();
