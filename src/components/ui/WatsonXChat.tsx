'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useCookieConsent } from '@/contexts/CookieConsentContext';

type WatsonAssistantInstance = {
  render: () => Promise<void>;
  destroy: () => void;
};

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

const WATSON_X_LOCATIONS = [
  'birmingham',
  'sandwell',
  'walsall',
  'wolverhampton',
  'coventry',
  'dudley',
  'solihull'
];

const WATSON_SCRIPT_URL =
  'https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js';

interface WatsonXChatProps {
  locationSlug?: string;
}

let watsonInstance: WatsonAssistantInstance | null = null;
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
  delete window.watsonAssistantChatOptions;
}

export default function WatsonXChat({ locationSlug }: WatsonXChatProps) {
  const { hasConsent } = useCookieConsent();

  const isWatsonLocation = !locationSlug || WATSON_X_LOCATIONS.includes(locationSlug);
  const hasFunctionalConsent = hasConsent('functional');
  const shouldShowChat = isWatsonLocation && hasFunctionalConsent;

  useEffect(() => {
    if (pendingCleanup) {
      clearTimeout(pendingCleanup);
      pendingCleanup = null;
    }

    if (!shouldShowChat) {
      doCleanup();
      return;
    }

    if (!watsonInstance) {
      window.watsonAssistantChatOptions = {
        integrationID: '83b099b7-08a1-4118-bba3-341fbec366d1',
        region: 'eu-gb',
        serviceInstanceID: 'a3a6beaa-5967-4039-8390-d48ace365d86',
        onLoad: async (instance) => {
          watsonInstance = instance;
          await instance.render();
        }
      };
    }

    return () => {
      pendingCleanup = setTimeout(doCleanup, 0);
    };
  }, [shouldShowChat]);

  if (!shouldShowChat) return null;

  return (
    <Script
      src={WATSON_SCRIPT_URL}
      strategy="afterInteractive"
    />
  );
}
