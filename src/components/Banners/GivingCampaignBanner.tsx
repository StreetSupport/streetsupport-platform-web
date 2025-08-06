'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GivingCampaignProps } from '@/types/banners';
import {
  generateBackgroundClasses,
  generateBackgroundStyles,
  generateTextColourClasses,
  generateLayoutClasses,
  generateCTAClasses,
  generateAccentGraphicClasses,
  generateUrgencyClasses,
  formatCurrency,
  calculateProgress
} from '@/utils/bannerUtils';

interface GivingCampaignBannerProps extends GivingCampaignProps {
  className?: string;
}

const GivingCampaignBanner: React.FC<GivingCampaignBannerProps> = ({
  title,
  description,
  subtitle,
  logo,
  image,
  video,
  ctaButtons,
  background,
  textColour,
  layoutStyle,
  accentGraphic,
  showDates,
  startDate,
  endDate,
  badgeText,
  donationGoal,
  urgencyLevel,
  campaignEndDate,
  trackingContext = 'giving-campaign',
  className = ''
}) => {
  const backgroundClasses = generateBackgroundClasses(background);
  const backgroundStyles = generateBackgroundStyles(background);
  const textColourClasses = generateTextColourClasses(textColour);
  const layoutClasses = generateLayoutClasses(layoutStyle);

  const progress = donationGoal ? calculateProgress(donationGoal.current, donationGoal.target) : 0;

  const handleCTAClick = (button: typeof ctaButtons[0], index: number) => {
    // Analytics tracking would be implemented here
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'giving_campaign_cta_click', {
        campaign_title: title,
        button_label: button.label,
        button_position: index + 1,
        tracking_context: button.trackingContext || trackingContext
      });
    }
  };

  return (
    <section 
      className={`
        relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8
        ${backgroundClasses}
        ${textColourClasses}
        ${className}
      `}
      style={backgroundStyles}
      role="banner"
      aria-labelledby="giving-campaign-title"
    >
      {/* Background overlay */}
      {background.overlay && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: background.overlay.colour,
            opacity: background.overlay.opacity
          }}
          aria-hidden="true"
        />
      )}

      {/* Accent graphic */}
      {accentGraphic && (
        <div className={generateAccentGraphicClasses(accentGraphic.position)}>
          <Image
            src={accentGraphic.url}
            alt={accentGraphic.alt}
            width={100}
            height={100}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            style={{ opacity: accentGraphic.opacity || 0.6 }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className={layoutClasses}>
          {/* Content Section */}
          <div className={layoutStyle === 'split' ? 'order-2 md:order-1' : ''}>
            {/* Badge and urgency indicator */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {badgeText && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                  {badgeText}
                </span>
              )}
              {urgencyLevel && urgencyLevel !== 'low' && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${generateUrgencyClasses(urgencyLevel)}`}>
                  {urgencyLevel === 'critical' && '🚨 Critical'}
                  {urgencyLevel === 'high' && '⚡ Urgent'}
                  {urgencyLevel === 'medium' && '📢 Important'}
                </span>
              )}
            </div>

            {/* Logo */}
            {logo && (
              <div className="mb-6">
                <Image
                  src={logo.url}
                  alt={logo.alt}
                  width={logo.width || 200}
                  height={logo.height || 60}
                  className="h-12 sm:h-16 w-auto object-contain"
                />
              </div>
            )}

            {/* Title */}
            <h1 
              id="giving-campaign-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            >
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 opacity-90">
                {subtitle}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p className="text-lg sm:text-xl mb-6 opacity-80 leading-relaxed max-w-2xl">
                {description}
              </p>
            )}

            {/* Donation Goal Progress */}
            {donationGoal && (
              <div className="mb-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">
                    {formatCurrency(donationGoal.current, donationGoal.currency)} raised
                  </span>
                  <span className="opacity-80">
                    of {formatCurrency(donationGoal.target, donationGoal.currency)} goal
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                  <div 
                    className="bg-white h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${progress}% of donation goal reached`}
                  />
                </div>
                <p className="text-sm opacity-70">
                  {progress}% funded • {100 - progress}% to go
                </p>
              </div>
            )}

            {/* Campaign End Date */}
            {campaignEndDate && (
              <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <p className="font-semibold mb-1">Campaign ends:</p>
                <p className="text-lg">
                  {new Date(campaignEndDate).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            {/* Date range */}
            {showDates && (startDate || endDate) && (
              <div className="mb-6 text-sm opacity-70">
                {startDate && endDate && (
                  <p>
                    {new Date(startDate).toLocaleDateString('en-GB')} - {new Date(endDate).toLocaleDateString('en-GB')}
                  </p>
                )}
                {startDate && !endDate && (
                  <p>From {new Date(startDate).toLocaleDateString('en-GB')}</p>
                )}
                {!startDate && endDate && (
                  <p>Until {new Date(endDate).toLocaleDateString('en-GB')}</p>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {ctaButtons.map((button, index) => {
                const Component = button.external ? 'a' : Link;
                const linkProps = button.external 
                  ? { 
                      href: button.url,
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    }
                  : { href: button.url };

                return (
                  <Component
                    key={index}
                    {...linkProps}
                    className={generateCTAClasses(button, textColour)}
                    onClick={() => handleCTAClick(button, index)}
                    aria-describedby={index === 0 ? 'giving-campaign-title' : undefined}
                  >
                    {button.label}
                    {button.external && (
                      <svg 
                        className="ml-2 w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                        />
                      </svg>
                    )}
                  </Component>
                );
              })}
            </div>
          </div>

          {/* Media Section */}
          {(image || video) && layoutStyle === 'split' && (
            <div className="order-1 md:order-2">
              {video ? (
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <video
                    src={video.url}
                    poster={video.poster}
                    controls
                    className="w-full h-auto"
                    aria-label={video.title}
                  >
                    {video.captions && (
                      <track
                        kind="captions"
                        src={video.captions}
                        srcLang="en"
                        label="English captions"
                      />
                    )}
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : image && (
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={image.width || 600}
                    height={image.height || 400}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          )}

          {/* Full-width media */}
          {(image || video) && layoutStyle === 'full-width' && (
            <div className="mt-8 max-w-4xl mx-auto">
              {video ? (
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <video
                    src={video.url}
                    poster={video.poster}
                    controls
                    className="w-full h-auto"
                    aria-label={video.title}
                  >
                    {video.captions && (
                      <track
                        kind="captions"
                        src={video.captions}
                        srcLang="en"
                        label="English captions"
                      />
                    )}
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : image && (
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={image.width || 800}
                    height={image.height || 400}
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GivingCampaignBanner;