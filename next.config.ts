import {withSentryConfig} from '@sentry/nextjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com https://*.sentry-cdn.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://streetsupportstorageprod.blob.core.windows.net https://maps.googleapis.com https://maps.gstatic.com https://*.ggpht.com https://www.google-analytics.com https://www.googletagmanager.com https://www.google.co.uk",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://maps.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com https://*.analytics.google.com https://*.ingest.sentry.io https://*.sentry.io",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
];

const contentSecurityPolicy = cspDirectives.join('; ');

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ];
  },
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
  },
  compress: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    qualities: [75, 85],
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
    ],
  },

  turbopack: {
    resolveAlias: {
      'react-icons/lib': 'react-icons',
    },
  },

  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
  }),
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "street-support-network",

  project: process.env.SENTRY_PROJECT || "streetsupport-platform-web",

  silent: !process.env.CI,

  widenClientFileUpload: true,
});
