'use client';

import React, { useEffect, useState } from 'react';

type Location = {
  id: string;
  name: string;
};

export default function LocationSelector({ hideLegend = false }: { hideLegend?: boolean }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    async function fetchLocations() {
      const res = await fetch('/api/get-locations');
<<<<<<< HEAD
      const data = await res.json();
      setLocations(
      data.sort((a, b) => a.name.localeCompare(b.name))
);

=======
      const data: Location[] = await res.json();
      const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
      setLocations(sorted);
>>>>>>> feature/tailwind-migration
    }

    fetchLocations();
  }, []);

  return (
    <div className="mt-4">
      {!hideLegend && <label className="block mb-2 font-semibold">Select a location</label>}
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2"
      >
        <option value="">-- Please choose an option --</option>
        {locations.map((loc) => (
          <option key={loc.id} value={loc.id}>
            {loc.name}
          </option>
        ))}
      </select>
    </div>
  );
}
