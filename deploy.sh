#!/bin/bash

# Build the Next.js application
echo "Building the application..."
npm run build

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy .next --project-name=corisa-ai