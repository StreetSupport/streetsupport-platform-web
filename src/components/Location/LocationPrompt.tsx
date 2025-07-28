'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import locations from '@/data/locations.json';

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
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocationSlug, setSelectedLocationSlug] = useState('');
  const [showOrgSearch, setShowOrgSearch] = useState(false);
  const [orgSearchInput, setOrgSearchInput] = useState('');
  const [isOrgSearching, setIsOrgSearching] = useState(false);
  const [orgSearchError, setOrgSearchError] = useState<string | null>(null);

  // Check if location is already set from navigation context
  useEffect(() => {
    if (location?.source === 'navigation') {
      onLocationSet?.();
    }
  }, [location, onLocationSet]);
  
  // Show location dropdown when postcode input is shown
  useEffect(() => {
    if (showPostcodeInput) {
      setShowLocationDropdown(true);
    }
  }, [showPostcodeInput]);


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
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

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
          radius: 5 // Default radius in km
        });
        onLocationSet?.();
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

  const handleTryAgain = () => {
    clearError();
    setGeocodingError(null);
    setNetworkError(null);
    setHasRequestedLocation(false);
    setShowPostcodeInput(false);
  };

  const handleUsePostcode = () => {
    clearError();
    setNetworkError(null);
    setShowPostcodeInput(true);
  };

  const handleOrgSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedQuery = orgSearchInput.trim();
    if (!trimmedQuery) {
      setOrgSearchError('Please enter an organisation name');
      return;
    }

    setIsOrgSearching(true);
    setOrgSearchError(null);

    try {
      const response = await fetch(`/api/organisations/search?q=${encodeURIComponent(trimmedQuery)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setOrgSearchError('No organisations found matching your search');
        } else if (response.status >= 500) {
          setOrgSearchError('Server error. Please try again later.');
        } else {
          setOrgSearchError('Search failed. Please try again.');
        }
        return;
      }

      const data = await response.json();
      
      if (data.organisations && data.organisations.length > 0) {
        // If only one result, navigate directly to it
        if (data.organisations.length === 1) {
          window.location.href = `/find-help/organisation/${data.organisations[0].slug}`;
        } else {
          // Multiple results - navigate to search results page
          window.location.href = `/find-help/organisations?search=${encodeURIComponent(trimmedQuery)}`;
        }
      } else {
        setOrgSearchError('No organisations found matching your search');
      }
    } catch (err) {
      console.error('Organisation search error:', err);
      setOrgSearchError('Network error. Please check your connection and try again.');
    } finally {
      setIsOrgSearching(false);
    }
  };


  
  const handleLocationDropdownSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocationSlug) {
      return;
    }
    
    const selectedLocation = locations.find(loc => loc.slug === selectedLocationSlug && loc.isPublic);
    if (selectedLocation) {
      setLocation({
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
        source: 'location',
        slug: selectedLocation.slug,
        label: selectedLocation.name,
        radius: 5 // Default radius in km
      });
      onLocationSet?.();
    }
  };
  

  // If location is already set, show confirmation
  if (location) {
    return (
      <div className={`bg-brand-i border border-brand-b rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Location set: {location.postcode || location.label || `${location.lat?.toFixed(4)}, ${location.lng?.toFixed(4)}`}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {location.source === 'navigation' && 'Using location from page context'}
              {location.source === 'geolocation' && 'Using your current location'}
              {location.source === 'postcode' && 'Using postcode location'}
              {location.source === 'location' && 'Using selected location'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-6 ${className}`}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <svg className="h-6 w-6 text-brand-a" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        
        <h2 className="heading-5">
          Find Services Near You
        </h2>
        
        <p className="text-small mb-6">
          We&apos;ll help you find services in your area. You can share your location or enter your postcode. You can also{' '}
          <button
            onClick={() => setShowOrgSearch(true)}
            className="text-brand-a hover:text-brand-b underline transition-colors"
          >
            search for an organisation by name
          </button>.
        </p>

        {/* Organization search form */}
        {showOrgSearch && (
          <form onSubmit={handleOrgSearch} className="space-y-4 mb-6">
            <div className="text-left">
              <label htmlFor="org-search" className="block text-small font-medium text-brand-l mb-2">
                Search for an organisation by name
              </label>
              <input
                id="org-search"
                type="text"
                className="w-full px-3 py-2 border border-brand-q rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-transparent"
                placeholder="e.g., Manchester City Mission"
                value={orgSearchInput}
                onChange={(e) => {
                  setOrgSearchInput(e.target.value);
                  setOrgSearchError(null);
                }}
                disabled={isOrgSearching}
                required
              />
              {orgSearchError && (
                <p className="mt-2 text-sm text-red-600">{orgSearchError}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-base btn-primary btn-md flex-1"
                disabled={isOrgSearching || !orgSearchInput.trim()}
              >
                {isOrgSearching ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-q mr-2"></div>
                    Searching...
                  </span>
                ) : (
                  'Search Organisations'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOrgSearch(false);
                  setOrgSearchInput('');
                  setOrgSearchError(null);
                }}
                className="btn-base btn-tertiary btn-md"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-4" role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-small">Getting your location...</span>
          </div>
        )}

        {/* Location permission error */}
        {error && !showPostcodeInput && !showLocationDropdown && (
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
                className="btn-base btn-warning btn-sm"
              >
                Try Again
              </button>
              <button
                onClick={handleUsePostcode}
                className="btn-base btn-primary btn-sm"
              >
                Enter Postcode or Choose a Location
              </button>
            </div>
          </div>
        )}

        
        {/* Initial location request */}
        {!hasRequestedLocation && !showPostcodeInput && !showLocationDropdown && !isLoading && !error && (
          <div className="space-y-4">
            <button
              onClick={handleLocationRequest}
              className="btn-base btn-primary btn-lg w-full"
            >
              Use My Current Location
            </button>
            <button
              onClick={handleUsePostcode}
              className="btn-base btn-secondary btn-lg w-full"
            >
              Enter Postcode or Choose a Location
            </button>
          </div>
        )}

        {/* Postcode and location selection form */}
        {showPostcodeInput && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-brand-b" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-small text-brand-c">Choose how you&apos;d like to find services near you:</p>
                </div>
              </div>
            </div>

            {/* Postcode input section */}
            <form onSubmit={handlePostcodeSubmit} className="space-y-4" role="form">
              <div className="text-left">
                <label htmlFor="postcode" className="block text-small font-medium text-brand-l mb-2">
                  Option 1: Enter your postcode
                </label>
                <input
                  id="postcode"
                  type="text"
                  className="w-full px-3 py-2 border border-brand-q rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-transparent"
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
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="btn-base btn-primary btn-md w-full"
                disabled={isGeocoding || !postcodeInput.trim()}
              >
                {isGeocoding ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-q mr-2"></div>
                    Finding Location...
                  </span>
                ) : (
                  'Find Services by Postcode'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-q" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-brand-f">or</span>
              </div>
            </div>

            {/* Location dropdown section */}
            <form onSubmit={handleLocationDropdownSubmit} className="space-y-4" role="form">
              <div className="text-left">
                <label htmlFor="location-select" className="block text-small font-medium text-brand-l mb-2">
                  Option 2: Select your area
                </label>
                <select
                  id="location-select"
                  className="w-full px-3 py-2 border border-brand-q rounded-md focus:outline-none focus:ring-2 focus:ring-brand-a focus:border-transparent"
                  value={selectedLocationSlug}
                  onChange={(e) => setSelectedLocationSlug(e.target.value)}
                >
                  <option value="">Choose your area...</option>
                  {locations
                    .filter(loc => loc.isPublic)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(location => (
                      <option key={location.slug} value={location.slug}>
                        {location.name}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <button
                type="submit"
                className="btn-base btn-success btn-md w-full"
                disabled={!selectedLocationSlug}
              >
                Find Services in {selectedLocationSlug ? locations.find(l => l.slug === selectedLocationSlug)?.name : 'Selected Area'}
              </button>
            </form>

            {/* Navigation links */}
            <div className="text-center">
              {!error && (
                <button
                  type="button"
                  onClick={handleLocationRequest}
                  className="btn-base btn-tertiary btn-sm"
                >
                  Try location access again
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}