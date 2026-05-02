import express from 'express';
import { getProgress, logProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/log').post(protect, logProgress);
router.route('/:sessionId').get(protect, getProgress);

export default router;
