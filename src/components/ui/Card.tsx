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
        'card text-center mb-5 print:shadow-none',
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
