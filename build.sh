#!/bin/bash

echo "🚀 Building Corisa AI for Cloudflare Pages..."

# Install dependencies
npm ci

# Build the application
npm run build

# Copy necessary files for SPA routing
cp _headers dist/
cp _redirects dist/

echo "✅ Build complete! Files are in the dist/ directory."