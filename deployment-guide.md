# Gujarati Restaurant Menu - Deployment Guide

## 🚀 Quick Deployment Instructions

### Step 1: Create GitHub Repositories
1. Go to [GitHub](https://github.com) and create two new repositories:
   - `gujarati-restaurant-backend` (public)
   - `gujarati-restaurant-frontend` (public)

### Step 2: Push Backend to GitHub
```bash
cd backend
git remote add origin https://github.com/YOUR_USERNAME/gujarati-restaurant-backend.git
git push -u origin main
```

### Step 3: Push Frontend to GitHub
```bash
cd frontend
git remote add origin https://github.com/YOUR_USERNAME/gujarati-restaurant-frontend.git
git push -u origin main
```

### Step 4: Deploy Backend on Render
1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your `gujarati-restaurant-backend` repository
4. Use these settings:
   - **Name**: gujarati-restaurant-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. **Copy the deployed URL** (e.g., `https://gujarati-restaurant-backend-xyz.onrender.com`)

### Step 5: Deploy Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your `gujarati-restaurant-frontend` repository
4. **IMPORTANT**: Before deploying, update the API_URL in `src/App.jsx`:
   - Replace `https://your-backend-url.onrender.com` with your actual Render URL
5. Deploy the project

### Step 6: Test Your Application
1. Visit your Vercel frontend URL
2. Try switching between Lunch and Dinner tabs
3. Test admin login with password: `admin123`
4. Share the QR code with customers!

## 🔧 Configuration Notes

### Backend Features:
- ✅ Express.js API server
- ✅ In-memory data storage
- ✅ CORS enabled for Vercel frontend
- ✅ Admin endpoints for menu management
- ✅ Menu categories with meal types (lunch/dinner)

### Frontend Features:
- ✅ React with responsive design
- ✅ Lunch tab: Gujarati Thali (₹200 unlimited)
- ✅ Dinner tab: Individual items
- ✅ Admin panel with password protection
- ✅ Toggle item availability
- ✅ QR code display area
- ✅ Gujarati styling and animations

### Admin Access:
- Password: `admin123`
- Features: Toggle item availability, view analytics

## 📱 Customer Experience
Customers scan QR → View menu → See fresh daily items → Place order

## 💡 Free Deployment Benefits
- **Render**: Free tier with 750 hours/month (enough for restaurant)
- **Vercel**: Unlimited free deployments for frontend
- **Total Cost**: ₹0 per month!

## 🔄 Daily Menu Updates
1. Restaurant owner visits the admin panel
2. Logs in with password
3. Toggles items on/off based on availability
4. Customers immediately see updated menu

Your restaurant menu system is now ready for deployment! 🎉