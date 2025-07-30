'use client';

import { useState, useEffect } from 'react';

interface LocationStatisticsProps {
  locationSlug: string;
  locationName: string;
}

interface StatsData {
  organisations: number;
  services: number;
  location: string;
}

export default function LocationStatistics({ locationSlug, locationName }: LocationStatisticsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/locations/${locationSlug}/stats`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          setStats(data.data);
        } else {
          throw new Error(data.message || 'Failed to load statistics');
        }
      } catch (err) {
        console.error('Error fetching location stats:', err);
        setError('Unable to load statistics at this time');
      } finally {
        setLoading(false);
      }
    };

    if (locationSlug) {
      fetchStats();
    }
  }, [locationSlug]);

  if (loading) {
    return (
      <div className="bg-brand-q p-8 text-center h-full flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-4">Impact Statistics</h2>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-a"></div>
          <span className="ml-2 text-brand-f">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-brand-q p-8 text-center h-full flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-4">Impact Statistics</h2>
        <p className="text-brand-f">{error || 'Statistics unavailable'}</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-q p-8 text-center h-full flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-6">Impact in {locationName}</h2>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-3xl font-bold text-brand-a mb-2">
            {stats.organisations}
          </div>
          <div className="text-sm font-medium text-brand-l">
            Active Organisation{stats.organisations !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-brand-f mt-1">
            Providing support in {locationName}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-3xl font-bold text-brand-b mb-2">
            {stats.services}
          </div>
          <div className="text-sm font-medium text-brand-l">
            Support Service{stats.services !== 1 ? 's' : ''}
          </div>
          <div className="text-xs text-brand-f mt-1">
            Available to help
          </div>
        </div>
      </div>

    </div>
  );
}