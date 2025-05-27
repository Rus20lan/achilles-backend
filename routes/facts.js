import express from 'express';
import passport from 'passport';
import { getAllFacts, getFactsByPage } from '../controllers/facts.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), getAllFacts);
// router.get(
//   "/paginated",
//   passport.authenticate("jwt", { session: false }),
//   getFactsByPage
// );

router.get(
  '/paginated',
  passport.authenticate('jwt', { session: false }),
  getFactsByPage
);

export { router };
