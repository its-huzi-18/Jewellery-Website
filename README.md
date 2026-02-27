# Black & Gold Pakistan - Premium eCommerce Website

A complete full-stack eCommerce website built with a Black & Gold theme, specifically designed for Pakistan market. Features a modern, responsive UI with mobile-first design principles.

## 💰 Currency & Pricing
- **Currency:** Pakistani Rupee (PKR) - Rs.
- **Free Shipping:** On orders over Rs. 15,000
- **Standard Shipping:** Rs. 200
- **No International Shipping:** Pakistan only

## 📍 Pakistan-Specific Features
- **Currency:** PKR (Rs.)
- **Phone Format:** +92 XXX XXXXXXX
- **Address Format:** Pakistani cities and provinces
- **Major Cities:** Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, etc.
- **Provinces:** Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Gilgit-Baltistan

## 👤 Sample Login Credentials

### Admin Account
- **Email:** `admin@blackgold.pk`
- **Password:** `admin123`

### User Account
- **Email:** `user@blackgold.pk`
- **Password:** `user123`

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **React Router v6** - Routing
- **TailwindCSS** - Styling
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password Hashing
- **Multer** - File Upload
- **Sharp** - Image Processing

## 📁 Project Structure

```
ecommerce-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   └── orderController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Cart.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── cartRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── utils/
│   │   │   └── seed.js
│   │   └── server.js
│   ├── uploads/
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── admin/
    │   │       ├── AdminLayout.jsx
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminProducts.jsx
    │   │       └── AdminOrders.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.js
    └── postcss.config.js
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd ecommerce-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blackgold-ecommerce
JWT_SECRET=blackgold-ecommerce-secret-key-2024
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### 4. Seed the Database

```bash
cd backend
npm run seed
```

This will create:
- Sample admin and user accounts
- Sample products with images
- Empty carts for users

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 👤 Sample Login Credentials

### Admin Account
- **Email:** `admin@blackgold.com`
- **Password:** `admin123`

### User Account
- **Email:** `user@blackgold.com`
- **Password:** `user123`

## 🎨 Design Features

### Color Scheme
- **Primary:** Black (#0A0A0A)
- **Accent:** Gold (#C9A54D)
- **Background:** Light Gray (#F5F5F5)

### Typography
- **Headings:** Playfair Display (Serif)
- **Body:** Inter (Sans-serif)

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🛒 Features

### Customer Features
- ✅ User Registration & Login
- ✅ Product Browsing & Search
- ✅ Product Filtering by Category
- ✅ Product Detail Pages
- ✅ Shopping Cart
- ✅ Checkout Process
- ✅ Order History
- ✅ Profile Management
- ✅ Password Change

### Admin Features
- ✅ Dashboard with Statistics
- ✅ Product Management (CRUD)
- ✅ Image Upload with Auto-Resize
- ✅ Order Management
- ✅ Order Status Updates
- ✅ Sales Analytics
- ✅ Top Selling Products View

## 🖼️ Image Handling

The application automatically handles product images:
- **Auto-resize** large images to 800x800px
- **Upscale** small images to 400x400px minimum
- **Convert** to WebP format for optimization
- **Generate** thumbnails (300x300px)
- **Maintain** aspect ratio

## 📦 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/top-selling` | Get top selling products |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart/add` | Add to cart |
| PUT | `/api/cart/update/:id` | Update cart item |
| DELETE | `/api/cart/remove/:id` | Remove from cart |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my-orders` | Get user orders |
| GET | `/api/orders` | Get all orders (Admin) |
| PUT | `/api/orders/:id/status` | Update order status (Admin) |

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation
- File upload restrictions

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly UI elements
- Optimized images for mobile
- Hamburger menu for navigation
- Swipeable product images
- Bottom navigation on mobile

## 🚀 Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📝 Notes

1. Make sure MongoDB is running before starting the backend
2. The `uploads` folder will be created automatically for product images
3. Default admin credentials should be changed in production
4. Enable HTTPS for production deployment

## 📄 License

This project is created for educational purposes.

---

**Built with ❤️ using the MERN Stack**
