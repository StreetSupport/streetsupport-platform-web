'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LocationData {
  name: string;
  slug: string;
  image: string;
}

interface LocationStats {
  services: number;
  organisations: number;
}

interface LocationCardsGridProps {
  locations: LocationData[];
  title?: string;
}

function LocationCard({ location }: { location: LocationData }) {
  const [stats, setStats] = useState<LocationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/locations/${location.slug}/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error(`Failed to fetch stats for ${location.slug}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [location.slug]);

  return (
    <Link
      href={`/${location.slug}`}
      className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 aspect-[3/2]"
    >
      {/* Background Image */}
      <Image
        src={location.image}
        alt={`${location.name} skyline`}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <h3 className="text-xl font-semibold text-white mb-1">
          {location.name}
        </h3>
        <p className="text-sm text-white/80">
          {isLoading ? (
            <span className="inline-block w-24 h-4 bg-white/20 rounded animate-pulse" />
          ) : stats ? (
            `${stats.services} services available`
          ) : (
            'View services'
          )}
        </p>
      </div>

      {/* Hover Arrow */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

export default function LocationCardsGrid({ locations, title }: LocationCardsGridProps) {
  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        {title && (
          <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {locations.map((location) => (
            <div key={location.slug} className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
              <LocationCard location={location} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
