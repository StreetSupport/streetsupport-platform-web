import { useState } from 'react';

interface PostcodeLookupResult {
  lat: number;
  lng: number;
}

interface UsePostcodeLookupOptions {
  onSuccess: (result: PostcodeLookupResult, postcode: string) => void;
}

interface UsePostcodeLookupReturn {
  postcodeInput: string;
  setPostcodeInput: (value: string) => void;
  isGeocoding: boolean;
  geocodingError: string | null;
  setGeocodingError: (error: string | null) => void;
  networkError: string | null;
  setNetworkError: (error: string | null) => void;
  handlePostcodeSubmit: (e: React.FormEvent) => Promise<void>;
}

export function usePostcodeLookup({ onSuccess }: UsePostcodeLookupOptions): UsePostcodeLookupReturn {
  const [postcodeInput, setPostcodeInput] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const handlePostcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPostcode = postcodeInput.trim();
    if (!trimmedPostcode) {
      setGeocodingError('Please enter a postcode');
      return;
    }

    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
    if (!postcodeRegex.test(trimmedPostcode)) {
      setGeocodingError('Please enter a valid UK postcode (e.g., M1 1AE)');
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);
    setNetworkError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`/api/geocode?postcode=${encodeURIComponent(trimmedPostcode)}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }

      const data = await response.json();

      if (data.location?.lat && data.location?.lng) {
        onSuccess({ lat: data.location.lat, lng: data.location.lng }, trimmedPostcode);
      } else {
        setGeocodingError(data.error || 'Postcode not found');
      }
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setNetworkError('Request timed out. Please check your connection and try again.');
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setNetworkError('Network error. Please check your internet connection.');
        } else if (err.message.includes('Server error')) {
          setGeocodingError('Server error. Please try again later.');
        } else if (err.message.includes('Too many requests')) {
          setGeocodingError('Too many requests. Please wait a moment and try again.');
        } else {
          setGeocodingError(err.message || 'Something went wrong when trying to find your location. Please try again.');
        }
      } else {
        setGeocodingError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsGeocoding(false);
    }
  };

  return {
    postcodeInput,
    setPostcodeInput,
    isGeocoding,
    geocodingError,
    setGeocodingError,
    networkError,
    setNetworkError,
    handlePostcodeSubmit,
  };
}
