'use client';

import Link from 'next/link';
import React from 'react';

interface BreadcrumbItem {
  href?: string;
  label: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="bg-brand-n py-4">
      <div className="content-container px-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {items.map((item, index) => (
              <li key={index} className={index === 0 ? "inline-flex items-center" : ""}>
                <div className="flex items-center">
                  {index > 0 && <span className="mx-2 text-white">/</span>}
                  {item.href && !item.current ? (
                    <Link 
                      href={item.href} 
                      className="!text-brand-e hover:!text-brand-e !important"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span 
                      className="text-white"
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}