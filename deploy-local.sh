#!/bin/bash

echo "🚀 Deploying Corisa AI to Cloudflare Pages..."

# Build the application
echo "📦 Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Cloudflare Pages
    echo "🌐 Deploying to Cloudflare Pages..."
    npx wrangler pages deploy dist --project-name=corisa-ai
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "Your app should be available at: https://corisa-ai.pages.dev"
    else
        echo "❌ Deployment failed!"
        echo "Please check your Cloudflare credentials and try again."
    fi
else
    echo "❌ Build failed!"
    exit 1
fi