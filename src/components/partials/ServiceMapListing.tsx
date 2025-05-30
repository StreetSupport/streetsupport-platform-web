'use client';

import React, { useState } from 'react';
import clsx from 'clsx';

interface ServiceMapListingProps {
  map: React.ReactNode;
  listings: { id: string; title: string; content: React.ReactNode }[];
  className?: string;
}

export default function ServiceMapListing({
  map,
  listings,
  className,
}: ServiceMapListingProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className={clsx('mt-[70px] clear-both', className)}>
      <div className="w-full h-[66vh] mb-5">{map}</div>

      <div className="mb-8 space-y-4">
        {listings.map(({ id, title, content }) => (
          <div key={id}>
            <h2
              className="cursor-pointer text-brand-b font-headline text-lg mb-1"
              onClick={() => setActiveId(activeId === id ? null : id)}
            >
              {title}
            </h2>

            <div className={clsx(activeId === id ? 'block' : 'hidden')}>
              {content}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[30px] sm:hidden">
        {/* Dropdown replacement for listing filter (shown only on small screens) */}
      </div>

      <div className="hidden sm:block">
        {/* Filter buttons shown only on medium+ screens */}
      </div>
    </div>
  );
}
