import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Request logging
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.originalUrl || req.url}`);
  next();
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', '*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Black & Gold eCommerce API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Vercel handler
export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  console.log('Incoming request:', req.method, req.url);

  // Import routes dynamically
  const [authRoutes, productRoutes, cartRoutes, orderRoutes, settingRoutes, connectDB] = await Promise.all([
    import('../src/routes/authRoutes.js').then(m => m.default),
    import('../src/routes/productRoutes.js').then(m => m.default),
    import('../src/routes/cartRoutes.js').then(m => m.default),
    import('../src/routes/orderRoutes.js').then(m => m.default),
    import('../src/routes/settingRoutes.js').then(m => m.default),
    import('../src/config/db.js').then(m => m.default),
  ]);

  // Connect to DB
  try {
    await connectDB();
    console.log('Database connected');
  } catch (err) {
    console.error('DB connection error:', err.message);
  }

  // Setup routes once
  if (!app._routesSetup) {
    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/cart', cartRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/settings', settingRoutes);
    app._routesSetup = true;
    console.log('Routes configured');
  }

  return app(req, res);
}
