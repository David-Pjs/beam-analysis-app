#!/bin/bash

# Vercel Deployment Script for Frontend

echo "🚀 Deploying Beam Analysis Frontend to Vercel..."
echo ""

# Navigate to frontend directory
cd frontend

# Ensure environment variables are set
echo "📝 Setting up environment variables..."
export REACT_APP_API_URL="https://beam-analysis-api.onrender.com"

# Build the project
echo "🔨 Building production bundle..."
npm run build

# Deploy to Vercel
echo "☁️  Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your application is now live!"
echo ""
echo "Next steps:"
echo "1. Note the deployment URL"
echo "2. Update backend CORS if needed"
echo "3. Test the live application"
echo ""
