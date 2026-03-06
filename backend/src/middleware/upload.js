import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Support both CLOUDINARY_URL and separate credentials
let isCloudinaryConfigured = false;

if (process.env.CLOUDINARY_URL) {
  // CLOUDINARY_URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
  cloudinary.v2.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
  isCloudinaryConfigured = true;
  console.log('Cloudinary configured using CLOUDINARY_URL');
} else if (process.env.CLOUDINARY_CLOUD_NAME &&
           process.env.CLOUDINARY_API_KEY &&
           process.env.CLOUDINARY_API_SECRET) {
  // Separate credentials format
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  isCloudinaryConfigured = true;
  console.log('Cloudinary configured using separate credentials');
}

// Log Cloudinary status
console.log('=== Cloudinary Configuration Status ===');
console.log('Cloudinary configured:', isCloudinaryConfigured);
if (!isCloudinaryConfigured) {
  console.warn('WARNING: Cloudinary credentials not found. Image uploads will NOT work in production (Vercel).');
  console.warn('For local development, images will be saved to disk.');
  console.warn('For Vercel deployment, you MUST add Cloudinary environment variables.');
  console.warn('Add either CLOUDINARY_URL or all three: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}
console.log('======================================');

// Simple memory storage - stores files in memory temporarily
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

// Configure multer to use memory storage
// Files will be uploaded to Cloudinary manually in the controller
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
  console.log('=== Multer Error Handler ===');
  console.log('Error present:', !!err);
  if (err) {
    console.log('Error name:', err.name);
    console.log('Error message:', err.message);
    console.log('Error stack:', err.stack);
  }
  console.log('Request files:', req.files?.length || 0);
  console.log('===========================');
  
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

// Cloudinary upload helper
export const uploadToCloudinary = async (file) => {
  console.log('=== Uploading to Cloudinary ===');
  console.log('File originalname:', file.originalname);
  console.log('File mimetype:', file.mimetype);
  console.log('File size:', file.size);
  console.log('File buffer exists:', !!file.buffer);
  console.log('File buffer length:', file.buffer?.length || 0);
  
  return new Promise((resolve, reject) => {
    if (!file.buffer || file.buffer.length === 0) {
      console.error('Empty file buffer!');
      return reject(new Error('Empty file'));
    }

    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: 'jewellery-products',
        resource_type: 'image',
        public_id: `product-${Date.now()}-${Math.round(Math.random() * 1E9)}`
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        console.log('Cloudinary upload success:', result.secure_url);
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );
    
    // Write the buffer to the upload stream
    uploadStream.end(file.buffer);
  });
};

// Cloudinary delete helper
export const deleteFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
