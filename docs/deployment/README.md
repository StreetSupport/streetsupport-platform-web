# Deployment Documentation

This directory contains CI/CD pipeline documentation, deployment strategies, and operational procedures for the Street Support Platform.

## 📋 Contents

### [GitHub Actions Workflow](./WORKFLOW.md)
**Purpose**: Complete CI/CD pipeline documentation for automated testing and deployment

**File**: `.github/workflows/test-and-deploy.yml`

**Key Features**:
- Two-stage workflow: Test → Deploy
- Fork PR vs trusted PR handling
- Automatic data fetching with fallbacks
- Slack and Trello integrations
- Security-first secret management
- MSW-style E2E testing with automatic mock activation

**Status**: ✅ Active production workflow

### [Secrets Management](./SECRETS.md)
**Purpose**: Security guide for managing sensitive configuration and API keys

**Key Topics**:
- GitHub secrets configuration
- Environment variable management
- Database connection security
- API key rotation procedures
- Local development setup

**Status**: ✅ Current security practices

## 🚀 Deployment Architecture

### Overview
```
GitHub Repository
        ↓
   GitHub Actions
   (Test & Build)
        ↓
     Vercel Pro
   (Host & Serve)
        ↓
   MongoDB Atlas
  (Data Storage)
```

### Environments
- **Production**: `streetsupport.net` (main branch)
- **Staging**: `staging.streetsupport.net` (staging branch)
- **Preview**: Auto-deployed PR previews (all branches)

## 🔄 CI/CD Pipeline

### Workflow Stages

#### 1. **Test Job** (All PRs)
```yaml
✅ Checkout code
✅ Setup Node.js (18.x, 20.x matrix)
✅ Install dependencies
✅ Run type checking
✅ Run unit tests
✅ Install Playwright browsers
✅ Run E2E tests (with mocks for PRs)
✅ Build production bundle
```

#### 2. **Deploy Job** (staging/main only)
```yaml
✅ Deploy to Vercel
✅ Post Slack notification (optional)
✅ Update Trello card (optional)
```

### Security Model

#### Trusted Builds (Same Repo)
- ✅ Full access to GitHub secrets
- ✅ Real MongoDB connection
- ✅ Complete test suite with live data
- ✅ Slack/Trello integrations enabled

#### Fork PRs (External Contributors)
- ❌ No access to secrets (security)
- ✅ MSW-style mocks for E2E tests
- ✅ Complete test coverage maintained
- ✅ All quality gates enforced

## 🔒 Security Practices

### Secret Management
```yaml
# GitHub Repository Secrets
MONGODB_URI                 # Database connection
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY  # Maps integration
SLACK_WEBHOOK_URL          # Notifications (optional)
TRELLO_API_KEY            # Project management (optional)
```

### Access Control
- **Database**: Read-only user for public API
- **Deployment**: Vercel integration with GitHub
- **Secrets**: GitHub repository secrets only
- **Monitoring**: Vercel analytics and error tracking

## 📊 Quality Gates

### Automated Checks
1. **TypeScript Compilation**: Strict mode, zero errors
2. **Linting**: ESLint with accessibility rules
3. **Unit Tests**: Jest with coverage requirements
4. **E2E Tests**: Playwright with mock fallbacks
5. **Build Verification**: Production bundle success

### Manual Reviews
- **Code Review**: Required for all PRs
- **Security Review**: For secret-related changes
- **Performance Review**: For large changes
- **Accessibility Review**: For UI changes

## 🚨 Monitoring & Alerting

### Performance Monitoring
- **Vercel Analytics**: Page load times, Core Web Vitals
- **Real User Monitoring**: Lighthouse metrics
- **Error Tracking**: Automatic error reporting
- **Uptime Monitoring**: 99.9% availability target

### Alert Channels
- **GitHub**: Failed workflow notifications
- **Slack**: Deployment status updates
- **Email**: Critical error notifications
- **Vercel Dashboard**: Performance insights

## 🛠️ Operational Procedures

### Deployment Process
1. **Feature Development**: Work on feature branch
2. **Pull Request**: Create PR with comprehensive tests
3. **Automated Testing**: Wait for all checks to pass
4. **Code Review**: Peer review and approval
5. **Merge**: Auto-deploy to staging/production
6. **Verification**: Smoke test deployed changes

### Rollback Procedure
1. **Identify Issue**: Monitor alerts and user feedback
2. **Quick Fix**: If simple, push hotfix directly
3. **Rollback**: Use Vercel dashboard to revert deployment
4. **Investigation**: Analyze root cause
5. **Fix & Redeploy**: Implement proper fix and test

### Data Management
```bash
# Production data never modified by CI/CD
# Read-only access only
# Fallback data maintained for testing
```

## 🔧 Environment Configuration

### Local Development
```bash
# Required environment variables
MONGODB_URI=mongodb+srv://...           # Database connection
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...     # Maps API key

# Optional for testing
USE_API_MOCKS=true                      # Force mock mode
SKIP_FETCH=true                         # Skip data fetching
```

### Production Deployment
```bash
# Vercel automatically injects:
VERCEL=1                                # Deployment detection
VERCEL_ENV=production                   # Environment type
VERCEL_URL=streetsupport.net           # Deployment URL

# Plus all GitHub secrets
```

## 📈 Performance Optimisation

### Build Optimisations
- **Bundle Analysis**: Automatic bundle size tracking
- **Code Splitting**: Dynamic imports for large components
- **Tree Shaking**: Remove unused code
- **Asset Optimisation**: Images, fonts, and static assets

### Runtime Optimisations
- **Serverless Functions**: Auto-scaling API routes
- **CDN**: Global edge caching via Vercel
- **Database**: Connection pooling and query optimisation
- **Caching**: Strategic response caching

## 🔄 Release Strategy

### Branching Model
```
main (production)    ← Stable releases
  ↑
staging (preview)    ← Integration testing
  ↑
feature branches     ← Development work
```

### Version Management
- **Semantic Versioning**: Major.Minor.Patch
- **Automated Changelog**: Generated from commit messages
- **Git Tags**: Mark release points
- **Release Notes**: Document user-facing changes

## 🎯 Success Metrics

### Deployment Quality
- **Deploy Frequency**: Daily deployments target
- **Lead Time**: <2 hours from commit to production
- **Failure Rate**: <5% deployment failures
- **Recovery Time**: <15 minutes rollback capability

### System Reliability
- **Uptime**: 99.9% availability target
- **Performance**: <2s page load times
- **Error Rate**: <1% application errors
- **User Satisfaction**: High accessibility scores

## 🔗 Related Documentation

- [Project Planning](../project-planning/README.md) - Deployment architecture decisions
- [Testing](../testing/README.md) - Quality assurance in CI/CD
- [Development](../development/README.md) - Local development setup
- [Design System](../design-system/README.md) - Component testing in pipeline