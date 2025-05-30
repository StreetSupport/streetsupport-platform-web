'use client';

import React from 'react';
import clsx from 'clsx';

interface CardGridProps {
  children: React.ReactNode;
  singleColumn?: boolean;
  className?: string;
}

export default function CardGrid({ children, singleColumn = false, className }: CardGridProps) {
  return (
    <div
      className={clsx(
        'mb-2 grid gap-4 print:block print:w-full print:float-none print:mr-0',
        singleColumn
          ? 'grid-cols-1 max-w-screen-md mx-auto'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  );
}
