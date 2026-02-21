// Database
export const DB_NAME = 'streetsupport';

// API default limits
export const DEFAULT_SERVICE_LIMIT = 20;
export const DEFAULT_SERVICE_PROVIDER_LIMIT = 20;
export const DEFAULT_ACCOMMODATION_LIMIT = 50;
export const DEFAULT_ORG_SEARCH_LIMIT = 10;
// Must load all results because services and accommodation are interleaved by distance client-side.
// Raised from 100 to 500 for dense urban areas.
export const MAX_SERVICES_FETCH_LIMIT = 500;
export const FALLBACK_SERVICES_LIMIT = 50;
export const DEFAULT_SEARCH_RADIUS_KM = 5;

// Timeouts (ms)
export const API_TIMEOUT_MS = 15000;
export const FALLBACK_TIMEOUT_MS = 10000;

// Cache TTLs (ms)
export const CACHE_TTL = {
  services: 900000,         // 15 minutes
  accommodation: 300000,    // 5 minutes
  testEnvironment: 60000,   // 1 minute
} as const;

// Cache-Control header values
export const CACHE_HEADERS = {
  services: 'public, max-age=900, s-maxage=1800, stale-while-revalidate=86400',
  serviceProviders: 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
  accommodation: 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
  locations: 'public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400',
  locationStats: 'public, max-age=3600, s-maxage=7200',
  news: 'public, max-age=1800, s-maxage=3600',
  sitemap: 'public, max-age=3600, s-maxage=3600',
  noCache: 'no-store, no-cache, must-revalidate, max-age=0',
  test: 'no-cache',
} as const;

// Full no-cache header set for dynamic endpoints (banners, SWEP, etc.)
export const NO_CACHE_RESPONSE_HEADERS = {
  'Cache-Control': CACHE_HEADERS.noCache,
  'Pragma': 'no-cache',
  'Expires': '0',
} as const;

// External URLs
export const NEWS_BASE_URL = 'https://news.streetsupport.net';
