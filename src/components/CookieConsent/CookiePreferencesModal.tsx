'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

interface CategoryToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function CategoryToggle({
  id,
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: CategoryToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-brand-f last:border-b-0">
      <div className="flex-1">
        <label htmlFor={id} className="text-base font-semibold text-brand-k cursor-pointer">
          {label}
        </label>
        <p className="mt-1 text-sm text-brand-l">{description}</p>
      </div>
      <div className="flex-shrink-0">
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-offset-2
            ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
            ${checked ? 'bg-brand-a' : 'bg-brand-f'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${checked ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    </div>
  );
}

export default function CookiePreferencesModal() {
  const {
    isPreferencesOpen,
    closePreferences,
    consentState,
    updateConsent,
    acceptAll,
    rejectAll,
  } = useCookieConsent();

  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [functionalEnabled, setFunctionalEnabled] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (consentState) {
      setAnalyticsEnabled(consentState.categories.analytics);
      setFunctionalEnabled(consentState.categories.functional);
    } else {
      setAnalyticsEnabled(true);
      setFunctionalEnabled(false);
    }
  }, [consentState, isPreferencesOpen]);

  useEffect(() => {
    if (isPreferencesOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isPreferencesOpen]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isPreferencesOpen) return;

      if (event.key === 'Escape') {
        closePreferences();
        return;
      }

      if (event.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [isPreferencesOpen, closePreferences]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSavePreferences = () => {
    updateConsent({
      analytics: analyticsEnabled,
      functional: functionalEnabled,
    });
    closePreferences();
  };

  const handleAcceptAll = () => {
    acceptAll();
    closePreferences();
  };

  const handleRejectAll = () => {
    rejectAll();
    closePreferences();
  };

  if (!isPreferencesOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-brand-k/50"
        onClick={closePreferences}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        tabIndex={-1}
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl mx-4"
      >
        <div className="sticky top-0 bg-white border-b border-brand-f px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 id="cookie-preferences-title" className="heading-4 text-brand-k">
              Cookie Preferences
            </h2>
            <button
              type="button"
              onClick={closePreferences}
              className="p-2 text-brand-l hover:text-brand-k transition-colors rounded-full hover:bg-brand-e"
              aria-label="Close cookie preferences"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-sm text-brand-l mb-6">
            We use cookies to enhance your browsing experience and analyse site traffic.
            Under the UK Data (Use and Access) Act 2025, analytics cookies are enabled by
            default and do not require prior consent. You can opt out of analytics cookies
            below. Functional cookies still require your consent.
          </p>

          <div>
            <CategoryToggle
              id="necessary-cookies"
              label="Necessary"
              description="Essential for the website to function. These cookies cannot be disabled as they are required for core features like navigation and security."
              checked={true}
              disabled={true}
              onChange={() => {}}
            />

            <CategoryToggle
              id="analytics-cookies"
              label="Analytics"
              description="Help us understand how visitors interact with our website. We use Google Analytics to collect anonymous usage data. Under UK law, these cookies are active by default. You can opt out here."
              checked={analyticsEnabled}
              onChange={setAnalyticsEnabled}
            />

            <CategoryToggle
              id="functional-cookies"
              label="Functional"
              description="Enable additional features like the Watson Assistant chat widget that provides automated help for some locations."
              checked={functionalEnabled}
              onChange={setFunctionalEnabled}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-brand-f px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleRejectAll}
              className="btn-base btn-secondary btn-sm flex-1"
            >
              Reject All
            </button>
            <button
              type="button"
              onClick={handleSavePreferences}
              className="btn-base btn-secondary btn-sm flex-1"
            >
              Save Preferences
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="btn-base btn-primary btn-sm flex-1"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
