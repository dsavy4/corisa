#!/bin/bash

echo "🚀 Deploying to Cloudflare Pages..."

# Build the application
npm run build

# Deploy using the correct Pages command
npx wrangler pages deploy dist --project-name=corisa-ai

echo "✅ Deployment complete!"