'use client';

import React, { lazy, Suspense } from 'react';

// Lazy load the MarkdownContent component
const MarkdownContent = lazy(() => import('./MarkdownContent'));

interface LazyMarkdownContentProps {
  content: string;
  className?: string;
}

export default function LazyMarkdownContent({ content, className = '' }: LazyMarkdownContentProps) {
  return (
    <Suspense 
      fallback={
        <div className={`animate-pulse bg-gray-100 rounded h-4 ${className}`} />
      }
    >
      <MarkdownContent content={content} className={className} />
    </Suspense>
  );
}