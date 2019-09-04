import { Router } from 'express';
import { logger } from '../helpers/winston/log';
import { Project } from '../models/project';

export const projectsRoute = Router();

projectsRoute.use((req, res, next) => {
  logger.info('Notifications request %o', req.body);
  next();
});

projectsRoute.post('/',
  async (req, res, next) => {
    try {
      const project = new Project(req.body);
      project.save();
      return res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }
);

projectsRoute.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find();
    return res.status(200).json(projects || []);
  } catch (error) {
    next(error);
  }
});
