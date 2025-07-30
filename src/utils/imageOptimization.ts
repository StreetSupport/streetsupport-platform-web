/**
 * Image optimization utilities for the Street Support project
 */

// Common image sizes for different use cases
export const imageSizes = {
  // Team photos and mugshots
  teamPhoto: {
    width: 200,
    height: 200,
    sizes: '(max-width: 768px) 128px, 200px',
  },
  
  // Resource icons
  resourceIcon: {
    width: 55,
    height: 55,
    sizes: '55px',
  },
  
  // Logos
  logo: {
    small: {
      width: 200,
      height: 200,
      sizes: '(max-width: 768px) 50vw, 200px',
    },
    large: {
      width: 300,
      height: 200,
      sizes: '(max-width: 768px) 100vw, 300px',
    },
  },
  
  // News/article images
  newsImage: {
    width: 90,
    height: 90,
    sizes: '(max-width: 640px) 100vw, 90px',
  },
  
  // Hero/banner images
  hero: {
    sizes: '100vw',
    priority: true,
  },
} as const;

// Generate a simple base64 placeholder for blur effect
export function generateBlurDataURL(width: number, height: number): string {
  // Create a simple gray placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Image loading priorities
export const imageLoadingPriority = {
  critical: true,   // Above-the-fold, logos, hero images
  normal: false,    // Most images - use lazy loading
} as const;

/**
 * Common responsive breakpoints for image sizes
 */
export const responsiveBreakpoints = {
  mobile: '(max-width: 640px)',
  tablet: '(max-width: 768px)', 
  desktop: '(max-width: 1024px)',
  wide: '(min-width: 1025px)',
} as const;

/**
 * Helper function to generate sizes string for responsive images
 */
export function createSizesString(config: Array<{ breakpoint: string; size: string }>): string {
  return config.map(({ breakpoint, size }) => `${breakpoint} ${size}`).join(', ');
}