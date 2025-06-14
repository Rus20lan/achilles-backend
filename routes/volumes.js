import express from 'express';
import passport from 'passport';
import { getAllVolumes, getVolumesByPage } from '../controllers/volumes.js';

const router = express.Router();

// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   getAllVolumes
// );

router.get(
  '/paginated',
  passport.authenticate('jwt', { session: false }),
  getVolumesByPage
);

router.get('/', getAllVolumes);

export { router };
