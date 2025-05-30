import express from 'express';
import passport from 'passport';
import {
  getAllResources,
  getResourcesByPage,
  getResourcesName,
} from '../controllers/resources.js';

const router = express.Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  getAllResources
);

router.get(
  '/paginated',
  passport.authenticate('jwt', { session: false }),
  getResourcesByPage
);

router.get('/name', getResourcesName);

export { router };
