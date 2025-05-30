'use client';

import React from 'react';
import clsx from 'clsx';

interface PartnerLogo {
  id: string;
  href?: string;
  imageUrl: string;
  alt?: string;
  variant?: 'default' | 'partners-page' | 'coalition-of-relief';
}

interface PartnerGridProps {
  logos: PartnerLogo[];
  className?: string;
}

export default function PartnerGrid({ logos, className }: PartnerGridProps) {
  return (
    <div className={clsx('text-center', className)}>
      <ul className="flex flex-wrap justify-center list-none my-[50px] mx-0 px-0 sm:mt-5">
        {logos.map(({ id, href, imageUrl, alt, variant }) => (
          <li
            key={id}
            className={clsx(
              'relative overflow-hidden mx-[10px] mb-4',
              variant === 'coalition-of-relief' ? 'w-[57px] h-[57px]' : 'w-[120px] h-[120px]',
              variant === 'partners-page' && 'mx-auto mb-5 sm:float-left sm:mx-5'
            )}
          >
            {href ? (
              <a
                href={href}
                className="block w-full h-full absolute top-1/2 left-0 -translate-y-1/2 bg-no-repeat bg-center bg-contain hover:opacity-80"
                style={{ backgroundImage: `url(${imageUrl})` }}
                aria-label={alt || ''}
              />
            ) : (
              <div
                className="w-full h-full absolute top-1/2 left-0 -translate-y-1/2 bg-no-repeat bg-center bg-contain"
                style={{ backgroundImage: `url(${imageUrl})` }}
                role="img"
                aria-label={alt || ''}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
