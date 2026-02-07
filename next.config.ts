import {withSentryConfig} from '@sentry/nextjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/wm',
        destination: '/west-midlands',
        permanent: true,
      },
      {
        source: '/westmids',
        destination: '/west-midlands',
        permanent: true,
      },
      {
        source: '/westmidlands',
        destination: '/west-midlands',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // Enable response compression for better performance
  compress: true,
  
  // Performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security and performance
  
  // Build optimizations (swcMinify is now default in Next.js 15)
  
  images: {
    // Enable modern image formats for better compression
    formats: ['image/avif', 'image/webp'],
    
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Minimize layout shift by enforcing size requirements
    minimumCacheTTL: 60,
    
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'streetsupportstorageprod.blob.core.windows.net',
        pathname: '/**',
      },
      ...(process.env.BLOB_STORAGE_HOSTNAME && process.env.BLOB_STORAGE_HOSTNAME !== 'streetsupportstorageprod.blob.core.windows.net'
        ? [
          {
            protocol: 'https' as const,
            hostname: process.env.BLOB_STORAGE_HOSTNAME,
            pathname: '/**',
          },
        ]
        : []),
      {
        protocol: 'https' as const,
        hostname: 'placekitten.com',
        pathname: '/**',
      },
    ],
  },
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize server components
    optimizeServerReact: true,
  },
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    resolveAlias: {
      // Reduce bundle size by aliasing large dependencies
      'react-icons/lib': 'react-icons',
    },
  },
  
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone', // Optimize for deployment
    
    // Webpack optimizations
    webpack: (config: any) => {
      // Enable module concatenation for smaller bundles
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        
        // Split chunks for better caching
        splitChunks: {
          ...config.optimization?.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            // Separate vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Separate Google Maps chunk
            maps: {
              test: /[\\/]node_modules[\\/]@googlemaps[\\/]/,
              name: 'maps',
              chunks: 'all',
              priority: 20,
            },
          },
        },
      };
      
      return config;
    },
  }),
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: process.env.SENTRY_ORG || "street-support-network",

  project: process.env.SENTRY_PROJECT || "streetsupport-platform-web",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});