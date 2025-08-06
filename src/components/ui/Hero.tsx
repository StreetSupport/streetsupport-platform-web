'use client';

import React from 'react';
import Link from 'next/link';
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
  const heroStyle = {
    backgroundImage: `url(${backgroundImage})`
  };

  // Generate location-specific CSS class
  const locationClass = locationSlug ? `hero-location-${locationSlug}` : '';
  
  // Base overlay classes with optional location-specific class
  const overlayClasses = [
    'absolute', 
    'inset-0', 
    'z-5',
    'hero-location-overlay',
    locationClass
  ].filter(Boolean).join(' ');

  const overlayImageStyle = overlayImage ? {
    backgroundImage: `url(${overlayImage})`
  } : {};

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
    <section 
      className={`hero-section ${className}`}
      style={heroStyle}
    >
      {overlayImage && (
        <div 
          className={overlayClasses}
          style={overlayImageStyle}
        />
      )}
      {overlayImage && isCoastal && (
        <div 
          className="absolute z-6"
          style={seaTileStyle}
        />
      )}
      <div className="hero-overlay" />
      <div className={contentClasses}>
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