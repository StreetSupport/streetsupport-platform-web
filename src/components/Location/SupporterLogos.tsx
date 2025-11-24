'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Supporter, SupporterLogosProps } from '@/types/supporters';

/**
 * Component to display supporter/partner organisation logos for a specific location
 * Shows logos in a responsive grid with hover effects and proper accessibility
 */
const SupporterLogos: React.FC<SupporterLogosProps> = ({
  locationSlug,
  className = ''
}) => {
  const [supportersWithLogos, setSupportersWithLogos] = useState<(Supporter & { logoPath: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(`/api/locations/${locationSlug}/logos`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && Array.isArray(data.data)) {
            // Filter out supporters without logo files
            const logosWithPath = data.data.filter(
              (supporter: Supporter): supporter is Supporter & { logoPath: string } => 
                supporter.logoPath !== null
            );
            setSupportersWithLogos(logosWithPath);
          }
        }
      } catch (error) {
        console.error('Error fetching location logos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogos();
  }, [locationSlug]);

  // Don't render if no supporters with logos
  
  if (loading) {
    return null; // Or show a loading skeleton if preferred
  }
  
  if (supportersWithLogos.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Supported by&hellip;
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We work in partnership with these organisations to provide support and services in the local area.
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-center justify-items-center">
          {supportersWithLogos.map((supporter, index) => (
            <div
              key={`${supporter.name}-${index}`}
              className="group relative"
            >
              {supporter.url && supporter.url !== '#' ? (
                <Link
                  href={supporter.url}
                  {...(supporter.url.startsWith('http') && {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                  })}
                  className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-offset-2 rounded-lg"
                  aria-label={`Visit ${supporter.displayName} website`}
                >
                  <LogoImage supporter={supporter as Supporter & { logoPath: string }} />
                </Link>
              ) : (
                <div className="cursor-default">
                  <LogoImage supporter={supporter as Supporter & { logoPath: string }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional context for screen readers */}
        <div className="sr-only">
          <p>
            This section displays logos of {supportersWithLogos.length} organisations 
            that support our work in the local area.
          </p>
        </div>
      </div>
    </section>
  );
};

/**
 * Individual logo image component with consistent sizing and hover effects
 */
interface LogoImageProps {
  supporter: Supporter & { logoPath: string };
}

const LogoImage: React.FC<LogoImageProps> = ({ supporter }) => {
  return (
    <div className="relative w-full h-24 sm:h-28 md:h-32 flex items-center justify-center bg-slate-700 rounded-lg shadow-lg border-2 border-slate-600 p-4 transition-all duration-200 group-hover:shadow-xl group-hover:scale-105 group-hover:-translate-y-1 group-hover:bg-slate-600">
      <div className="relative w-full h-full flex items-center justify-center text-center">
        <Image
          src={supporter.logoPath}
          alt={supporter.displayName}
          width={200}
          height={120}
          className="object-contain max-w-full max-h-full filter grayscale group-hover:grayscale-0 transition-all duration-300 mx-auto"
          style={{
            maxWidth: '200px',
            maxHeight: '80px',
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 0 1px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
            display: 'block'
          }}
          loading="lazy"
          unoptimized={supporter.logoPath.endsWith('.svg')}
        />
      </div>
      
      {/* Tooltip-style label on hover */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {supporter.displayName}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default SupporterLogos;