import express from 'express';
import passport from 'passport';
import {
  getTitleById,
  saveTitle,
  updateTitle,
  deleteTitle,
} from '../controllers/title.js';

const router = express.Router();

// router.get(
//   '/:id',
//   passport.authenticate('jwt', { session: false }),
//   getTitleById
// );

router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  saveTitle
);
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  updateTitle
);
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteTitle
);
router.get('/:id', getTitleById);

export { router };
