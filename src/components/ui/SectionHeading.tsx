'use client';

import React from 'react';
import clsx from 'clsx';

interface SectionHeadingProps {
  title: string;
  button?: React.ReactNode;
  className?: string;
}

export default function SectionHeading({
  title,
  button,
  className,
}: SectionHeadingProps) {
  return (
    <div className={clsx('text-center mb-4', className)}>
      <h2 className="heading-3 inline-block pt-5 mb-0 mr-2 sm:mb-5">
        {title}
      </h2>
      {button && <span className="inline-block align-middle">{button}</span>}
    </div>
  );
}
