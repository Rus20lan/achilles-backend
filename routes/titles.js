import express from 'express';
import passport from 'passport';
import {
  getAllTitles,
  getTitleBrevis,
  getTitlesByPage,
} from '../controllers/titles.js';
const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), getAllTitles);
router.get(
  '/brevis',
  passport.authenticate('jwt', { session: false }),
  getTitleBrevis
);
router.get(
  '/paginated',
  passport.authenticate('jwt', { session: false }),
  getTitlesByPage
);

export { router };
