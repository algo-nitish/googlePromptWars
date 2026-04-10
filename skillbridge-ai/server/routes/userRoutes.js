import express from 'express';
import multer from 'multer';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { storage } from '../services/cloudinaryService.js';

const router = express.Router();
const upload = multer({ storage });

router.route('/profile')
  .get(protect, getProfile)
  .patch(protect, updateProfile);

router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
