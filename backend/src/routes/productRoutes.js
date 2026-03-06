import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getTopSellingProducts,
  updateStock
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// Debug route - test Cloudinary configuration (MUST be before /:id)
router.get('/test-upload', (req, res) => {
  const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL;
  res.json({
    success: true,
    cloudinaryConfigured: !!isCloudinaryConfigured,
    hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasCloudinaryUrl: !!process.env.CLOUDINARY_URL,
    message: isCloudinaryConfigured ? 'Cloudinary is configured' : 'Cloudinary NOT configured'
  });
});

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/top-selling', getTopSellingProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), upload.array('images', 5), handleMulterError, createProduct);
router.put('/:id', protect, authorize('admin'), upload.array('images', 5), handleMulterError, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.patch('/:id/stock', protect, authorize('admin'), updateStock);

export default router;
