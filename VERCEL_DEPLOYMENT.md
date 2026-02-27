# 🚀 Deploy Black & Gold eCommerce on Vercel (Frontend + Backend)

## 📋 **Deployment Architecture**

```
┌──────────────────┐
│   Frontend       │ → Vercel Project 1
│   (React/Vite)   │ → your-frontend.vercel.app
└──────────────────┘
         ↓
┌──────────────────┐
│   Backend        │ → Vercel Project 2
│   (Node.js)      │ → your-backend.vercel.app
└──────────────────┘
         ↓
┌──────────────────┐
│   MongoDB        │ → MongoDB Atlas (Cloud)
│   (Database)     │ → Free 512MB
└──────────────────┘
```

---

## ✅ **Pre-Deployment Setup**

### **1. MongoDB Atlas Configuration**

1. Go to: https://cloud.mongodb.com/
2. **Network Access** → Add IP Address
3. Select: **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **Confirm**

### **2. Prepare Environment Variables**

Create these for production:

**Backend Variables:**
```env
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blackgold-ecommerce
JWT_SECRET=your-production-jwt-secret-32-characters-minimum-random
JWT_EXPIRE=7d
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@blackgold.com
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend Variables:**
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🎨 **Frontend Deployment (Vercel)**

### **Step 1: Prepare Frontend**

```bash
cd frontend
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
```

### **Step 2: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/blackgold-frontend.git
git push -u origin main
```

### **Step 3: Deploy to Vercel**

1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select `blackgold-frontend` repository
4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variable:**
   - Click **"Environment Variables"**
   - Add: `VITE_API_URL` = `https://your-backend.vercel.app/api` (update after backend deployment)

6. Click **"Deploy"**

**Frontend URL:** `https://blackgold-frontend.vercel.app`

---

## ⚙️ **Backend Deployment (Vercel)**

### **Step 1: Prepare Backend**

```bash
cd backend
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
```

### **Step 2: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/blackgold-backend.git
git push -u origin main
```

### **Step 3: Deploy to Vercel**

1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select `blackgold-backend` repository
4. **Configure Project:**
   - **Framework Preset:** Other
   - **Build Command:** `npm install --production`
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`

5. **Add Environment Variables:**

Click **"Environment Variables"** and add:

```
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blackgold-ecommerce
JWT_SECRET=your-production-jwt-secret-32-characters-minimum
JWT_EXPIRE=7d
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@blackgold.com
```

6. Click **"Deploy"**

**Backend URL:** `https://blackgold-backend.vercel.app`

---

## 🔗 **Connect Frontend to Backend**

### **Update Frontend Environment Variable**

1. Go to Vercel Dashboard
2. Select `blackgold-frontend` project
3. **Settings** → **Environment Variables**
4. Edit `VITE_API_URL`:
   - Value: `https://blackgold-backend.vercel.app/api`
5. Click **Save**
6. **Redeploy:**
   - Go to **Deployments**
   - Click **"Redeploy"** on latest deployment

---

## ✅ **Test Deployment**

### **1. Test Backend API**

```bash
# Health check
curl https://blackgold-backend.vercel.app/api/health

# Expected response:
# {"success":true,"message":"Black & Gold eCommerce API is running","timestamp":"..."}
```

### **2. Test Frontend**

1. Open: https://blackgold-frontend.vercel.app
2. Login: `admin@blackgold.com` / `admin123`
3. Browse products
4. Add to cart
5. Test checkout

### **3. Test API Endpoints**

```bash
# Get products
curl https://blackgold-backend.vercel.app/api/products

# Login
curl -X POST https://blackgold-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@blackgold.com","password":"admin123"}'
```

---

## 🔧 **Vercel Project Structure**

```
ecommerce-project/
├── frontend/                  # Vercel Project 1
│   ├── src/
│   ├── public/
│   ├── vercel.json           ← Vercel config
│   ├── .env.production       ← Production env
│   └── package.json
│
└── backend/                   # Vercel Project 2
    ├── src/
    │   └── server.js         ← Vercel entry point
    ├── vercel.json           ← Vercel config
    └── package.json
```

---

## 🐛 **Troubleshooting**

### **Problem: Backend 500 Error**

**Solution:**
1. Check MongoDB Atlas network access (0.0.0.0/0)
2. Verify MONGODB_URI in Vercel environment variables
3. Check Vercel Function logs: Dashboard → Functions → View Logs

### **Problem: Frontend Can't Connect to Backend**

**Solution:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Ensure backend URL is correct (https, not http)
3. Check CORS in backend server.js

### **Problem: CORS Errors**

**Solution:** Update `backend/src/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://blackgold-frontend.vercel.app',  // Your frontend URL
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **Problem: File Upload Not Working**

**Note:** Vercel Serverless Functions have limitations:
- Max payload: 6MB (Hobby plan)
- Files stored temporarily only

**Solution:** Use cloud storage:
- Cloudinary (images)
- AWS S3 (files)
- Uploadthing (easy integration)

---

## 📊 **Vercel Free Tier Limits**

| Resource | Limit | Notes |
|----------|-------|-------|
| **Bandwidth** | 100GB/mo | ~50,000 visits |
| **Serverless Functions** | 100GB-hours | ~100,000 requests/day |
| **Build Minutes** | 6,000 min/mo | Plenty for updates |
| **Environment Variables** | Unlimited | Per project |

---

## 🔒 **Security Checklist**

- [ ] MongoDB Atlas IP whitelist set to 0.0.0.0/0
- [ ] JWT_SECRET is 32+ random characters
- [ ] Gmail App Password (not regular password)
- [ ] NODE_ENV=production in Vercel
- [ ] .env files in .gitignore
- [ ] CORS configured with production URLs
- [ ] HTTPS enforced (Vercel does this automatically)

---

## 📝 **Environment Variables Summary**

### **Backend (Vercel Project Settings):**

| Variable | Value | Required |
|----------|-------|----------|
| `MONGODB_URI` | mongodb+srv://... | ✅ Yes |
| `JWT_SECRET` | random-32-chars-min | ✅ Yes |
| `JWT_EXPIRE` | 7d | Optional |
| `NODE_ENV` | production | ✅ Yes |
| `EMAIL_USER` | your-email@gmail.com | Optional |
| `EMAIL_PASS` | gmail-app-password | Optional |
| `ADMIN_EMAIL` | admin@blackgold.com | Optional |
| `FRONTEND_URL` | https://your-frontend.vercel.app | Optional |

### **Frontend (Vercel Project Settings):**

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_API_URL` | https://your-backend.vercel.app/api | ✅ Yes |

---

## 🎯 **Deployment Commands**

### **Quick Deploy Script:**

```bash
# Deploy Backend
cd backend
git add .
git commit -m "Deploy to Vercel"
git push
vercel --prod

# Deploy Frontend
cd frontend
git add .
git commit -m "Deploy to Vercel"
git push
vercel --prod
```

---

## 📞 **Need Help?**

### **Vercel Dashboard:**
- **Frontend:** https://vercel.com/dashboard
- **Backend:** https://vercel.com/dashboard
- **Logs:** Project → Functions → View Logs

### **MongoDB Atlas:**
- **Cluster:** https://cloud.mongodb.com/
- **Logs:** Cluster → Logs

---

## 🎉 **You're Ready!**

Your Black & Gold eCommerce is configured for **dual Vercel deployment**:

1. **Frontend:** `https://blackgold-frontend.vercel.app`
2. **Backend:** `https://blackgold-backend.vercel.app`
3. **Database:** MongoDB Atlas (Cloud)

**Deploy now and your store will be live!** 🚀
