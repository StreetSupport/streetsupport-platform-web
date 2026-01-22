'use client';

import { useCookieConsent } from '@/contexts/CookieConsentContext';
import GoogleAnalytics from './GoogleAnalytics';

interface ConditionalGoogleAnalyticsProps {
  measurementId?: string;
}

export default function ConditionalGoogleAnalytics({
  measurementId,
}: ConditionalGoogleAnalyticsProps) {
  const { hasConsent } = useCookieConsent();

  if (!hasConsent('analytics')) {
    return null;
  }

  return <GoogleAnalytics measurementId={measurementId} />;
}
