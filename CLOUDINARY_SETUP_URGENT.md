# 🚨 URGENT: Cloudinary Setup Required for Image Uploads

## The Problem

Your product images are **not uploading** because:

1. **Vercel is serverless** - It cannot store files permanently
2. **Cloudinary is not configured** - Your backend has no Cloudinary credentials
3. **Memory storage doesn't persist** - Images uploaded to memory are lost after each request

## The Solution: Set Up Cloudinary (5 minutes, FREE)

### Step 1: Create Cloudinary Account

1. Go to **https://cloudinary.com**
2. Click **"Sign Up Free"**
3. Sign up with Google, GitHub, or email
4. **It's completely FREE** for up to 25GB storage and 25GB bandwidth/month

### Step 2: Get Your Credentials

After signing in:

1. You'll land on the **Dashboard**
2. Copy these 3 values:
   - **Cloud Name** (e.g., `dxxxxx`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnop`) - Click "Reveal" to see it

### Step 3: Add Credentials to Vercel

1. Go to **https://vercel.com/dashboard**
2. Select your project: **jewellery-website-backend**
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar
5. Click **"Add New"** for each variable:

| Name | Value |
|------|-------|
| `CLOUDINARY_CLOUD_NAME` | (paste your Cloud Name) |
| `CLOUDINARY_API_KEY` | (paste your API Key) |
| `CLOUDINARY_API_SECRET` | (paste your API Secret) |

6. Make sure they're added to **Production** environment

### Step 4: Redeploy

After adding the environment variables:

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. OR push a new commit to trigger redeployment

### Step 5: Test Upload

After redeployment completes:

1. Go to your website
2. Login as admin
3. Go to **Products → Add Product**
4. Fill in details and **upload an image**
5. Click **"Create Product"**
6. ✅ Image should now appear!

---

## How to Check if It's Working

### Check Vercel Logs

1. Go to Vercel Dashboard
2. Select your backend project
3. Click on the latest deployment
4. Click **"View Logs"**
5. Look for:
   ```
   === Cloudinary Configuration Status ===
   Cloudinary configured: true
   ```

### Test Upload

After uploading a product, check the API:
- Visit: `https://jewellery-website-backend-eta.vercel.app/api/products`
- Find your product
- Check if `images` array has URLs and `mainImage` is not empty

---

## Alternative: Local Development (Without Cloudinary)

If you want to test **locally only** (not on Vercel):

1. Run backend locally:
   ```bash
   cd backend
   npm run dev
   ```

2. Upload products - images will be saved to `backend/uploads/` folder

3. Images will be accessible at: `http://localhost:5000/uploads/filename.jpg`

**⚠️ This won't work on Vercel** - only for local testing!

---

## Troubleshooting

### "Cloudinary credentials not found" in logs

- You didn't add the environment variables correctly
- Go back to Step 3 and double-check

### Images still not showing after setup

1. Check Vercel logs for errors
2. Check browser console (F12) for errors
3. Make sure you redeployed after adding credentials
4. Try uploading a new product (old ones won't have images)

### "CORS Error"

- Make sure your frontend URL is allowed
- Check backend CORS configuration

---

## Need Help?

If you're stuck:

1. **Check Vercel logs** - They show detailed errors
2. **Check browser console** (F12) - Shows frontend errors
3. **Verify Cloudinary dashboard** - Shows uploaded images

---

## Summary

✅ **For Vercel (Production):** MUST use Cloudinary  
✅ **For Local Testing:** Can use local file storage  
✅ **Cloudinary is FREE** for small-medium usage  
✅ **Setup takes 5 minutes**  

**Without Cloudinary, image uploads will NEVER work on Vercel.**
