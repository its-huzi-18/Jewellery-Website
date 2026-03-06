import Product from '../models/Product.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if Cloudinary is configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET;

// Helper function to save image to disk (for local development without Cloudinary)
const saveImageToDisk = (file) => {
  const uploadDir = path.join(__dirname, '../../uploads');
  
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
  const ext = path.extname(file.originalname) || '.jpg';
  const filename = `product-${uniqueSuffix}${ext}`;
  const filepath = path.join(uploadDir, filename);

  fs.writeFileSync(filepath, file.buffer);
  
  // Return the URL path (relative to server root)
  return `/uploads/${filename}`;
};

// Helper function to process uploaded images
const processUploadedImages = async (files) => {
  if (!files || files.length === 0) return { images: [], mainImage: '' };

  let images = [];
  
  if (isCloudinaryConfigured) {
    // Upload to Cloudinary
    for (const file of files) {
      const result = await uploadToCloudinary(file);
      images.push({ url: result.url, publicId: result.publicId });
    }
  } else {
    // Save to disk
    for (const file of files) {
      const imageUrl = saveImageToDisk(file);
      images.push({ url: imageUrl, publicId: '' });
    }
  }
  
  const mainImage = images[0]?.url || '';
  return { images, mainImage };
};

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      featured,
      search,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOptions = { price: 1 };
          break;
        case 'price_desc':
          sortOptions = { price: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'bestselling':
          sortOptions = { soldCount: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    } else {
      sortOptions = { featured: -1, createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    console.log('=== Create Product Request ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('Files count:', req.files?.length || 0);
    
    const {
      title,
      description,
      price,
      discount,
      category,
      stock,
      featured,
      specifications,
      imageUrls
    } = req.body;

    // Process uploaded images
    let images = [];
    let mainImage = '';

    // Handle file uploads from req.files
    if (req.files && req.files.length > 0) {
      console.log('Processing', req.files.length, 'uploaded files...');
      const result = await processUploadedImages(req.files);
      images = result.images;
      mainImage = result.mainImage;
      console.log('Processed images:', images);
    } else if (imageUrls) {
      // Fallback to imageUrls from body (for backward compatibility)
      try {
        const parsedUrls = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;
        if (Array.isArray(parsedUrls)) {
          images = parsedUrls.map(url => ({ url, publicId: '' }));
          mainImage = images[0]?.url || '';
        }
      } catch (e) {
        console.error('Error parsing imageUrls:', e);
      }
    } else {
      console.warn('No images provided for product');
    }

    const product = await Product.create({
      title,
      description,
      price,
      discount: discount || 0,
      category,
      stock: stock || 0,
      featured: featured || false,
      images,
      mainImage,
      specifications: specifications || []
    });

    console.log('Product created successfully:', product._id);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      title,
      description,
      price,
      discount,
      category,
      stock,
      featured,
      isActive,
      specifications,
      imageUrls
    } = req.body;

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = price;
    if (discount !== undefined) product.discount = discount;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (featured !== undefined) product.featured = featured;
    if (isActive !== undefined) product.isActive = isActive;
    if (specifications) product.specifications = specifications;

    // Update images if files are uploaded
    if (req.files && req.files.length > 0) {
      const result = await processUploadedImages(req.files);
      product.images = result.images;
      product.mainImage = result.mainImage;
    } else if (imageUrls) {
      // Fallback to imageUrls from body (for backward compatibility)
      try {
        const parsedUrls = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;
        if (Array.isArray(parsedUrls)) {
          product.images = parsedUrls.map(url => ({ url, publicId: '' }));
          product.mainImage = product.images[0]?.url || '';
        }
      } catch (e) {
        console.error('Error parsing imageUrls:', e);
      }
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .sort({ featured: -1, createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(12);

    res.status(200).json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get top selling products
// @route   GET /api/products/top-selling
// @access  Public
export const getTopSellingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ soldCount: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get top selling products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update product stock (Admin only)
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
