'use client';

import React from 'react';
import clsx from 'clsx';

interface CtaSectionProps {
  children: React.ReactNode;
  isSplit?: boolean;
  lastOfThree?: boolean;
  className?: string;
}

export default function CtaSection({
  children,
  isSplit = false,
  lastOfThree = false,
  className,
}: CtaSectionProps) {
  return (
    <div
      className={clsx(
        'flex flex-wrap justify-center gap-4',
        'sm:justify-start sm:gap-6',
        isSplit ? 'sm:grid sm:grid-cols-2' : '',
        className
      )}
    >
      {React.Children.map(children, (child, index) => (
        <div
          className={clsx(
            'w-full sm:w-[48%] lg:w-[32%] mb-5',
            lastOfThree && index === 2 && 'sm:ml-0'
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
