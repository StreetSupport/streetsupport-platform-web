# Testing and Fallback Data System

## Overview

This project implements a fallback data system that allows e2e tests to run in PR builds without requiring access to MongoDB secrets.

## How It Works

### Fallback Data Files

Static JSON files are maintained in `/public/data/` for essential bootstrap data:

- `locations-fallback.json` - Core locations (Manchester, Birmingham, Liverpool, etc.)
- `service-categories-fallback.json` - Service categories and subcategories
- `client-groups-fallback.json` - Client group classifications

### Fetch Scripts Behavior

The fetch scripts (`fetch-locations.js`, `fetch-service-categories.js`, `fetch-client-groups.js`) automatically detect when MongoDB is unavailable and use fallback data:

1. **With MongoDB URI**: Fetches live data from database
2. **Without MongoDB URI**: Copies fallback data to expected locations

### Environment Variables

- `MONGODB_URI`: Production MongoDB connection string (secret)
- `USE_FALLBACK`: Force fallback mode for testing (optional)

## Testing the Fallback System

To test the fallback system locally:

```bash
# Test individual scripts
USE_FALLBACK=true node ./scripts/fetch-locations.js
USE_FALLBACK=true node ./scripts/fetch-service-categories.js  
USE_FALLBACK=true node ./scripts/fetch-client-groups.js

# Test full fetch process
USE_FALLBACK=true npm run fetch:all

# Test prebuild process  
USE_FALLBACK=true npm run prebuild
```

## CI/CD Behavior

### For Internal PRs (same repo)
- Has access to `MONGODB_URI` secret
- Fetches live data from MongoDB
- Runs full test suite with real data

### For Fork PRs (external contributors)
- No access to `MONGODB_URI` secret  
- Automatically uses fallback data
- Runs full test suite with static data
- **Tests are no longer skipped!**

### For Push to staging/main
- Uses live MongoDB data
- Full test suite + deployment

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