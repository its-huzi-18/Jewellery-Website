# Image Upload Setup Guide

This guide explains how to fix the product image upload issue.

## Problem
When uploading product images, they were not showing because:
1. Images were stored in memory but never saved to disk or cloud
2. The backend controller wasn't processing uploaded files from `req.files`

## Solution Implemented

The code has been updated to support **two modes**:

### Mode 1: Local Development (Without Cloudinary)
- Images are saved to the `backend/uploads` directory
- Works for local testing
- **Not suitable for production** (Vercel/serverless)

### Mode 2: Production with Cloudinary (Recommended for Vercel)
- Images are uploaded to Cloudinary CDN
- Works with serverless functions (Vercel)
- Persistent storage with CDN benefits

---

## Setup Instructions

### For Local Development (Quick Start)

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Upload a product:**
   - Go to Admin → Products → Add Product
   - Fill in the details and select images
   - Click "Create Product"

3. **Images will be stored in:** `backend/uploads/`

---

### For Production (Vercel Deployment) - RECOMMENDED

You **MUST** set up Cloudinary for image uploads to work on Vercel.

#### Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After login, go to **Dashboard**
4. Copy these values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

#### Step 2: Configure Backend Environment

**Option A: Local `.env` file (for local testing with Cloudinary)**

Edit `backend/.env` and add your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Option B: Vercel Environment Variables (for production)**

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - `CLOUDINARY_CLOUD_NAME` = your-cloud-name
   - `CLOUDINARY_API_KEY` = your-api-key
   - `CLOUDINARY_API_SECRET` = your-api-secret

#### Step 3: Redeploy to Vercel

After adding the environment variables, redeploy your backend:

```bash
cd backend
git add .
git commit -m "Add Cloudinary configuration"
git push
```

Vercel will automatically redeploy with the new environment variables.

---

## How It Works

### Local Mode (No Cloudinary)
```
User uploads image → Multer (memory) → Save to backend/uploads/ → URL: /uploads/filename.jpg
```

### Cloudinary Mode (Production)
```
User uploads image → Multer + CloudinaryStorage → Upload to Cloudinary CDN → URL: https://res.cloudinary.com/...
```

---

## Troubleshooting

### Images not showing after upload

1. **Check browser console** for errors
2. **Check backend logs** for upload errors
3. **Verify the image URL** in the database

### For Local Development

- Ensure `backend/uploads` directory exists and is writable
- Check that the backend is serving static files from `/uploads`

### For Vercel/Cloudinary

- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for uploaded images
- Ensure environment variables are set in Vercel

### CORS Issues

If you see CORS errors, check that your frontend URL is allowed in `backend/src/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}));
```

---

## Testing the Upload

1. **Login as admin**
2. **Go to Products → Add Product**
3. **Fill in the form:**
   - Title: "Test Ring"
   - Description: "Test product"
   - Price: 1000
   - Category: rings
   - Stock: 10
4. **Select an image** (JPG, PNG, or WebP, max 5MB)
5. **Click "Create Product"**

**Expected Result:**
- Success message appears
- Product shows in the list with the image
- Image is accessible via the URL

---

## File Structure

```
backend/
├── .env                    # Environment variables (set Cloudinary here)
├── uploads/                # Local image storage (development only)
│   └── product-123456.jpg
├── src/
│   ├── controllers/
│   │   └── productController.js  # Updated to handle uploads
│   ├── middleware/
│   │   └── upload.js             # Multer + Cloudinary config
│   └── server.js                 # Serves /uploads statically
```

---

## Important Notes

⚠️ **Vercel Serverless Limitations:**
- Vercel serverless functions cannot write to disk
- Files stored locally will be lost after deployment
- **Always use Cloudinary for production on Vercel**

⚠️ **Image Size Limit:**
- Maximum file size: 5MB
- Allowed formats: JPG, JPEG, PNG, GIF, WebP

⚠️ **Security:**
- Only admins can upload products
- File type validation is enforced
- File size limits are enforced

---

## Quick Fix Summary

**If running locally:**
- Just run the backend, images will save to `backend/uploads/`

**If deploying to Vercel:**
1. Create Cloudinary account
2. Add Cloudinary credentials to Vercel environment variables
3. Redeploy

That's it! Your product images should now work correctly.
