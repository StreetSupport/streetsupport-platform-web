'use client';

import { useState, useEffect } from 'react';

interface RegionalStatisticsProps {
  locationSlugs: string[];
  regionName: string;
}

interface StatsData {
  organisations: number;
  services: number;
}

export default function RegionalStatistics({ locationSlugs, regionName }: RegionalStatisticsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegionalStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch aggregated stats for all locations in one request
        const response = await fetch(
          `/api/locations/regional-stats?locations=${locationSlugs.join(',')}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();

        if (data.status === 'success' && data.data) {
          setStats({
            organisations: data.data.organisations,
            services: data.data.services
          });
        } else {
          throw new Error(data.message || 'Failed to load statistics');
        }
      } catch (err) {
        console.error('Error fetching regional stats:', err);
        setError('Unable to load statistics at this time');
      } finally {
        setLoading(false);
      }
    };

    if (locationSlugs.length > 0) {
      fetchRegionalStats();
    }
  }, [locationSlugs]);

  if (loading) {
    return (
      <div className="bg-brand-q p-8 text-center h-full flex flex-col justify-center rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Regional Impact</h2>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-a"></div>
          <span className="ml-2 text-brand-f">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-brand-q p-8 text-center h-full flex flex-col justify-center rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Regional Impact</h2>
        <p className="text-brand-f">{error || 'Statistics unavailable'}</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-q p-8 text-center rounded-lg">
      <h2 className="text-xl font-semibold mb-6">Impact across {regionName}</h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <div className="bg-white rounded-lg p-6 shadow-sm flex-1">
          <div className="text-3xl font-bold text-brand-a mb-2">
            {stats.organisations.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-brand-l">
            Active Organisations
          </div>
          <div className="text-xs text-brand-f mt-1">
            Providing support across the region
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm flex-1">
          <div className="text-3xl font-bold text-brand-b mb-2">
            {stats.services.toLocaleString()}
          </div>
          <div className="text-sm font-medium text-brand-l">
            Support Services
          </div>
          <div className="text-xs text-brand-f mt-1">
            Available to help
          </div>
        </div>
      </div>
    </div>
  );
}
