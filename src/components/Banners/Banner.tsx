'use client';

import React from 'react';
import Image from 'next/image';
import { BannerProps } from '@/types/banners';
import {
  generateBackgroundClasses,
  generateBackgroundStyles,
  generateTextColourClasses,
  generateCTAClasses
} from '@/utils/bannerUtils';
import { sanitiseBannerDescription } from '@/utils/sanitiseHtml';

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  return null;
}

const Banner: React.FC<BannerProps> = ({
  title,
  description,
  subtitle,
  mediaType,
  image,
  youtubeUrl,
  logo,
  ctaButtons,
  background,
  textColour,
  layoutStyle,
  id,
  className = ''
}) => {
  const backgroundClasses = generateBackgroundClasses(background);
  const backgroundStyles = generateBackgroundStyles(background);
  const textClasses = generateTextColourClasses(textColour);

  const renderMedia = () => {
    if (mediaType === 'youtube' && youtubeUrl) {
      const embedUrl = getYouTubeEmbedUrl(youtubeUrl);
      if (!embedUrl) return null;

      return (
        <div className="aspect-video w-full max-w-2xl mx-auto">
          <iframe
            src={embedUrl}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        </div>
      );
    }

    if (mediaType === 'image' && image) {
      return (
        <div className="relative w-full max-w-2xl mx-auto">
          <Image
            src={image.url}
            alt={image.alt || title}
            width={image.width || 800}
            height={image.height || 450}
            className="rounded-lg object-cover w-full h-auto"
            priority
          />
        </div>
      );
    }

    return null;
  };

  const renderCTAs = () => {
    if (!ctaButtons || ctaButtons.length === 0) return null;

    const justifyClass = layoutStyle === 'full-width' ? 'justify-center' : '';

    return (
      <div className={`flex flex-wrap gap-4 mt-6 ${justifyClass}`}>
        {ctaButtons.map((cta, index) => (
          <a
            key={`${id}-cta-${index}`}
            href={cta.url}
            target={cta.external ? '_blank' : undefined}
            rel={cta.external ? 'noopener noreferrer' : undefined}
            className={generateCTAClasses(cta, textColour)}
          >
            {cta.label}
            {cta.external && (
              <svg className="ml-2 w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            )}
          </a>
        ))}
      </div>
    );
  };

  const needsOverlay = background.type === 'image' && textColour === 'white';

  return (
    <section
      role="banner"
      aria-labelledby={`banner-title-${id}`}
      className={`${backgroundClasses} ${textClasses} ${className} ${needsOverlay ? 'relative' : ''}`}
      style={backgroundStyles}
    >
      {needsOverlay && (
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      )}
      <div className={`page-container py-12 md:py-16 ${needsOverlay ? 'relative z-10' : ''}`}>
        {layoutStyle === 'split' ? (
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {logo && (
                <Image
                  src={logo.url}
                  alt={logo.alt || ''}
                  width={logo.width || 150}
                  height={logo.height || 50}
                  className="h-12 w-auto"
                />
              )}
              {subtitle && (
                <p className="text-sm uppercase tracking-wide opacity-80">{subtitle}</p>
              )}
              <h1 id={`banner-title-${id}`} className="text-3xl md:text-4xl font-bold">
                {title}
              </h1>
              {description && (
                <div
                  className="text-lg opacity-90 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitiseBannerDescription(description) }}
                />
              )}
              {renderCTAs()}
            </div>

            <div className="flex justify-center">
              {renderMedia()}
            </div>
          </div>
        ) : (
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {logo && (
              <Image
                src={logo.url}
                alt={logo.alt || ''}
                width={logo.width || 150}
                height={logo.height || 50}
                className="h-12 w-auto mx-auto"
              />
            )}
            {subtitle && (
              <p className="text-sm uppercase tracking-wide opacity-80">{subtitle}</p>
            )}
            <h1 id={`banner-title-${id}`} className="text-3xl md:text-5xl font-bold">
              {title}
            </h1>
            {description && (
              <div
                className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto prose prose-lg"
                dangerouslySetInnerHTML={{ __html: sanitiseBannerDescription(description) }}
              />
            )}
            {renderMedia()}
            {renderCTAs()}
          </div>
        )}
      </div>
    </section>
  );
};

export default Banner;
