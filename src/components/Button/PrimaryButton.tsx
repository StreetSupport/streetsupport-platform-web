'use client';

import React from 'react';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: 'default' | 'cta';
};

export default function PrimaryButton({ children, href, className, variant = 'default' }: Props) {
  const baseClasses = clsx(
    'inline-block text-center rounded font-headline font-bold',
    variant === 'cta'
      ? 'text-xl px-8 py-5'
      : 'text-base px-6 py-4',
    'bg-brand-d text-white leading-[1.5] shadow-md hover:opacity-90 transition',
    className
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        <span className="block">{children}</span>
      </a>
    );
  }

  return (
    <button className={baseClasses}>
      <span className="block">{children}</span>
    </button>
  );
}
