# Testing and Mock Data System

## Overview

This project implements a comprehensive testing system using MSW-style API mocking that allows E2E tests to run in all environments without requiring access to MongoDB secrets. This ensures 100% test coverage for both internal developers and external contributors.

## Current Architecture: MSW-Style API Mocking

### Mock Data Repository
Comprehensive mock data is maintained in `tests/e2e/mocks/api-responses.ts`:

- **Locations**: Manchester, Birmingham, Liverpool, Brighton, etc.
- **Service Categories**: All service types with subcategories
- **Client Groups**: Age ranges, demographics, special populations
- **Services**: Realistic service data for testing scenarios
- **Organisations**: Complete organisation profiles with contact details

### Automatic Mock Detection
The testing system (`tests/e2e/helpers/setup-api-mocks.ts`) automatically:

1. **Detects Environment**: Determines if MongoDB access is available
2. **Intercepts API Routes**: Uses Playwright route interception
3. **Serves Mock Data**: Returns realistic data for all API endpoints
4. **Maintains Test Coverage**: 100% test pass rate regardless of environment

### Bootstrap Data (Legacy Fallback)
Static JSON files in `/src/data/` provide bootstrap data for builds:

- `locations.json` - Core locations fetched from MongoDB
- `service-categories.json` - Service categories and subcategories  
- `client-groups.json` - Client group classifications

The fetch scripts still exist for build-time data fetching but testing now uses MSW-style mocks.

## Testing the Mock System

### Running E2E Tests with Mocks

```bash
# Run all E2E tests (automatically detects and uses mocks if needed)
npm run test:e2e

# Force mock mode for testing
USE_MOCKS=true npm run test:e2e

# Test specific scenarios
npx playwright test tests/e2e/find-help.spec.ts
```

### Testing Bootstrap Data (Legacy)

```bash
# Test individual scripts (legacy fallback system)
USE_FALLBACK=true node ./scripts/fetch-locations.js
USE_FALLBACK=true node ./scripts/fetch-service-categories.js  
USE_FALLBACK=true node ./scripts/fetch-client-groups.js

# Test full fetch process
USE_FALLBACK=true npm run fetch:all
```

## CI/CD Behaviour

### Current MSW-Style Approach

#### For Internal PRs (same repo)
- ✅ Has access to `MONGODB_URI` secret
- ✅ Can use live MongoDB data if available
- ✅ Automatically falls back to MSW mocks if database unavailable
- ✅ Runs full test suite with 100% pass rate
- ✅ Complete E2E test coverage maintained

#### For Fork PRs (external contributors) 
- ❌ No access to `MONGODB_URI` secret (security)
- ✅ Automatically uses MSW-style API mocking
- ✅ Complete test suite runs successfully
- ✅ **100% test coverage maintained - no skipped tests!**
- ✅ Same quality gates as internal PRs

#### For Push to staging branch
- ✅ Uses live MongoDB data for bootstrap
- ✅ E2E tests use automatic mock detection
- ✅ Full test suite + deployment pipeline
- ✅ Production deployment after successful tests

## Benefits

✅ **All PRs can run tests** - No more skipped tests for fork PRs  
✅ **No secrets exposed** - Fallback data is public and safe  
✅ **Consistent test environment** - Fallback data is predictable  
✅ **Simple maintenance** - Fallback files updated as needed  
✅ **Backward compatible** - Existing workflow unchanged for internal PRs  

## Updating Fallback Data

When adding new locations or categories:

1. Update the appropriate fallback file in `/public/data/`
2. Ensure the structure matches the live database format
3. Test locally with `USE_FALLBACK=true`

## Troubleshooting

### Tests still failing in PRs?
- Check that fallback JSON files are valid
- Verify file paths in fetch scripts
- Ensure GitHub workflow was updated correctly

### Fallback data out of date?
- Compare fallback files with current database content
- Update fallback files as needed
- Consider automating fallback data updates

### Local development issues?
- Use `USE_FALLBACK=true` to force fallback mode
- Check that fallback files exist in `/public/data/`
- Verify script logic handles both scenarios