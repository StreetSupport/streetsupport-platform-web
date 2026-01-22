export type CookieCategory = 'necessary' | 'analytics' | 'functional';

export interface ConsentState {
  version: string;
  timestamp: string;
  categories: {
    necessary: true;
    analytics: boolean;
    functional: boolean;
  };
}

export const CONSENT_VERSION = '1.0';
export const CONSENT_STORAGE_KEY = 'ss_cookie_consent';
