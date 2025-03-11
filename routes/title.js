import express from 'express';
import passport from 'passport';
import { getTitleById } from '../controllers/title.js';

const router = express.Router();

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  getTitleById
);

// router.get('/:id', getTitleById);

export { router };
