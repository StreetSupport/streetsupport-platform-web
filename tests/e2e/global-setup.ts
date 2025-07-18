import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Launch browser for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the development server to be ready
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';
    
    console.log('Waiting for development server to be ready...');
    
    // Try to access the homepage to ensure server is ready
    await page.goto(baseURL, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    
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
        console.log(`✓ Route ${route} is accessible`);
      } catch (error) {
        console.warn(`⚠ Route ${route} may have issues:`, error.message);
      }
    }
    
    console.log('✓ Development server is ready');
  } catch (error) {
    console.error('✗ Failed to connect to development server:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;