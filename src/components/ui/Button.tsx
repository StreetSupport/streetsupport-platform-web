'use client';

import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  text: string;
  overlay?: React.ReactNode;
  variant?: VariantName;
  className?: string;
}

type VariantName =
  | 'cosy'
  | 'always-full'
  | 'small'
  | 'in-copy'
  | 'emergency-advice'
  | 'just-giving'
  | 'brand-d'
  | 'brand-e'
  | 'brand-g'
  | 'brand-h'
  | 'gmmc-blue'
  | 'west-mids-locations'
  | 'brand-scg'
  | 'big-change'
  | 'change-liverpool'
  | 'plain'
  | 'full'
  | 'full-inline'
  | 'short'
  | 'print'
  | 'centred'
  | 'inline-fill'
  | 'togglable';

const variantClassMap: Record<VariantName, string> = {
  cosy: 'text-sm px-3 py-1',
  'always-full': 'w-full',
  small: 'text-sm py-1 px-2',
  'in-copy': 'underline text-brand-b',
  'emergency-advice': 'bg-brand-g text-white',
  'just-giving': 'bg-pink-600 text-white',
  'brand-d': 'bg-brand-d text-white',
  'brand-e': 'bg-brand-e text-black',
  'brand-g': 'bg-brand-g text-white',
  'brand-h': 'bg-brand-h text-white',
  'gmmc-blue': 'bg-[#0776BD] text-white',
  'west-mids-locations': 'bg-[#1A4D8F] text-white',
  'brand-scg': 'bg-[#0C8E56] text-white',
  'big-change': 'bg-[#F7941E] text-white',
  'change-liverpool': 'bg-[#00B6ED] text-white',
  plain: 'bg-transparent text-brand-b underline',
  full: 'block w-full',
  'full-inline': 'inline-block w-full',
  short: 'max-w-xs',
  print: 'print:block hidden',
  centred: 'mx-auto text-center',
  'inline-fill': 'inline-block bg-brand-b text-white',
  togglable: 'bg-brand-d hover:bg-brand-e transition-colors',
};

export default function Button({
  icon,
  text,
  overlay,
  variant,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-block text-center mb-5 mt-5 outline-none p-0 appearance-none bg-none border-0 relative',
        variant ? variantClassMap[variant] : '',
        className
      )}
    >
      {icon && (
        <div className="w-full block bg-gradient-to-b from-[#ADE1F9] to-white rounded-t-[10px]">
          {icon}
        </div>
      )}

      <span className="block px-5 py-[15px] rounded-[10px] mb-[3px] transition-all font-headline font-medium">
        {text}
      </span>

      {overlay && (
        <div className="absolute top-0 left-0 h-full w-full">
          {overlay}
        </div>
      )}
    </button>
  );
}
