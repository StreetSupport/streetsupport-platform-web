import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Check MongoDB availability and set mock flag
  const hasMongoDB = !!process.env.MONGODB_URI;
  
  if (!hasMongoDB) {
    console.warn('🔧 MongoDB URI not found - enabling API mocks for tests');
    process.env.USE_API_MOCKS = 'true';
  } else {
    console.warn('🗄️ MongoDB URI found - using real database for tests');
    process.env.USE_API_MOCKS = 'false';
  }

  // Launch browser for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the development server to be ready
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';

    console.warn('Waiting for development server to be ready...');

    // Retry logic for initial connection (Next.js compilation can be slow in CI)
    const maxRetries = 3;
    const initialTimeout = 120000; // 2 minutes for first load

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.warn(`Connection attempt ${attempt}/${maxRetries}...`);
        await page.goto(baseURL, {
          waitUntil: 'domcontentloaded',
          timeout: initialTimeout
        });
        break; // Success, exit retry loop
      } catch (error) {
        if (attempt === maxRetries) {
          throw error; // Re-throw on final attempt
        }
        console.warn(`Attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s before retry
      }
    }
    
    // Verify the page loads correctly
    await page.waitForSelector('body', { timeout: 30000 });
    
    // Test key routes to ensure Next.js is properly initialized
    const testRoutes = [
      '/',
      '/find-help'
    ];
    
    for (const route of testRoutes) {
      try {
        await page.goto(`${baseURL}${route}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 30000 
        });
        console.warn(`✓ Route ${route} is accessible`);
      } catch (error) {
        console.warn(`⚠ Route ${route} may have issues:`, error instanceof Error ? error.message : String(error));
      }
    }
    
    const mockStatus = process.env.USE_API_MOCKS === 'true' ? 'enabled' : 'disabled';
    console.warn(`✓ Development server is ready (API mocks: ${mockStatus})`);
  } catch (error) {
    console.error('✗ Failed to connect to development server:', error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;