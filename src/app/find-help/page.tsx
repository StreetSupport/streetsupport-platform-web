'use client';

import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  slug?: string;
}

export default function FindHelpPage() {
  const [postcode, setPostcode] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch categories from API on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/get-categories');
        const data = await res.json();
        // Sort alphabetically by category name
        const sorted = data.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
        setCategories(sorted);
      } catch {
        setError('Failed to load categories');
      }
    }
    fetchCategories();
  }, []);

  // Try geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setError(null);
      },
      () => {
        setError('Unable to get your location');
      }
    );
  }, []);

  // Handle form submit (for now just log the inputs)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Search with:', { postcode, location, selectedCategory });
    alert(`Searching for category "${selectedCategory}" near postcode "${postcode || 'using geolocation'}"`);
  }

  return (
    <main>
      <h1>Find Help Near You</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="postcode">Enter postcode (if not using location):</label>
          <input
            id="postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Enter postcode"
          />
        </div>

        <div>
          <label htmlFor="category">Select a service category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Select category --</option>
            {categories.map((cat, index) => (
              <option key={cat.slug ?? cat.id ?? index} value={cat.slug ?? ''}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={!selectedCategory && !postcode && !location}>
          Search
        </button>
      </form>
    </main>
  );
}
