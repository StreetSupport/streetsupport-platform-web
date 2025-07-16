'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';

interface LocationPromptProps {
  onLocationSet?: () => void;
  className?: string;
}

export default function LocationPrompt({ onLocationSet, className = '' }: LocationPromptProps) {
  const { location, setLocation, requestLocation, error, isLoading, clearError } = useLocation();
  const [showPostcodeInput, setShowPostcodeInput] = useState(false);
  const [postcodeInput, setPostcodeInput] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Check if location is already set from navigation context
  useEffect(() => {
    if (location?.source === 'navigation') {
      onLocationSet?.();
    }
  }, [location, onLocationSet]);

  // Don't auto-request location on mount - let user choose

  const handleLocationRequest = async () => {
    setHasRequestedLocation(true);
    clearError();
    
    try {
      await requestLocation();
      onLocationSet?.();
    } catch {
      // Error is handled by context, show postcode input as fallback
      setShowPostcodeInput(true);
    }
  };

  const handlePostcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedPostcode = postcodeInput.trim();
    if (!trimmedPostcode) {
      setGeocodingError('Please enter a postcode');
      return;
    }

    // Basic UK postcode validation
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i;
    if (!postcodeRegex.test(trimmedPostcode)) {
      setGeocodingError('Please enter a valid UK postcode (e.g., M1 1AE)');
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);
    setNetworkError(null);

    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
        const { lat, lng } = data.location;
        setLocation({ 
          lat, 
          lng, 
          postcode: trimmedPostcode,
          source: 'postcode',
          radius: 10 // Default radius in km
        });
        setRetryCount(0); // Reset retry count on success
        onLocationSet?.();
      } else {
        setGeocodingError(data.error || 'Sorry, we couldn\'t find that postcode. Please check and try again.');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Geocoding error:', err);
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setNetworkError('Request timed out. Please check your connection and try again.');
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setNetworkError('Network error. Please check your internet connection.');
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

  const handleTryAgain = () => {
    clearError();
    setGeocodingError(null);
    setNetworkError(null);
    setHasRequestedLocation(false);
    setShowPostcodeInput(false);
    setRetryCount(0);
  };

  const handleUsePostcode = () => {
    clearError();
    setNetworkError(null);
    setShowPostcodeInput(true);
  };

  const handleRetryPostcode = async () => {
    if (retryCount >= 3) {
      setNetworkError('Maximum retry attempts reached. Please try again later or refresh the page.');
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount) * 1000;
    
    setTimeout(async () => {
      setIsRetrying(false);
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent;
      await handlePostcodeSubmit(syntheticEvent);
    }, delay);
  };

  const handleBrowseAllServices = () => {
    // Navigate to browse all services without location filtering
    window.location.href = '/find-help?browse=all';
  };

  // If location is already set, show confirmation
  if (location) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Location set: {location.postcode || `${location.lat?.toFixed(4)}, ${location.lng?.toFixed(4)}`}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {location.source === 'navigation' && 'Using location from page context'}
              {location.source === 'geolocation' && 'Using your current location'}
              {location.source === 'postcode' && 'Using postcode location'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Find Services Near You
        </h2>
        
        <p className="text-sm text-gray-600 mb-6">
          We&apos;ll help you find services in your area. You can share your location or enter your postcode.
        </p>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Getting your location...</span>
          </div>
        )}

        {/* Location permission error */}
        {error && !showPostcodeInput && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">{error.message}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleTryAgain}
                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleUsePostcode}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
              >
                Use Postcode Instead
              </button>
            </div>
          </div>
        )}

        {/* Initial location request */}
        {!hasRequestedLocation && !showPostcodeInput && !isLoading && !error && (
          <div className="space-y-4">
            <button
              onClick={handleLocationRequest}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Use My Current Location
            </button>
            <button
              onClick={handleUsePostcode}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
              Enter Postcode Instead
            </button>
          </div>
        )}

        {/* Postcode input form */}
        {showPostcodeInput && (
          <form onSubmit={handlePostcodeSubmit} className="space-y-4">
            <div className="text-left">
              <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your postcode
              </label>
              <input
                id="postcode"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., M1 1AE"
                value={postcodeInput}
                onChange={(e) => {
                  setPostcodeInput(e.target.value.toUpperCase());
                  setGeocodingError(null);
                }}
                disabled={isGeocoding}
                required
              />
              {geocodingError && (
                <p className="mt-2 text-sm text-red-600">{geocodingError}</p>
              )}
              {networkError && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{networkError}</p>
                  {retryCount < 3 && (
                    <div className="mt-2 flex space-x-2">
                      <button
                        type="button"
                        onClick={handleRetryPostcode}
                        disabled={isRetrying}
                        className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        {isRetrying ? 'Retrying...' : `Retry (${3 - retryCount} attempts left)`}
                      </button>
                      <button
                        type="button"
                        onClick={handleBrowseAllServices}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        Browse All Services
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isGeocoding || !postcodeInput.trim()}
              >
                {isGeocoding ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Finding Location...
                  </span>
                ) : (
                  'Find Services'
                )}
              </button>
              
              {!error && (
                <button
                  type="button"
                  onClick={handleLocationRequest}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isGeocoding}
                >
                  Use Location Instead
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}