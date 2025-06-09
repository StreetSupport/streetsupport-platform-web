'use client';

import { useEffect, useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';

export default function FindHelpEntry() {
  const { location, setLocation } = useLocation();
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const [postcodeInput, setPostcodeInput] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setFallbackVisible(true);
        },
        { timeout: 10000 }
      );
    } else {
      setFallbackVisible(true);
    }
  }, [setLocation]);

  async function handlePostcodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postcodeInput.trim()) return;

    setIsGeocoding(true);

    try {
      const response = await fetch(`/api/geocode?postcode=${encodeURIComponent(postcodeInput.trim())}`);
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();

      if (data.location?.lat && data.location?.lng) {
        const { lat, lng } = data.location;
        setLocation({ lat, lng, postcode: postcodeInput.trim() });
      } else {
        alert(data.error || 'Sorry, we couldn’t find that postcode.');
      }

    } catch {
      alert('Something went wrong when trying to find your location.');
    } finally {
      setIsGeocoding(false);
    }
  }

  return (
    <section className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Find Help Near You</h1>
      {location && (
        <p className="text-green-700 mb-4">
          Location set: {location.postcode || `${location.lat}, ${location.lng}`}
        </p>
      )}
      {fallbackVisible && (
        <form onSubmit={handlePostcodeSubmit} className="flex flex-col gap-2">
          <label htmlFor="postcode" className="text-sm font-medium">
            Enter your postcode
          </label>
          <input
            id="postcode"
            type="text"
            className="p-2 border border-gray-300 rounded"
            value={postcodeInput}
            onChange={(e) => setPostcodeInput(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            disabled={isGeocoding}
          >
            {isGeocoding ? 'Locating...' : 'Continue'}
          </button>
        </form>
      )}
    </section>
  );
}
