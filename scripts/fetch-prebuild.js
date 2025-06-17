// scripts/fetch-prebuild.js

if (process.env.SKIP_FETCH === 'true') {
  console.log('⏭️  Skipping prebuild fetch');
  process.exit(0);
}

console.log('🔄 Fetching bootstrap data before build...');

// ESM: use dynamic import for node:child_process
const { execSync } = await import('node:child_process');

execSync('npm run fetch:all', { stdio: 'inherit' });
