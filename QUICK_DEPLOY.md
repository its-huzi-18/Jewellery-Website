# 🚀 Quick Deployment Checklist

## ✅ **Pre-Deployment (Do This First)**

### 1. Create GitHub Repositories

```bash
# Create TWO repositories on GitHub:
# 1. blackgold-frontend
# 2. blackgold-backend
```

### 2. Update Backend .env for Production

Create `backend/.env.production`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blackgold-ecommerce?retryWrites=true&w=majority
JWT_SECRET=production-jwt-secret-min-32-characters-random
JWT_EXPIRE=7d
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@blackgold.com
FRONTEND_URL=https://your-frontend.vercel.app
```

### 3. Update MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Network Access → Add IP Address
3. Select: **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click Confirm

---

## 🎨 **Frontend - Vercel Deployment**

### Step 1: Push to GitHub

```bash
cd frontend
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blackgold-frontend.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to: https://vercel.com/new
2. Import your `blackgold-frontend` repository
3. Configure:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 3: Add Environment Variable

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Step 4: Deploy

Click **"Deploy"**

**Frontend URL:** `https://blackgold-frontend.vercel.app`

---

## ⚙️ **Backend - Railway Deployment**

### Step 1: Push to GitHub

```bash
cd backend
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/blackgold-backend.git
git push -u origin main
```

### Step 2: Deploy to Railway

1. Go to: https://railway.app/
2. Click **"New Project"**
3. **"Deploy from GitHub repo"**
4. Select `blackgold-backend`

### Step 3: Add Environment Variables

In Railway Dashboard → Variables → Add Variable:

```
PORT=5000
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/blackgold-ecommerce?retryWrites=true&w=majority
JWT_SECRET=production-jwt-secret-min-32-characters-random
JWT_EXPIRE=7d
NODE_ENV=production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@blackgold.com
FRONTEND_URL=https://blackgold-frontend.vercel.app
```

### Step 4: Deploy

Railway auto-deploys!

**Backend URL:** `https://blackgold-backend-production.up.railway.app`

---

## 🔗 **Connect Frontend to Backend**

### Update Vercel Environment Variable

1. Go to Vercel Dashboard
2. Select your frontend project
3. Settings → Environment Variables
4. Update `VITE_API_URL` to your Railway backend URL
5. **Redeploy** (Deployments → Redeploy)

---

## ✅ **Test Deployment**

### 1. Test Backend Health

```bash
curl https://your-backend.railway.app/api/health
```

Expected:
```json
{
  "success": true,
  "message": "Black & Gold eCommerce API is running",
  "timestamp": "..."
}
```

### 2. Test Frontend

1. Open: `https://blackgold-frontend.vercel.app`
2. Login: `admin@blackgold.com` / `admin123`
3. Browse products
4. Add to cart
5. Test checkout

---

## 🐛 **Common Issues & Fixes**

### ❌ CORS Error

**Problem:** Frontend can't connect to backend

**Fix:** Update backend `server.js` CORS:
```javascript
app.use(cors({
  origin: ['https://blackgold-frontend.vercel.app'],
  credentials: true
}));
```

### ❌ MongoDB Connection Failed

**Problem:** Backend can't connect to MongoDB

**Fix:**
1. Check MongoDB Atlas Network Access (0.0.0.0/0)
2. Verify connection string in Railway
3. Check database user password

### ❌ 404 on Frontend Refresh

**Problem:** Refreshing gives 404

**Fix:** Add to `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### ❌ API Calls Failing

**Problem:** Frontend can't reach backend

**Fix:** 
1. Check `VITE_API_URL` in Vercel environment variables
2. Ensure backend URL is correct (https, not http)
3. Check Railway deployment logs

---

## 📊 **Free Tier Limits**

| Service | Free Limit | Notes |
|---------|-----------|-------|
| **Vercel** | 100GB/mo bandwidth | Enough for ~50k visits |
| **Railway** | $5 credit/mo | ~500 hours runtime |
| **MongoDB** | 512MB storage | Enough for ~10k products |

---

## 🔒 **Security Checklist**

- [ ] Change JWT_SECRET to random 32+ characters
- [ ] Use Gmail App Password (not regular password)
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set NODE_ENV=production
- [ ] Never commit .env files
- [ ] Use HTTPS for all production URLs

---

## 📞 **Support**

**Logs:**
- Vercel: Dashboard → Deployments → View Logs
- Railway: Dashboard → Project → View Logs
- MongoDB: Atlas → Clusters → Logs

**Need help?** Check DEPLOYMENT.md for detailed guide!

---

**Your Black & Gold eCommerce is production-ready!** 🎉
