import express from 'express';
import {
  getSettings,
  updateSettings,
  updateAdminProfile,
  getAdminProfile,
  updateSocialMedia,
  updateContact,
  updateBusinessSettings,
  toggleMaintenanceMode
} from '../controllers/settingController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload, handleMulterError } from '../middleware/upload.js';

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

// Settings routes
router.get('/', getSettings);
router.put('/', updateSettings);

// Admin profile routes
router.get('/admin-profile', getAdminProfile);
router.put('/admin-profile', upload.single('profileImage'), handleMulterError, updateAdminProfile);

// Specific settings routes
router.put('/social-media', updateSocialMedia);
router.put('/contact', updateContact);
router.put('/business', updateBusinessSettings);
router.put('/maintenance-mode', toggleMaintenanceMode);

export default router;
