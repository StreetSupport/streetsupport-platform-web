'use client';

import React, { FormHTMLAttributes } from 'react';
import clsx from 'clsx';

type FormVariant = 'default' | 'partnership' | 'volunteer' | 'highlighted' | 'proximity';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  variant?: FormVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Form({
  variant = 'default',
  children,
  className,
  ...props
}: FormProps) {
  const base = 'mb-5';

  const variants: Record<FormVariant, string> = {
    default: '',
    partnership: 'mx-auto max-w-screen-md',
    volunteer: 'mx-auto max-w-screen-md',
    highlighted:
      'bg-white border border-brand-k rounded-md shadow p-5 pt-5 print:shadow-none',
    proximity:
      'bg-white p-5 my-6 print:hidden sm:w-full sm:max-w-[33%] sm:ml-auto',
  };

  return (
    <form className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </form>
  );
}
