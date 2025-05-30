'use client';

import React from 'react';
import clsx from 'clsx';

interface LocationSelectorProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  showButton?: boolean;
  buttonLabel?: string;
  className?: string;
}

export default function LocationSelector({
  label = 'Choose your location',
  options,
  value,
  onChange,
  onSubmit,
  showButton = false,
  buttonLabel = 'Go',
  className,
}: LocationSelectorProps) {
  return (
    <div className={clsx('my-5 text-center print:hidden', className)}>
      <label className="block pb-2 text-base sm:inline-block sm:pb-0 sm:pt-2 sm:mr-4">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block mx-auto mb-2 px-4 py-2 border border-brand-k rounded-md sm:inline-block sm:mb-0"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {showButton && (
        <button
          onClick={onSubmit}
          className="block w-full sm:inline-block sm:w-auto sm:ml-4 px-4 py-2 bg-brand-b text-white rounded-md"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
