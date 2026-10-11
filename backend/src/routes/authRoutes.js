import express from 'express';
import {
  register,
  login,
  getMe,
  updateFavorites,
  forgotPasswordCheck,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/favorites', protect, updateFavorites);
router.post('/forgot-password-check', forgotPasswordCheck);
router.post('/reset-password', resetPassword);

export default router;
