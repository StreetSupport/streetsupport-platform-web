// src/components/FindHelpEntry.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';

export default function FindHelpEntry() {
  const { location, setLocation } = useLocation();
  const [fallbackVisible, setFallbackVisible] = useState(false);
  const [postcodeInput, setPostcodeInput] = useState('');

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

  function handlePostcodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (postcodeInput.trim()) {
      setLocation({ postcode: postcodeInput.trim() });
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
          <button type="submit" className="bg-blue-600 text-white py-2 rounded">
            Continue
          </button>
        </form>
      )}
    </section>
  );
}
