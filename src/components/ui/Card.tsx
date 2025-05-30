'use client';

import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  fatBottom?: boolean;
}

export default function Card({ children, className, fatBottom = false }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-[7px] mb-5 text-center border border-gray-200 shadow-sm print:shadow-none',
        className
      )}
    >
      <div
        className={clsx(
          'relative p-5',
          fatBottom ? 'h-[226px]' : '',
        )}
      >
        {children}
      </div>
    </div>
  );
}
