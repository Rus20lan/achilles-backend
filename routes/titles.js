import express from 'express';
import passport from 'passport';
import { getAllTitles } from '../controllers/titles.js';
const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), getAllTitles);

export { router };
