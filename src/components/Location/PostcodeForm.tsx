import { useState } from 'react';
import locations from '@/data/locations.json';

interface PostcodeFormProps {
  postcodeInput: string;
  onPostcodeChange: (value: string) => void;
  isGeocoding: boolean;
  geocodingError: string | null;
  networkError: string | null;
  onPostcodeSubmit: (e: React.FormEvent) => void;
  onLocationSelect: (slug: string) => void;
  onClearGeocodingError: () => void;
  showLocationRetry: boolean;
  onLocationRetry: () => void;
}

export default function PostcodeForm({
  postcodeInput,
  onPostcodeChange,
  isGeocoding,
  geocodingError,
  networkError,
  onPostcodeSubmit,
  onLocationSelect,
  onClearGeocodingError,
  showLocationRetry,
  onLocationRetry,
}: PostcodeFormProps) {
  const [selectedLocationSlug, setSelectedLocationSlug] = useState('');

  const handleLocationDropdownSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLocationSlug) {
      onLocationSelect(selectedLocationSlug);
    }
  };

  return (
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

      <form onSubmit={onPostcodeSubmit} className="space-y-4" role="form">
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
              onPostcodeChange(e.target.value.toUpperCase());
              onClearGeocodingError();
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-q" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-brand-f">or</span>
        </div>
      </div>

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

      <div className="text-center">
        {showLocationRetry && (
          <button
            type="button"
            onClick={onLocationRetry}
            className="btn-base btn-tertiary btn-sm"
          >
            Try location access again
          </button>
        )}
      </div>
    </div>
  );
}
