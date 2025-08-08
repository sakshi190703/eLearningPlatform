#!/bin/bash

echo "🚀 E-Learning Platform Deployment Script"
echo "========================================"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📋 Pre-deployment checklist:"
echo "1. ✅ MongoDB Atlas cluster created"
echo "2. ✅ Environment variables set in Vercel dashboard:"
echo "   - MONGO_URL (MongoDB Atlas connection string)"
echo "   - SESSION_SECRET (random secret key)"
echo "   - NODE_ENV=production"
echo ""

read -p "Have you completed the checklist above? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete the checklist first. See DEPLOYMENT.md for details."
    exit 1
fi

echo "🔄 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🧪 Test your deployment:"
echo "1. Visit: https://your-app.vercel.app/api/test"
echo "2. Visit: https://your-app.vercel.app/"
echo ""
echo "📊 Monitor logs at: https://vercel.com/dashboard"
