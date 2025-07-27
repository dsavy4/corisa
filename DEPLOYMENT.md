# 🚀 Deployment Guide - Corisa AI

This guide covers multiple ways to deploy your React + ShadCN application to Cloudflare Pages.

## 📋 Prerequisites

1. **Cloudflare Account**: You need a Cloudflare account
2. **API Token**: Generate a Cloudflare API token with Pages permissions
3. **Account ID**: Your Cloudflare account ID

## 🔑 Setting Up Cloudflare Credentials

### 1. Generate API Token
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click "Create Token"
3. Use "Custom token" template
4. Add these permissions:
   - `Account > Cloudflare Pages > Edit`
   - `Zone > Zone > Read`
5. Set account resources to "All accounts"
6. Copy the generated token

### 2. Get Account ID
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Your Account ID is in the right sidebar

## 🚀 Deployment Options

### Option 1: GitHub Actions (Recommended)

This is the easiest and most reliable method:

1. **Add Secrets to GitHub Repository**:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add these secrets:
     - `CLOUDFLARE_API_TOKEN`: Your API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your account ID

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

3. **Automatic Deployment**:
   - The GitHub Action will automatically deploy on every push to main/master
   - Check the Actions tab in your GitHub repository for deployment status

### Option 2: Local Deployment

If you prefer to deploy locally:

1. **Login to Wrangler**:
   ```bash
   npx wrangler login
   ```

2. **Deploy**:
   ```bash
   npm run deploy
   ```

### Option 3: Manual Deployment Script

Use the provided deployment script:

```bash
./deploy-local.sh
```

## 🌐 Accessing Your App

After successful deployment, your app will be available at:
- **Production**: `https://corisa-ai.pages.dev`
- **Preview**: `https://corisa-ai-{branch}.pages.dev` (for PR deployments)

## 🔧 Configuration Files

### wrangler.toml
```toml
name = "corisa-ai"
compatibility_date = "2025-07-27"
compatibility_flags = ["nodejs_compat"]

pages_build_output_dir = "dist"

[build]
command = "npm run build"
```

### GitHub Actions (.github/workflows/deploy.yml)
- Automatically builds and deploys on push to main/master
- Creates preview deployments for pull requests
- Uses Cloudflare Pages action for reliable deployment

## 🐛 Troubleshooting

### Build Errors
- Check that all dependencies are installed: `npm install`
- Verify TypeScript compilation: `npm run type-check`
- Test build locally: `npm run build`

### Deployment Errors
- Verify API token has correct permissions
- Check account ID is correct
- Ensure project name matches in Cloudflare dashboard

### Authentication Issues
- For local deployment: Run `npx wrangler login`
- For GitHub Actions: Verify secrets are correctly set

## 📊 Monitoring

- **Cloudflare Dashboard**: Monitor deployments and performance
- **GitHub Actions**: Check deployment logs and status
- **Analytics**: View usage statistics in Cloudflare dashboard

## 🔄 Continuous Deployment

With GitHub Actions set up, your app will automatically:
- Build on every push to main/master
- Deploy to production
- Create preview deployments for pull requests
- Rollback on failed deployments

## 🎉 Success!

Once deployed, your Corisa AI application will be live and accessible worldwide through Cloudflare's global network!