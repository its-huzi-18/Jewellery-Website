import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// ===== SPECIFIC ROUTES FIRST (before parameterized routes) =====

// Admin routes - specific
router.get('/stats', protect, authorize('admin'), getOrderStats);
router.get('/', protect, authorize('admin'), getAllOrders);

// User routes - specific  
router.get('/my-orders', protect, getMyOrders);
router.post('/', protect, createOrder);

// Parameterized routes - specific patterns first
router.get('/:id/cancel', protect, cancelOrder);
router.get('/:id/status', protect, authorize('admin'), updateOrderStatus);

// Generic parameterized route - MUST BE LAST
router.get('/:id', protect, getOrder);

export default router;
