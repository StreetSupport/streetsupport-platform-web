'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { useOrgSearch } from '@/hooks/useOrgSearch';
import { usePostcodeLookup } from '@/hooks/usePostcodeLookup';
import OrgSearchForm from '@/components/Location/OrgSearchForm';
import PostcodeForm from '@/components/Location/PostcodeForm';
import locations from '@/data/locations.json';

interface LocationPromptProps {
  onLocationSet?: () => void;
  className?: string;
}

export default function LocationPrompt({ onLocationSet, className = '' }: LocationPromptProps) {
  const { location, setLocation, requestLocation, error, isLoading, clearError } = useLocation();
  const [showPostcodeInput, setShowPostcodeInput] = useState(false);
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const [showOrgSearch, setShowOrgSearch] = useState(false);

  const orgSearch = useOrgSearch();

  const handlePostcodeSuccess = useCallback((result: { lat: number; lng: number }, postcode: string) => {
    setLocation({
      lat: result.lat,
      lng: result.lng,
      postcode,
      source: 'postcode',
      radius: 5,
    });
    onLocationSet?.();
  }, [setLocation, onLocationSet]);

  const postcodeLookup = usePostcodeLookup({ onSuccess: handlePostcodeSuccess });

  useEffect(() => {
    if (location?.source === 'navigation') {
      onLocationSet?.();
    }
  }, [location, onLocationSet]);

  const handleLocationRequest = async () => {
    setHasRequestedLocation(true);
    clearError();

    try {
      await requestLocation();
      onLocationSet?.();
    } catch {
      setShowPostcodeInput(true);
    }
  };

  const handleTryAgain = () => {
    clearError();
    postcodeLookup.setGeocodingError(null);
    postcodeLookup.setNetworkError(null);
    setHasRequestedLocation(false);
    setShowPostcodeInput(false);
  };

  const handleUsePostcode = () => {
    clearError();
    postcodeLookup.setNetworkError(null);
    setShowPostcodeInput(true);
  };

  const handleLocationSelect = (slug: string) => {
    const selectedLocation = locations.find(loc => loc.slug === slug && loc.isPublic);
    if (selectedLocation) {
      setLocation({
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
        source: 'location',
        slug: selectedLocation.slug,
        label: selectedLocation.name,
        radius: 5,
      });
      onLocationSet?.();
    }
  };

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

        {showOrgSearch && (
          <OrgSearchForm
            orgSearchInput={orgSearch.orgSearchInput}
            onInputChange={orgSearch.setOrgSearchInput}
            isOrgSearching={orgSearch.isOrgSearching}
            orgSearchError={orgSearch.orgSearchError}
            onClearError={() => orgSearch.setOrgSearchError(null)}
            onSubmit={orgSearch.handleOrgSearch}
            onCancel={() => {
              setShowOrgSearch(false);
              orgSearch.setOrgSearchInput('');
              orgSearch.setOrgSearchError(null);
            }}
          />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-4" role="status" aria-label="Loading">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-small">Getting your location...</span>
          </div>
        )}

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
                className="inline-flex items-center justify-center px-4 py-2 bg-brand-a text-white font-medium rounded-md hover:bg-brand-b active:bg-brand-c transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-offset-2"
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

        {!hasRequestedLocation && !showPostcodeInput && !isLoading && !error && (
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

        {showPostcodeInput && (
          <PostcodeForm
            postcodeInput={postcodeLookup.postcodeInput}
            onPostcodeChange={postcodeLookup.setPostcodeInput}
            isGeocoding={postcodeLookup.isGeocoding}
            geocodingError={postcodeLookup.geocodingError}
            networkError={postcodeLookup.networkError}
            onPostcodeSubmit={postcodeLookup.handlePostcodeSubmit}
            onLocationSelect={handleLocationSelect}
            onClearGeocodingError={() => postcodeLookup.setGeocodingError(null)}
            showLocationRetry={!error}
            onLocationRetry={handleLocationRequest}
          />
        )}

      </div>
    </div>
  );
}
