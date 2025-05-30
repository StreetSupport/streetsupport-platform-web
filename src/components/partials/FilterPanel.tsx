'use client';

import React from 'react';
import clsx from 'clsx';

interface FilterItem {
  label: string;
  value: string;
  active?: boolean;
}

interface FilterPanelProps {
  title?: string;
  situationLabel?: string;
  items: FilterItem[];
  onSelect: (value: string) => void;
  className?: string;
}

export default function FilterPanel({
  title,
  situationLabel,
  items,
  onSelect,
  className,
}: FilterPanelProps) {
  return (
    <div className={clsx('mb-5', className)}>
      {title && (
        <h2
          className="text-xl font-headline mb-3 pl-6 bg-no-repeat"
          style={{ backgroundImage: 'url("/assets/img/filter-icon.png")' }}
        >
          {title}
        </h2>
      )}

      {situationLabel && (
        <label className="block text-lg font-bold mb-2 sm:mb-0 sm:mt-0 sm:inline-block sm:text-xl">
          {situationLabel}
        </label>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {items.map(({ label, value, active }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={clsx(
              'px-3 py-1 rounded-md text-brand-b transition-colors',
              'hover:text-brand-k',
              active && 'bg-brand-r text-white font-bold'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
