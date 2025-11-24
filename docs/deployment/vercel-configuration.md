# Vercel Configuration and Deployment Guide

This guide covers the complete Vercel deployment setup for Street Support Platform Web.

## Overview

Street Support uses a controlled deployment strategy:
- **GitHub Repository**: Connected to Vercel with automatic deployments disabled
- **Testing First**: GitHub Actions runs full test suite before deployment
- **Manual Promotion**: Deployments are manually promoted from preview to production
- **Branch Strategy**: `staging` branch deploys to production (not `main`)

## Vercel Project Configuration

### Project Settings
- **Framework Preset**: Next.js
- **Node.js Version**: 20.x (matches package.json engines)
- **Install Command**: `npm ci`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (automatic)
- **Root Directory**: `/` (project root)

### Environment Variables

#### Required Variables
```bash
# Database Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Google Maps Integration  
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Base URL for API calls
NEXT_PUBLIC_BASE_URL=https://streetsupport.net
```

#### Optional Variables
```bash
# Deployment notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Project management integration
TRELLO_API_KEY=your_trello_api_key
TRELLO_TOKEN=your_trello_token

# Deploy hook for controlled deployments
VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/...
```

## Deployment Protection Setup

### 1. Disable Automatic Deployments
In Vercel project settings:
1. Navigate to **Settings** → **Git**
2. Disable **Auto-deploy** for all branches
3. This prevents race conditions and ensures tests run first

### 2. Configure Deploy Hooks
1. Navigate to **Settings** → **Git** → **Deploy Hooks**
2. Create a new deploy hook for `staging` branch
3. Copy the webhook URL to `VERCEL_DEPLOY_HOOK` environment variable
4. GitHub Actions will trigger deployments after successful tests

### 3. Branch Configuration
```yaml
Production Branch: staging
Preview Branches: 
  - All branches except staging
  - Pull request branches
Ignored Build Step: "" (empty - build all branches for previews)
```

## GitHub Actions Integration

The deployment workflow:

```yaml
# .github/workflows/test-and-deploy.yml
name: Test & Deploy

on:
  pull_request:
    branches: [staging, main]
  push:
    branches: [staging, main]

jobs:
  test:
    # Runs for all PRs and pushes
    # Full test suite including E2E tests
    # Vercel preview deployments happen automatically
  
  deploy:
    # Only runs after tests pass on staging branch
    # Triggers Vercel production deployment via webhook
```

## Environment-Specific Behaviour

### Development (`npm run dev`)
- Uses `http://localhost:3000` for API calls
- MongoDB connection required for full functionality
- Falls back to static data if MongoDB unavailable

### Preview Deployments (Pull Requests)
- Automatic Vercel preview for every PR
- Uses `VERCEL_URL` environment variable for API calls
- Full functionality with MongoDB connection

### Production Deployment
- Triggered by successful tests on `staging` branch
- Uses `NEXT_PUBLIC_BASE_URL` for API calls
- Full MongoDB connectivity required

## Monitoring and Analytics

### Vercel Analytics
- **Performance Monitoring**: Enabled via `@vercel/analytics`
- **Real User Metrics**: Core Web Vitals tracking
- **Error Tracking**: Automatic error reporting

### Build Monitoring
- **Build Logs**: Available in Vercel dashboard
- **Function Logs**: Serverless function execution logs
- **Deployment History**: Complete deployment timeline

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check Node.js version compatibility
"engines": {
  "node": ">=18.0.0"
}

# Verify environment variables
npm run build  # Test locally first
```

#### API Connection Issues
```bash
# Test MongoDB connection
npm run test:db

# Verify environment variables in Vercel
MONGODB_URI should include database name
NEXT_PUBLIC_BASE_URL should match deployment URL
```

#### Deploy Hook Not Triggering
```bash
# Verify webhook URL format
https://api.vercel.com/v1/integrations/deploy/prj_xxx/trigger

# Check GitHub Actions logs
# Ensure VERCEL_DEPLOY_HOOK secret is set correctly
```

### Performance Optimisation

#### Static Generation
- Most pages use Static Site Generation (SSG)
- API routes are serverless functions
- Images optimised via Next.js Image component

#### Caching Strategy
```javascript
// API routes use appropriate cache headers
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
}
```

## Security Configuration

### Content Security Policy
Configured in `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options', 
    value: 'nosniff'
  }
  // Additional security headers
];
```

### Environment Variable Security
- Production secrets stored in Vercel environment variables
- Development secrets in local `.env` files (git-ignored)
- MongoDB uses read-only user for additional security

## Maintenance

### Regular Tasks
1. **Monitor builds** - Check Vercel dashboard weekly
2. **Update dependencies** - Monthly security updates
3. **Review analytics** - Performance metrics analysis
4. **Backup verification** - Ensure data backup strategies

### Emergency Procedures
1. **Rollback**: Use Vercel deployment history to rollback
2. **Hotfix**: Push directly to `staging` branch after testing
3. **Incident Response**: Check logs in Vercel dashboard and MongoDB Atlas

---

For additional help, refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)