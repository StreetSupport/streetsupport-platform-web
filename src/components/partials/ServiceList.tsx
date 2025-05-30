'use client';

import React from 'react';
import clsx from 'clsx';

interface ServiceListProps {
  children: React.ReactNode;
  className?: string;
}

export default function ServiceList({ children, className }: ServiceListProps) {
  return (
    <ul className={clsx('m-0 p-0 list-none', className)}>
      {React.Children.map(children, (child, i) => (
        <li key={i} className="clearfix mb-4">
          {child}
        </li>
      ))}
    </ul>
  );
}
