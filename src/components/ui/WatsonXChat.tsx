'use client';

import { useEffect } from 'react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

type WatsonAssistantInstance = {
  render: () => Promise<void>;
  destroy: () => void;
};

// Extend Window interface for WatsonX
declare global {
  interface Window {
    watsonAssistantChatOptions?: {
      integrationID: string;
      region: string;
      serviceInstanceID: string;
      clientVersion?: string;
      onLoad: (instance: WatsonAssistantInstance) => Promise<void>;
    };
  }
}

// West Midlands locations that should have WatsonX chat
const WATSON_X_LOCATIONS = [
  'birmingham',
  'sandwell',
  'walsall',
  'wolverhampton',
  'coventry',
  'dudley',
  'solihull'
];

interface WatsonXChatProps {
  locationSlug?: string;
}

// Module-level state — survives React Strict Mode unmount/remount cycles.
// The Watson SDK script is a one-shot global resource that cannot be safely
// removed and re-added, so we track it outside the component lifecycle.
let watsonInstance: WatsonAssistantInstance | null = null;
let scriptAdded = false;
let pendingCleanup: ReturnType<typeof setTimeout> | null = null;

function doCleanup() {
  pendingCleanup = null;
  if (watsonInstance) {
    try {
      watsonInstance.destroy();
    } catch (error) {
      console.error('Error destroying Watson Assistant instance', error);
    }
    watsonInstance = null;
  }
  scriptAdded = false;
  delete window.watsonAssistantChatOptions;
  const existing = document.querySelector(
    'script[src*="WatsonAssistantChatEntry.js"]'
  );
  if (existing) {
    existing.remove();
  }
}

/**
 * WatsonX Chat component for West Midlands locations
 * Injects the IBM WatsonX Assistant chat widget
 *
 * @param locationSlug - Optional location slug to determine if chat should be shown
 *                       If not provided, chat is always shown (for west-midlands hub page)
 */
export default function WatsonXChat({ locationSlug }: WatsonXChatProps) {
  const { hasConsent } = useCookieConsent();

  // Determine if we should show the chat widget (requires functional consent)
  const isWatsonLocation = !locationSlug || WATSON_X_LOCATIONS.includes(locationSlug);
  const hasFunctionalConsent = hasConsent('functional');
  const shouldShowChat = isWatsonLocation && hasFunctionalConsent;

  useEffect(() => {
    // Cancel any scheduled cleanup (e.g. from Strict Mode unmount/remount)
    if (pendingCleanup) {
      clearTimeout(pendingCleanup);
      pendingCleanup = null;
    }

    if (!shouldShowChat) {
      doCleanup();
      return;
    }

    // Already have a live instance or the script is loading — nothing to do
    if (watsonInstance || scriptAdded) return;

    scriptAdded = true;

    // Set up Watson Assistant options
    window.watsonAssistantChatOptions = {
      integrationID: '83b099b7-08a1-4118-bba3-341fbec366d1',
      region: 'eu-gb',
      serviceInstanceID: 'a3a6beaa-5967-4039-8390-d48ace365d86',
      onLoad: async (instance) => {
        watsonInstance = instance;
        await instance.render();
      }
    };

    // Load the Watson Assistant script
    const script = document.createElement('script');
    script.src =
      'https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Defer cleanup so a Strict Mode remount can cancel it.
      // If no remount follows (real unmount), cleanup fires after the timeout.
      pendingCleanup = setTimeout(doCleanup, 0);
    };
  }, [shouldShowChat]);

  // This component doesn't render anything visible
  return null;
}
