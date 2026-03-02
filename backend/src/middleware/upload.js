import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Simple memory storage - works everywhere including Vercel
// Updated: 2026-03-02 - Fixed for ES modules
const storage = multer.memoryStorage();

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
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});

// Image processing - returns file info
export const processImage = async (file) => {
  return {
    buffer: file.buffer,
    originalname: file.originalname,
    mimetype: file.mimetype
  };
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

// Placeholder functions for Cloudinary (to be implemented)
export const uploadToCloudinary = async () => {
  throw new Error('Cloudinary upload not implemented yet');
};

export const deleteFromCloudinary = async () => {
  throw new Error('Cloudinary delete not implemented yet');
};
