'use client';

import Link from 'next/link';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

export default function CookieConsentBanner() {
  const { isConsentGiven, acceptAll, rejectAll, openPreferences } = useCookieConsent();

  if (isConsentGiven) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-brand-q border-t border-brand-f shadow-lg"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
    >
      <div className="page-container py-4 md:py-6">
        <div className="flex flex-col gap-4">
          <div className="text-sm text-brand-k">
            <p>
              We use cookies to improve your experience and analyse site usage.{' '}
              <Link
                href="/about/privacy-and-data/cookie-policy"
                className="text-brand-a hover:text-brand-b underline"
              >
                View our Cookie Policy
              </Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={openPreferences}
              className="btn-base btn-secondary btn-sm order-3 sm:order-1"
            >
              Manage Preferences
            </button>
            <button
              type="button"
              onClick={rejectAll}
              className="btn-base btn-secondary btn-sm order-2"
            >
              Reject All
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="btn-base btn-primary btn-sm order-1 sm:order-3"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
