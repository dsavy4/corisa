#!/bin/bash

# Build the React application
echo "Building the React application..."
npm run build

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=corisa-ai