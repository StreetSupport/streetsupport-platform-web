/**
 * Waits for the Google Maps JS API to become available on the window object.
 * The actual script tag is rendered via next/script in GoogleMap.tsx.
 */
export const GOOGLE_MAPS_SCRIPT_URL = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=weekly&libraries=geometry`;

let readyPromise: Promise<typeof google> | null = null;

export function isGoogleMapsReady(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.google?.maps?.Map
  );
}

export function waitForGoogleMaps(): Promise<typeof google> {
  if (isGoogleMapsReady()) {
    return Promise.resolve(window.google);
  }

  if (readyPromise) return readyPromise;

  readyPromise = new Promise((resolve) => {
    const check = () => {
      if (isGoogleMapsReady()) {
        resolve(window.google);
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });

  return readyPromise;
}

/** @deprecated Use waitForGoogleMaps instead */
export const loadGoogleMaps = waitForGoogleMaps;
