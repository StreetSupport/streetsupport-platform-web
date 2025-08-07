'use client';

import React from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Accordion({
  title,
  children,
  className = '',
  isOpen,
  onToggle,
}: AccordionProps) {
  return (
    <div className={`border border-brand-q rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full text-left px-6 py-4 transition-colors duration-200 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-inset bg-brand-i`}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-brand-k">{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 text-brand-a ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[9999px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-4 border-t border-brand-q bg-white shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
