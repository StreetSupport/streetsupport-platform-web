'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Accordion({ title, children, className }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={clsx(
        'mx-auto mb-5 max-w-[640px] rounded-[7px] shadow-md border border-gray-200',
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-full px-10 py-[15px] text-left text-white bg-brand-h rounded-t-[7px] flex justify-between items-center',
          isOpen ? 'border-b border-white' : ''
        )}
        aria-expanded={isOpen}
      >
        <span className="font-headline font-medium">{title}</span>
        <span className="ml-4">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-white text-black transition-all duration-300">
          {children}
        </div>
      )}
    </div>
  );
}
