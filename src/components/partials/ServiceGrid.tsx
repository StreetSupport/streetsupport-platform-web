'use client';

import React from 'react';
import clsx from 'clsx';

interface ServiceGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function ServiceGrid({ children, className }: ServiceGridProps) {
  return (
    <div className={clsx('pb-5 clearfix', className)}>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}
