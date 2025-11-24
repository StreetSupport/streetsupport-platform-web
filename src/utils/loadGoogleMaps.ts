const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

/**
 * Loads the Google Maps JS API by injecting a script tag.
 * Optimized for performance with better caching and error handling.
 */
let isLoadingPromise: Promise<typeof google> | null = null;
let isLoaded = false;

export const loadGoogleMaps = async (): Promise<typeof google> => {
  // If Google Maps is already loaded, return immediately
  if (isLoaded && typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.Map) {
    return window.google;
  }
  
  // If already loading, return the existing promise
  if (isLoadingPromise) {
    return isLoadingPromise;
  }
  
  isLoadingPromise = new Promise((resolve, reject) => {
    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Wait for it to load with timeout
      const checkLoaded = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          isLoaded = true;
          resolve(window.google);
        } else {
          setTimeout(checkLoaded, 50); // Reduced polling interval
        }
      };
      checkLoaded();
      return;
    }

    // Create and inject script tag
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&libraries=geometry`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      // Wait for google.maps to be fully available with timeout
      const checkAvailable = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          isLoaded = true;
          resolve(window.google);
        } else {
          setTimeout(checkAvailable, 50);
        }
      };
      checkAvailable();
    };
    
    script.onerror = () => {
      isLoadingPromise = null;
      isLoaded = false;
      reject(new Error('Failed to load Google Maps API'));
    };
    
    document.head.appendChild(script);
  });

  return isLoadingPromise;
};
