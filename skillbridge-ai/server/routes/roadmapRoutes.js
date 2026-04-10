import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { generateRoadmap, getRoadmapHistory, getRoadmapById, markWeekComplete } from '../controllers/roadmapController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many roadmap generation requests from this IP, please try again after an hour'
});

router.post(
  '/generate',
  protect,
  apiLimiter,
  [
    body('targetRole', 'Target role is required').not().isEmpty(),
    body('currentSkills', 'Current skills must be an array').isArray(),
  ],
  generateRoadmap
);

router.get('/history', protect, getRoadmapHistory);
router.get('/:id', protect, getRoadmapById);
router.patch('/:id/week/:weekNum/complete', protect, markWeekComplete);

export default router;
