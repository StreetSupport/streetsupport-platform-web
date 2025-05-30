'use client';

import React, { useState } from 'react';
import clsx from 'clsx';

interface SearchAdviceProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dropdown?: React.ReactNode;
  className?: string;
}

export default function SearchAdvice({
  value,
  onChange,
  placeholder = 'Search for advice...',
  dropdown,
  className,
}: SearchAdviceProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div id="search-wrapper" className={clsx('w-full relative', className)}>
      <div className="relative w-full pr-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-[45px] pr-5 py-[9px] text-[18px] rounded-full border border-brand-k outline-none bg-[url('/assets/img/search-icon.png')] bg-no-repeat bg-[18px_14px]"
        />
      </div>

      {isFocused && dropdown && (
        <div className="absolute top-full mt-2 w-full z-10 bg-white border border-brand-k shadow-md">
          {dropdown}
        </div>
      )}
    </div>
  );
}
