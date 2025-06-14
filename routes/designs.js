import express from 'express';
import passport from 'passport';
import {
  getAllDesign,
  getDesignBrevis,
  getDesignsByPage,
} from '../controllers/designs.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), getAllDesign);

// router.get("/", getAllDesign);
router.get(
  '/paginated',
  passport.authenticate('jwt', { session: false }),
  getDesignsByPage
);

router.get(
  '/brevis',
  passport.authenticate('jwt', { session: false }),
  getDesignBrevis
);

export { router };
