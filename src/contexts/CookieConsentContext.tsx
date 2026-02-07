'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  CookieCategory,
  ConsentState,
  CONSENT_VERSION,
  CONSENT_STORAGE_KEY,
} from '@/types/cookieConsent';

interface CookieConsentContextType {
  consentState: ConsentState | null;
  hasConsent: (category: CookieCategory) => boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (categories: Partial<ConsentState['categories']>) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  isPreferencesOpen: boolean;
  isConsentGiven: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as ConsentState;

    if (parsed.version !== CONSENT_VERSION) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(state: ConsentState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save cookie consent:', error);
  }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consentState, setConsentState] = useState<ConsentState | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    setConsentState(stored);
    setIsInitialised(true);
  }, []);

  const hasConsent = useCallback((category: CookieCategory): boolean => {
    if (!consentState) return category === 'necessary' || category === 'analytics';
    return consentState.categories[category];
  }, [consentState]);

  const createConsentState = useCallback((categories: ConsentState['categories']): ConsentState => {
    return {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      categories,
    };
  }, []);

  const acceptAll = useCallback(() => {
    const newState = createConsentState({
      necessary: true,
      analytics: true,
      functional: true,
    });
    setConsentState(newState);
    saveConsent(newState);
  }, [createConsentState]);

  const rejectAll = useCallback(() => {
    const newState = createConsentState({
      necessary: true,
      analytics: false,
      functional: false,
    });
    setConsentState(newState);
    saveConsent(newState);
  }, [createConsentState]);

  const updateConsent = useCallback((categories: Partial<ConsentState['categories']>) => {
    const currentCategories = consentState?.categories || {
      necessary: true,
      analytics: true,
      functional: false,
    };

    const newState = createConsentState({
      ...currentCategories,
      ...categories,
      necessary: true,
    });
    setConsentState(newState);
    saveConsent(newState);
  }, [consentState, createConsentState]);

  const openPreferences = useCallback(() => {
    setIsPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const isConsentGiven = isInitialised && consentState !== null;

  return (
    <CookieConsentContext.Provider
      value={{
        consentState,
        hasConsent,
        acceptAll,
        rejectAll,
        updateConsent,
        openPreferences,
        closePreferences,
        isPreferencesOpen,
        isConsentGiven,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}

export { CookieConsentContext };
