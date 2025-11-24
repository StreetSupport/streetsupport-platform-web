// scripts/fetch-prebuild.js

console.log('🔄 Fetching bootstrap data before build...');
console.log('   (Will use fallback data if MongoDB unavailable)');

// ESM: use dynamic import for node:child_process
const { execSync } = await import('node:child_process');

execSync('npm run fetch:all', { stdio: 'inherit' });
