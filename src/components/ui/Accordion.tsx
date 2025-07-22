'use client';

import React from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  isOpen: boolean; // ✅ NEW
  onToggle: () => void; // ✅ NEW
}

export default function Accordion({
  title,
  children,
  className = '',
  isOpen,
  onToggle,
}: AccordionProps) {
  return (
    <div className={`border border-gray-300 rounded ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center cursor-pointer"
      >
        <span className="font-medium">{title}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}
