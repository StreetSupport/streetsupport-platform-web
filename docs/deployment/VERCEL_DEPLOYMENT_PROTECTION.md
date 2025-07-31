# Vercel Deployment Protection Setup

This document explains how to configure Vercel to wait for GitHub Actions tests to complete before deploying, preventing the race condition where Vercel deploys before tests finish.

## Problem

Previously, when merging to staging:
1. ✅ GitHub Actions starts running tests
2. ❌ Vercel immediately starts deploying (race condition)
3. ✅ GitHub Actions completes tests
4. ❌ Deployment already happened regardless of test results

## Solution: Vercel Deployment Protection

### Vercel Dashboard Configuration

1. **Navigate to your Vercel project**
2. **Go to**: Settings → Git → Deployment Protection
3. **Configure the following**:
   - ✅ **Enable "Wait for Checks to Pass"**
   - ✅ **Required status checks**:
     - `Test & Deploy / test` (main test job)
     - `Test & Deploy / deploy` (deployment verification job)
     - `ci/tests-complete` (explicit status check)

### Status Checks Available

The GitHub Actions workflow now creates these status checks that Vercel can wait for:

| Status Check | Description |
|--------------|-------------|
| `Test & Deploy / test` | Main test suite (Jest + E2E) |
| `Test & Deploy / deploy` | Deployment verification |
| `ci/tests-complete` | Explicit "ready to deploy" signal |

### New Deployment Flow

1. **Create PR** → staging
2. **GitHub Actions runs tests** on PR
3. **Manual Vercel authorization** (if needed)
4. **Merge PR** to staging after tests pass
5. **GitHub Actions runs tests** on staging branch
6. **Vercel waits** for status checks to complete
7. **Vercel deploys** only after all tests pass ✅

## Vercel Settings Screenshot Locations

### Required Settings:
- **Project Settings** → **Git** → **Deployment Protection**
- **Toggle ON**: "Wait for Checks to Pass"
- **Add Required Checks**: 
  - `Test & Deploy / test`
  - `ci/tests-complete`

### Optional Settings:
- **Apply to**: Production deployments
- **Branch**: staging (or your deployment branch)

## Testing the Configuration

1. **Make a small change** and create a PR
2. **Merge the PR** to staging
3. **Check Vercel deployment** - it should show "Waiting for checks"
4. **Monitor GitHub Actions** - tests should complete first
5. **Verify deployment** happens only after tests pass

## Troubleshooting

### If Vercel Still Deploys Immediately:
1. Double-check the status check names in Vercel settings
2. Ensure the GitHub Actions workflow is creating the expected status checks
3. Verify the branch name matches (e.g., `staging`)

### If Status Checks Don't Appear:
1. The workflow must run at least once to create the status checks
2. Check the workflow file syntax is correct
3. Ensure the job names match what you've configured in Vercel

### Alternative Status Check Names:
If the above don't work, try these variations:
- `test` (job name only)
- `deploy` (job name only)
- `Test & Deploy` (workflow name only)

## Benefits

✅ **No more race conditions** - Vercel waits for tests
✅ **Failed tests prevent deployment** - Only passing builds deploy
✅ **Same workflow** - No changes to your development process
✅ **Better reliability** - Deployment protection built into the platform