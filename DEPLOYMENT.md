# 🚀 Vercel Deployment Guide - Black & Gold eCommerce

## 📋 **Deployment Architecture**

```
┌─────────────────┐
│   Frontend      │ → Vercel (Free)
│   (React/Vite)  │
└─────────────────┘
         ↓
┌─────────────────┐
│   Backend       │ → Railway/Render (Free)
│   (Node.js)     │
└─────────────────┘
         ↓
┌─────────────────┐
│   MongoDB       │ → MongoDB Atlas (Free)
│   (Database)    │
└─────────────────┘
```

---

## 🎨 **Frontend - Deploy to Vercel**

### **Step 1: Push to GitHub**

```bash
cd frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/blackgold-frontend.git
git push -u origin main
```

### **Step 2: Connect to Vercel**

1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `blackgold-frontend` repository
4. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### **Step 3: Add Environment Variables**

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend.railway.app/api
```

### **Step 4: Deploy**

Click **"Deploy"** - Your frontend will be live at:
```
https://blackgold-frontend.vercel.app
```

---

## ⚙️ **Backend - Deploy to Railway**

### **Step 1: Push to GitHub**

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/blackgold-backend.git
git push -u origin main
```

### **Step 2: Connect to Railway**

1. Go to: https://railway.app/
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose `blackgold-backend` repository

### **Step 3: Add Environment Variables**

In Railway Dashboard → Variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blackgold-ecommerce?retryWrites=true&w=majority
JWT_SECRET=your-production-jwt-secret-key-change-this
JWT_EXPIRE=7d
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@blackgold.com
FRONTEND_URL=https://blackgold-frontend.vercel.app
```

### **Step 4: Deploy**

Railway will auto-deploy. Your backend will be live at:
```
https://blackgold-backend-production.up.railway.app
```

---

## 🗄️ **MongoDB Atlas - Production Setup**

### **Step 1: Configure Network Access**

1. Go to: https://cloud.mongodb.com/
2. Click **"Network Access"**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

### **Step 2: Get Production Connection String**

1. Click **"Database"**
2. Click **"Connect"**
3. Select **"Connect your application"**
4. Copy the connection string
5. Update in Railway environment variables

---

## 🔧 **Update Frontend API URL**

After backend is deployed, update frontend:

### **Option 1: Vercel Environment Variables**

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `VITE_API_URL=https://your-backend.railway.app/api`
5. **Redeploy** to apply changes

### **Option 2: Update vercel.json**

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend.railway.app/api/$1"
    }
  ]
}
```

---

## ✅ **Pre-Deployment Checklist**

### **Frontend:**
- [ ] `.env.production` created
- [ ] `vercel.json` configured
- [ ] API URL updated to production backend
- [ ] Build locally: `npm run build` (no errors)
- [ ] Pushed to GitHub

### **Backend:**
- [ ] `.env` variables set in Railway
- [ ] MongoDB Atlas network access configured
- [ ] CORS updated with production frontend URL
- [ ] Test locally: `npm run dev`
- [ ] Pushed to GitHub

### **Database:**
- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] Network access allows all IPs (0.0.0.0/0)
- [ ] Connection string tested

---

## 🧪 **Test Production Deployment**

### **1. Test Backend:**

```bash
curl https://your-backend.railway.app/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Black & Gold eCommerce API is running",
  "timestamp": "2026-02-27T..."
}
```

### **2. Test Frontend:**

1. Open: `https://blackgold-frontend.vercel.app`
2. Test login with: `admin@blackgold.com` / `admin123`
3. Test product browsing
4. Test cart functionality
5. Test checkout

---

## 🔒 **Security Considerations**

### **Production .env Values:**

```env
# NEVER commit these to GitHub!

# Backend (Railway)
JWT_SECRET=use-a-long-random-string-here-min-32-chars
MONGODB_URI=mongodb+srv://...
NODE_ENV=production

# Frontend (Vercel)
VITE_API_URL=https://your-backend.railway.app/api
```

### **Add to .gitignore:**

```
# Backend
.env
uploads/*
!uploads/.gitkeep

# Frontend
.env
.env.production
dist/
```

---

## 🐛 **Troubleshooting**

### **Frontend Issues:**

**Problem:** API calls failing
```
Solution: Check VITE_API_URL in Vercel environment variables
```

**Problem:** 404 on refresh
```
Solution: Add to vercel.json:
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### **Backend Issues:**

**Problem:** MongoDB connection failed
```
Solution: 
1. Check MongoDB Atlas network access (0.0.0.0/0)
2. Verify connection string in Railway
3. Check database user permissions
```

**Problem:** CORS errors
```
Solution: Update backend server.js CORS config:
app.use(cors({
  origin: ['https://blackgold-frontend.vercel.app'],
  credentials: true
}));
```

---

## 📊 **Free Tier Limits**

| Service | Free Tier | Paid Plan |
|---------|-----------|-----------|
| **Vercel** | 100GB bandwidth/mo | $20/mo |
| **Railway** | $5 credit/mo (~500 hrs) | $5/mo |
| **MongoDB Atlas** | 512MB storage | $9/mo |

---

## 🎯 **Alternative Backend Hosting**

If Railway doesn't work well, try:

### **Render (Free)**
- Website: https://render.com/
- Free tier: 750 hours/month
- Auto-deploy from GitHub

### **Heroku (Paid)**
- Website: https://www.heroku.com/
- Starts at $7/month
- Very reliable

### **Fly.io (Free Tier)**
- Website: https://fly.io/
- Free: 3 shared VMs
- Good for Node.js

---

## 📞 **Need Help?**

Check these logs:
- **Vercel:** Dashboard → Deployments → Click deployment → View logs
- **Railway:** Dashboard → Project → Deployments → View logs
- **MongoDB:** Atlas → Clusters → Logs

---

**Your Black & Gold eCommerce is ready for production deployment!** 🚀
