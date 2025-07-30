const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

/**
 * Loads the Google Maps JS API by injecting a script tag.
 */
let isLoadingPromise: Promise<typeof google> | null = null;

export const loadGoogleMaps = async (): Promise<typeof google> => {
  console.warn('Loading Google Maps with API key:', apiKey ? 'Present' : 'Missing');
  
  // If Google Maps is already loaded, return immediately
  if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.Map) {
    console.warn('Google Maps already loaded');
    return window.google;
  }
  
  // If already loading, return the existing promise
  if (isLoadingPromise) {
    console.warn('Google Maps loading in progress, waiting...');
    return isLoadingPromise;
  }
  
  isLoadingPromise = new Promise((resolve, reject) => {
    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      console.warn('Google Maps script already exists, waiting for load...');
      // Wait for it to load
      const checkLoaded = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          resolve(window.google);
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    // Create and inject script tag
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.warn('Google Maps script loaded');
      // Wait for google.maps to be fully available
      const checkAvailable = () => {
        if (window.google && window.google.maps && window.google.maps.Map) {
          console.warn('Google Maps API fully available');
          resolve(window.google);
        } else {
          setTimeout(checkAvailable, 50);
        }
      };
      checkAvailable();
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Google Maps script:', error);
      isLoadingPromise = null;
      reject(new Error('Failed to load Google Maps API'));
    };
    
    document.head.appendChild(script);
  });

  return isLoadingPromise;
};
