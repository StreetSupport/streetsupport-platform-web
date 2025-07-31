# Vercel Deployment Control Setup

This document explains how to use Vercel Deploy Hooks to ensure deployments only happen after GitHub Actions tests complete successfully, preventing the race condition where Vercel deploys before tests finish.

## Problem

Previously, when merging to staging:
1. ✅ GitHub Actions starts running tests
2. ❌ Vercel immediately starts deploying (race condition)
3. ✅ GitHub Actions completes tests
4. ❌ Deployment already happened regardless of test results

## Solution: Deploy Hooks (Controlled Deployment)

### Step 1: Create Deploy Hook in Vercel

1. **Navigate to your Vercel project**
2. **Go to**: Settings → Git → Deploy Hooks
3. **Create a new Deploy Hook**:
   - **Name**: `Production Deploy After Tests`
   - **Branch**: `staging` (or your deployment branch)
   - **Click "Create Hook"**
4. **Copy the webhook URL** (looks like `https://api.vercel.com/v1/integrations/deploy/...`)

### Step 2: Disable Automatic Deployments (Optional)

To prevent Vercel from auto-deploying on every push:
1. **Go to**: Settings → Git → Connected Git Repository
2. **Disable automatic deployments** from Git pushes
3. This ensures only the Deploy Hook triggers deployments

### Step 3: Add Deploy Hook to GitHub Secrets

1. **Go to your GitHub repository**
2. **Navigate to**: Settings → Secrets and variables → Actions
3. **Add new repository secret**:
   - **Name**: `VERCEL_DEPLOY_HOOK`
   - **Value**: The webhook URL from Step 1

### New Deployment Flow

1. **Create PR** → staging
2. **GitHub Actions runs tests** on PR
3. **Manual Vercel authorization** (if needed) - PR deployments still work normally
4. **Merge PR** to staging after tests pass
5. **GitHub Actions runs tests** on staging branch ✅
6. **GitHub Actions triggers Deploy Hook** only after tests pass ✅
7. **Vercel deploys** using the webhook trigger ✅

## How It Works

### GitHub Actions Workflow:
1. **Test Job**: Runs Jest tests + E2E tests
2. **Deploy Job**: Only runs if tests pass
3. **Deploy Hook**: Triggers Vercel deployment via webhook
4. **Status Check**: Reports deployment status back to GitHub

### Vercel Behavior:
- **No automatic deployments** on Git pushes (optional)
- **Only deploys when webhook is triggered**
- **Webhook only triggered after tests pass**

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