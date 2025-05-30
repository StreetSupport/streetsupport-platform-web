'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: 'default' | 'cta' | 'inline' | 'outline';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, href, variant = 'default', ...props }: ButtonProps) {
  const baseStyles = 'px-6 py-3 font-headline text-sm rounded-lg';
  const variants = {
    default: 'bg-brand-c text-white hover:bg-brand-b',
    cta: 'bg-brand-d text-black hover:bg-brand-e',
    inline: 'underline text-brand-c',
    outline: 'border border-brand-c text-brand-c hover:bg-brand-q',
  };

  const classes = clsx(baseStyles, variants[variant]);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
