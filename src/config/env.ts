function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const env = {
  mongodb: {
    uri: () => required('MONGODB_URI'),
  },
  google: {
    mapsApiKey: () => optional('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', ''),
    geocodingApiKey: () => optional('GOOGLE_GEOCODING_API_KEY', ''),
    analyticsId: () => optional('NEXT_PUBLIC_GA_MEASUREMENT_ID', ''),
  },
  sendgrid: {
    apiKey: () => optional('SENDGRID_API_KEY', ''),
    fromEmail: () => optional('FROM_EMAIL', 'noreply@streetsupport.net'),
    partnershipTemplateId: () => optional('SENDGRID_PARTNERSHIP_APPLICATION_TEMPLATE_ID', ''),
    organisationRequestTemplateId: () => optional('SENDGRID_ORGANISATION_REQUEST_TEMPLATE_ID', ''),
  },
  email: {
    partnershipAdmin: () => optional('PARTNERSHIP_APPLICATION_ADMIN_EMAIL', ''),
    organisationRequestAdmin: () => optional('ORGANISATION_REQUEST_ADMIN_EMAIL', ''),
  },
  sentry: {
    dsn: () => optional('NEXT_PUBLIC_SENTRY_DSN', ''),
  },
  app: {
    baseUrl: () => optional('NEXT_PUBLIC_BASE_URL', 'https://streetsupport.net'),
    adminUrl: () => optional('NEXT_PUBLIC_ADMIN_URL', ''),
  },
  isTest: () => process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === '1',
  isDev: () => process.env.NODE_ENV === 'development',
  isProd: () => process.env.NODE_ENV === 'production',
} as const;
