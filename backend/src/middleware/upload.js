import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/products');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
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

// Image processing with sharp
export const processImage = async (filePath, filename) => {
  const outputDir = path.join(__dirname, '../../uploads/products');
  const outputFilename = filename.replace(path.extname(filename), '');
  
  try {
    // Get image metadata
    const metadata = await sharp(filePath).metadata();
    const width = metadata.width;
    const height = metadata.height;
    
    // Target dimensions for product images
    const targetWidth = 800;
    const targetHeight = 800;
    
    // Calculate aspect ratio and resize
    let processedImage;
    
    if (width > targetWidth || height > targetHeight) {
      // Resize while maintaining aspect ratio
      processedImage = sharp(filePath)
        .resize(targetWidth, targetHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
    } else if (width < 400 || height < 400) {
      // Upscale small images slightly if needed
      processedImage = sharp(filePath)
        .resize(400, 400, {
          fit: 'outside',
          withoutEnlargement: false
        });
    } else {
      processedImage = sharp(filePath);
    }
    
    // Convert to webp for better compression and create thumbnail
    const webpPath = path.join(outputDir, `${outputFilename}.webp`);
    const thumbnailPath = path.join(outputDir, `${outputFilename}_thumb.webp`);
    
    // Save processed image
    await processedImage
      .webp({ quality: 85 })
      .toFile(webpPath);
    
    // Create thumbnail (300x300)
    await sharp(filePath)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);
    
    // Remove original file
    fs.unlinkSync(filePath);
    
    return {
      original: filename,
      webp: `${outputFilename}.webp`,
      thumbnail: `${outputFilename}_thumb.webp`,
      url: `/uploads/products/${outputFilename}.webp`,
      thumbnailUrl: `/uploads/products/${outputFilename}_thumb.webp`
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
