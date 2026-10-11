import express from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getNotifications);
router.post('/', protect, createNotification);
router.put('/:id/read', optionalAuth, markAsRead);
router.put('/read-all', optionalAuth, markAllAsRead);

export default router;
