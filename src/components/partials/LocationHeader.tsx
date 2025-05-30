'use client';

import React from 'react';
import clsx from 'clsx';

interface LocationHeaderProps {
  backgroundImageUrl?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function LocationHeader({
  backgroundImageUrl = '/assets/img/locations/sea-tile.png',
  children,
  className,
}: LocationHeaderProps) {
  return (
    <header
      className={clsx(
        'relative flex items-center justify-center overflow-hidden bg-no-repeat bg-bottom bg-cover',
        'min-h-[250px] sm:min-h-[300px] md:min-h-[350px]',
        className
      )}
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: '940px',
      }}
    >
      <div className="relative z-10 text-center px-4">
        {children}
      </div>

      <div
        className={clsx(
          'absolute bottom-0 left-1/2 -translate-x-1/2 hidden md:block',
        )}
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: '600px',
          width: '600px',
          height: '250px',
        }}
      />
    </header>
  );
}
