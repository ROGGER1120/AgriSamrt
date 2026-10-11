import express from 'express';
import {
  getCropPrices,
  compareMarketPrices,
  getPriceHistory,
  getDashboardSummary,
  getPriceMeta,
  createCropPrice,
  updateCropPrice,
  deleteCropPrice,
} from '../controllers/priceController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCropPrices);
router.get('/compare', compareMarketPrices);
router.get('/history', getPriceHistory);
router.get('/summary', getDashboardSummary);
router.get('/meta', getPriceMeta);

// Protected routes for managing crop prices (Admin or Authenticated Farmer/Admin)
router.post('/', protect, createCropPrice);
router.put('/:id', protect, updateCropPrice);
router.delete('/:id', protect, deleteCropPrice);

export default router;
