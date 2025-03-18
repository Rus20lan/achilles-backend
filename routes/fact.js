import express from 'express';
import { getFactByVolumeId } from '../controllers/fact.js';

const router = express.Router();

router.get('/volumeId=:volumeId', getFactByVolumeId);

export { router };
