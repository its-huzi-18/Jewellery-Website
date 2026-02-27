# 🚀 Deploy Backend to Vercel - Quick Guide

## ✅ **Backend is NOW Ready for Vercel!**

### 📦 **What's Configured:**

- ✅ `package.json` - Build script added (no-op for Node.js)
- ✅ `vercel.json` - Serverless function configuration
- ✅ `src/server.js` - Entry point for Vercel
- ✅ `.gitignore` - Excludes node_modules, .env

---

## 🎯 **Deployment Steps:**

### **Step 1: Push to GitHub**

```bash
cd backend
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blackgold-backend.git
git push -u origin main
```

### **Step 2: Deploy to Vercel**

1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select `blackgold-backend` repository
4. **Configure Project:**
   - **Framework Preset:** Other
   - **Build Command:** `npm run build` (or leave empty)
   - **Output Directory:** (leave empty)
   - **Install Command:** `npm install`

5. **Add Environment Variables:**

Click **"Environment Variables"** and add:

```env
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blackgold-ecommerce
JWT_SECRET=your-production-jwt-secret-32-characters-minimum
JWT_EXPIRE=7d
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@blackgold.com
FRONTEND_URL=https://your-frontend.vercel.app
```

6. Click **"Deploy"**

---

## 🧪 **Test Deployment:**

### **1. Health Check:**

```bash
curl https://blackgold-backend.vercel.app/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Black & Gold eCommerce API is running",
  "timestamp": "2026-02-27T..."
}
```

### **2. Test Products API:**

```bash
curl https://blackgold-backend.vercel.app/api/products
```

### **3. Test Login:**

```bash
curl -X POST https://blackgold-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@blackgold.com","password":"admin123"}'
```

---

## ⚠️ **Important Notes:**

### **File Uploads on Vercel:**

Vercel Serverless Functions have limitations:
- **Max payload:** 6MB (Hobby plan)
- **File storage:** Temporary only (files deleted after function execution)

**Solution for Production:**
Use cloud storage:
- **Cloudinary** (images) - Free tier available
- **AWS S3** (files) - Free tier available
- **Uploadthing** - Easy integration

### **MongoDB Atlas:**

Make sure:
1. Network Access set to `0.0.0.0/0` (allow from anywhere)
2. Database user has read/write permissions
3. Connection string is correct

### **CORS:**

Backend is configured to accept requests from:
- `http://localhost:5173` (local development)
- `https://your-frontend.vercel.app` (production)

Update `FRONTEND_URL` in environment variables with your actual frontend URL.

---

## 🔧 **Vercel Configuration:**

### **vercel.json:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

This tells Vercel to:
1. Use Node.js runtime for `src/server.js`
2. Route all requests to the server

### **package.json scripts:**

```json
{
  "scripts": {
    "start": "node src/server.js",
    "build": "echo 'Backend build not required - Node.js serverless'"
  }
}
```

The build script is a no-op (just prints a message) because Node.js doesn't need compilation.

---

## 📊 **Vercel Free Tier Limits:**

| Resource | Limit | Notes |
|----------|-------|-------|
| **Serverless Execution** | 100GB-hours | ~100,000 requests/day |
| **Bandwidth** | 100GB/mo | Enough for ~50k visits |
| **Function Duration** | 10 seconds | Configured in vercel.json |
| **Payload Size** | 6MB | Max request/response size |

---

## 🐛 **Troubleshooting:**

### **Problem: Function Timeout**

**Solution:**
- Increase `maxDuration` in `vercel.json`
- Optimize database queries
- Add indexing to MongoDB collections

### **Problem: MongoDB Connection Failed**

**Solution:**
1. Check MongoDB Atlas Network Access (0.0.0.0/0)
2. Verify connection string in Vercel
3. Check database user password

### **Problem: CORS Errors**

**Solution:**
Update `FRONTEND_URL` environment variable in Vercel to match your frontend URL.

### **Problem: 500 Error on Deploy**

**Check Vercel Logs:**
1. Go to Vercel Dashboard
2. Select your project
3. Click **"Functions"**
4. View logs for errors

---

## ✅ **Pre-Deployment Checklist:**

- [ ] MongoDB Atlas network access: 0.0.0.0/0
- [ ] All environment variables added to Vercel
- [ ] JWT_SECRET is 32+ random characters
- [ ] Gmail App Password (not regular password)
- [ ] FRONTEND_URL set to production URL
- [ ] Pushed to GitHub
- [ ] Deployed on Vercel

---

## 🎉 **You're Ready!**

Your backend is configured and ready to deploy on Vercel!

**Deploy now:** https://vercel.com/new

**Backend URL:** `https://blackgold-backend.vercel.app`
