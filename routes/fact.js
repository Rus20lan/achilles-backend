import express from 'express';
import passport from 'passport';
import {
  getFactInValuesField,
  setFact,
  updateFact,
  updateFactById,
  deleteFactById,
  saveFact,
} from '../controllers/fact.js';

const router = express.Router();

router.get('/volumeId=:volumeId', setFact);
router.post('/save', setFact);

router.get('/:id/value/:idValue', getFactInValuesField);
router.post('/create', saveFact);
// router.put('/:id/value/:idValue', updateFact);

router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  updateFactById
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteFactById
);

export { router };
