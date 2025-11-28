'use client';

import { useEffect } from 'react';

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
    watsonAssistantInstance?: {
      // The web chat instance exposes a destroy() method that removes all UI
      destroy: () => void;
    } | null;
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

/**
 * WatsonX Chat component for West Midlands locations
 * Injects the IBM WatsonX Assistant chat widget
 * 
 * @param locationSlug - Optional location slug to determine if chat should be shown
 *                       If not provided, chat is always shown (for west-midlands hub page)
 */
export default function WatsonXChat({ locationSlug }: WatsonXChatProps) {
  // Determine if we should show the chat widget
  const shouldShowChat = !locationSlug || WATSON_X_LOCATIONS.includes(locationSlug);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Don't initialize if this location shouldn't have the chat
    if (!shouldShowChat) {
      // Clean up any existing instance when navigating away from WM locations
      if (window.watsonAssistantInstance) {
        try {
          window.watsonAssistantInstance.destroy();
        } catch (error) {
          console.error('Error destroying Watson Assistant instance', error);
        }
        window.watsonAssistantInstance = null;
      }
      const existingScript = document.querySelector(
        'script[src*="WatsonAssistantChatEntry.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
      delete window.watsonAssistantChatOptions;
      return;
    }

    // Check if already initialized
    if (window.watsonAssistantChatOptions) return;

    // Set up Watson Assistant options
    window.watsonAssistantChatOptions = {
      integrationID: '83b099b7-08a1-4118-bba3-341fbec366d1',
      region: 'eu-gb',
      serviceInstanceID: 'a3a6beaa-5967-4039-8390-d48ace365d86',
      onLoad: async (instance) => {
        // Keep a reference so we can destroy it when the component unmounts
        window.watsonAssistantInstance = instance;
        await instance.render();
      }
    };

    // Load the Watson Assistant script
    const script = document.createElement('script');
    script.src = `https://web-chat.global.assistant.watson.appdomain.cloud/versions/${
      window.watsonAssistantChatOptions.clientVersion || 'latest'
    }/WatsonAssistantChatEntry.js`;
    script.async = true;
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      // Destroy the existing chat instance so the widget disappears
      if (window.watsonAssistantInstance) {
        try {
          window.watsonAssistantInstance.destroy();
        } catch (error) {
          console.error('Error destroying Watson Assistant instance', error);
        }
        window.watsonAssistantInstance = null;
      }

      // Remove the script if component unmounts
      const existingScript = document.querySelector(
        'script[src*="WatsonAssistantChatEntry.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }

      // Clean up the global options
      delete window.watsonAssistantChatOptions;
    };
  }, [shouldShowChat, locationSlug]);

  // This component doesn't render anything visible
  return null;
}
