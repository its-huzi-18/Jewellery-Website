import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET);
};

// Initialize Cloudinary
let cloudinary = null;
let CloudinaryStorage = null;
let initialized = false;

const initCloudinary = () => {
  if (initialized) return cloudinary !== null;
  initialized = true;
  
  if (isCloudinaryConfigured()) {
    try {
      const cloudinaryModule = require('cloudinary').v2;
      cloudinaryModule.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
      cloudinary = cloudinaryModule;
      CloudinaryStorage = require('multer-storage-cloudinary').CloudinaryStorage;
      return true;
    } catch (error) {
      console.error('Failed to initialize Cloudinary:', error.message);
      return false;
    }
  }
  return false;
};

// Get storage configuration
const getStorage = () => {
  if (initCloudinary()) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'jewellery-products',
        allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
        transformation: [
          { width: 800, height: 800, crop: 'limit', quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        public_id: () => uuidv4()
      }
    });
  }
  // Fallback to memory storage
  return multer.memoryStorage();
};

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Configure multer
export const upload = multer({
  storage: getStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// Image processing
export const processImage = async (file) => {
  if (!cloudinary) {
    console.warn('Cloudinary not configured - returning file info');
    return {
      url: file.location || file.path || 'https://via.placeholder.com/800x800?text=Product+Image',
      publicId: file.filename || 'placeholder',
      thumbnailUrl: file.location || file.path || 'https://via.placeholder.com/300x300?text=Product+Image'
    };
  }

  try {
    return {
      url: file.path,
      publicId: file.filename,
      thumbnailUrl: cloudinary.url(file.filename, {
        transformation: [
          { width: 300, height: 300, crop: 'fill' },
          { quality: 'auto:good' }
        ]
      })
    };
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
};

// Error handler for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};
