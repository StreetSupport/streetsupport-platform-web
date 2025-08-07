# GitHub Actions Workflow: Test & Deploy

This repo uses a modern, simplified two-stage CI/CD workflow with automatic fallback systems:

1️⃣ **Test job** - Runs comprehensive test suite  
2️⃣ **Deploy job** _(staging branch only)_

---

## ✅ Current Workflow Implementation

| Job | What it does |
| --- | -------------- |
| `test` | - Checks out code<br>- Installs dependencies & Playwright Chromium<br>- **Fetches bootstrap data** with automatic fallbacks<br>- **Runs integrated test pipeline**: `npm run build` = unit tests → E2E tests → Next.js build |
| `deploy` | - Runs **after** tests pass on staging branch<br>- Triggers Vercel deployment via webhook<br>- Sets GitHub deployment status |

---

## ✅ Integrated Build Pipeline

The key innovation is our **integrated build command** that ensures nothing deploys without passing all tests:

```bash
npm run build  # Runs: npm run test && npm run test:e2e && next build
```

### Test Coverage
- **318 Unit Tests**: Comprehensive API routes, utilities, components
- **61 E2E Tests**: Complete user journey testing with MSW-style mocking
- **83.57% Code Coverage**: Exceeding quality thresholds

---

## ✅ Automatic Fallback System

Our workflow is **resilient to MongoDB unavailability** through automatic fallbacks:

### Data Fetching (`npm run fetch:all`)
```bash
# Always runs - uses fallbacks when MongoDB unavailable
npm run fetch:locations        # → Falls back to src/data/locations.json
npm run fetch:service-categories # → Falls back to src/data/categories.json  
npm run fetch:client-groups    # → Falls back to src/data/client-groups.json
```

### Test Execution
- **MongoDB Available**: Tests use real database connections
- **MongoDB Unavailable**: Tests automatically activate MSW-style mocks
- **No Configuration Required**: Fallbacks are automatic and transparent

---

## ✅ Simplified Architecture

Unlike the previous complex fork/trusted PR system, the current workflow is much simpler:

### All PRs and Pushes
- ✅ Run full test suite
- ✅ Use automatic fallbacks when needed  
- ✅ No special handling for fork PRs required
- ✅ Consistent behavior across all scenarios

### Security Model
- **Secrets Available**: Uses MongoDB for data fetching and testing
- **Secrets Unavailable**: Automatically uses JSON fallbacks and mocks
- **Zero Configuration**: No environment variables to set or skip flags needed

---

## ✅ Quality Gates

The workflow enforces strict quality standards:

1. **All unit tests must pass** (318 tests)
2. **All E2E tests must pass** (61 tests with browser automation)
3. **Next.js build must succeed** (production-ready code)
4. **Only staging branch triggers deployment**

---

## ✅ Deployment Process

### Staging Branch Deployment
```yaml
# Only runs on staging branch after tests pass
- Triggers Vercel deployment webhook
- Sets GitHub commit status
- Uploads Playwright test artifacts
```

### Test Artifacts
- **Always uploads Playwright reports** (even on failure)
- **Accessible via GitHub Actions UI**
- **Includes screenshots and traces for debugging**

---

## ✅ Local Development Commands

```bash
# Full test pipeline (matches CI)
npm run build                 # Unit tests → E2E tests → Build

# Individual test commands  
npm run test                  # Unit tests only
npm run test:watch           # Unit tests in watch mode
npm run test:ci              # CI-optimized unit tests
npm run test:e2e             # E2E tests with automatic mocking
npm run test:e2e:headed      # E2E tests with browser UI
npm run test:e2e:debug       # E2E tests with debugging

# Data fetching (with automatic fallbacks)
npm run fetch:all            # Fetch all bootstrap data
npm run fetch:locations      # Fetch locations only
```

---

## ✅ Monitoring & Debugging

### Test Failure Investigation
1. **Check GitHub Actions logs** for detailed error output
2. **Download Playwright artifacts** for E2E test failures
3. **Review test coverage reports** in CI logs
4. **Use local debugging commands** to reproduce issues

### Performance Monitoring
- **Build time tracking** in CI logs
- **Test execution time** monitoring
- **Vercel deployment status** via webhook responses

---

## ✅ Best Practices

- **Comprehensive testing** ensures deployment quality
- **Automatic fallbacks** provide resilience
- **Simple workflow** reduces maintenance overhead  
- **Quality gates** prevent broken deployments
- **Artifact preservation** aids debugging

---

✅ **This workflow is production-tested and handles all scenarios automatically.**