'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { trackFindHelpCTA } from '@/components/analytics/GoogleAnalytics';

interface HeroProps {
  backgroundImage: string;
  overlayImage?: string;
  locationSlug?: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

export default function Hero({ 
  backgroundImage, 
  overlayImage,
  locationSlug,
  title, 
  subtitle, 
  ctaText, 
  ctaLink, 
  className = '' 
}: HeroProps) {
  // No longer need inline style for background image

  // Generate location-specific CSS class (removed unused variables)

  // Check if this is a coastal location that needs sea-tile overlay
  const coastalLocations = ['brighton-and-hove', 'blackpool', 'bournemouth', 'portsmouth', 'southampton', 'edinburgh', 'glasgow'];
  const isCoastal = locationSlug && coastalLocations.includes(locationSlug);
  
  // Sea-tile overlay styles (separate from location image)
  const seaTileStyle = {
    backgroundImage: `url('/assets/img/locations/sea-tile.png')`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: 'auto 100%',
    backgroundPosition: 'left bottom',
    height: '25%',
    width: '100%',
    bottom: '0',
    left: '0'
  };

  // Determine if this is homepage (no location overlay image)
  const isHomepage = !overlayImage;
  const contentClasses = isHomepage ? 'hero-content hero-content-homepage' : 'hero-content';

  return (
    <section className={`hero-section relative ${className}`}>
      {/* Optimized background image using next/image */}
      <Image
        src={backgroundImage}
        alt={`${title} background`}
        fill
        priority
        className="object-cover"
        sizes="100vw"
        quality={85}
      />
      
      {overlayImage && (
        <>
          {/* Dark grey strip at bottom to fill gaps in layered images */}
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-gray-700 z-[5]" />
          <div className="absolute inset-0 z-10">
            <Image
              src={overlayImage}
              alt={`${title} overlay`}
              fill
              className="object-contain object-bottom"
              sizes="100vw"
              quality={75}
            />
          </div>
        </>
      )}
      
      {overlayImage && isCoastal && (
        <div 
          className="absolute z-20"
          style={seaTileStyle}
        />
      )}
      
      <div className="hero-overlay z-30" />
      <div className={`${contentClasses} relative z-40`}>
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        {ctaText && ctaLink && (
          <Link 
            href={ctaLink} 
            onClick={() => trackFindHelpCTA(locationSlug || 'homepage', 'hero_banner')}
            className="hero-cta"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}