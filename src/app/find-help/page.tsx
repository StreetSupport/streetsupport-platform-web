'use client';

import { useState } from 'react';

export default function FindHelpPage() {
  const [location, setLocation] = useState<string | null>(null);
  const [postcode, setPostcode] = useState('');

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Lat: ${latitude}, Lon: ${longitude}`);
      },
      () => {
        alert('Unable to retrieve your location.');
      }
    );
  };

  return (
    <main>
      <h1>Find Help Near You</h1>

      <section>
        <button onClick={handleGeolocation}>Use My Current Location</button>

        <div>
          <label htmlFor="postcode">Or enter a postcode:</label>
          <input
            id="postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Enter postcode"
          />
        </div>
      </section>

      <section>
        <h2>Filter by Category</h2>
        <p>[Category filter will go here]</p>
      </section>

      <section>
        <h2>Results</h2>
        <p>{location ? `Showing results for ${location}` : 'No location selected yet.'}</p>
        <p>[Service results will appear here]</p>
      </section>
    </main>
  );
}
