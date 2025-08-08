# 🚀 Vercel Deployment Guide

## Issues Fixed

1. **Fixed MongoDB Connection**: Updated to handle serverless environment
2. **Fixed Session Store**: Optimized for serverless functions
3. **Added Database Connection Middleware**: Ensures connection before handling requests
4. **Added Test Endpoint**: For debugging deployment issues

## Steps to Fix Your Vercel Deployment

### 1. Set Up MongoDB Atlas (Required for Vercel)

Your current MongoDB URL (`mongodb://root:Sakshi%40123@127.0.0.1:27017/eLearningPlatform`) is for local development and won't work on Vercel.

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (it should look like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eLearningPlatform?retryWrites=true&w=majority
   ```

### 2. Update Vercel Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:

   ```
   MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eLearningPlatform?retryWrites=true&w=majority
   SESSION_SECRET=your-super-secret-key-here-make-it-long-and-random
   NODE_ENV=production
   ```

### 3. Test the Deployment

After setting the environment variables:

1. **Test the basic API**: Visit `https://your-app.vercel.app/api/test`
   - Should return: `{"message": "API is working!", "timestamp": "...", "env": "production"}`

2. **Test the main app**: Visit `https://your-app.vercel.app/`
   - Should load your home page

### 4. Common Issues and Solutions

**Issue**: 500 Internal Server Error
- **Solution**: Check Vercel function logs in your dashboard
- **Most likely cause**: Missing or incorrect `MONGO_URL`

**Issue**: Database connection timeout
- **Solution**: Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Vercel's IP ranges

**Issue**: Session issues
- **Solution**: The app now uses memory sessions in development and MongoDB sessions in production

### 5. Debugging Steps

1. Check Vercel function logs:
   - Go to your Vercel dashboard
   - Click on your project
   - Go to "Functions" tab
   - Click on a failed function to see logs

2. Test locally with production settings:
   ```bash
   NODE_ENV=production MONGO_URL=your-atlas-url npm start
   ```

### 6. Deploy Updated Code

```bash
# If you have Vercel CLI installed
vercel --prod

# Or push to your connected Git repository
git add .
git commit -m "Fix serverless deployment issues"
git push origin main
```

## What Was Changed

1. **api/index.js**: 
   - Added proper MongoDB connection handling for serverless
   - Updated session configuration
   - Added database connection middleware
   - Made it work both locally and on Vercel

2. **vercel.json**: 
   - Added test endpoint
   - Increased function timeout
   - Improved routing

3. **Added api/test.js**: 
   - Simple endpoint to test if deployment is working

## Next Steps After Deployment

1. Test all functionality (login, registration, etc.)
2. Monitor Vercel function logs for any issues
3. Consider upgrading to Vercel Pro if you need longer function execution times
