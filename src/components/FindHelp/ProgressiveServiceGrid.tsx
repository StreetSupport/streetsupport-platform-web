'use client';

import React, { useState, useEffect, useRef } from 'react';
import ServiceCard from './ServiceCard';
import GroupedServiceCard from './GroupedServiceCard';
import type { ServiceWithDistance } from '@/types';

interface ServiceGroup {
  orgId: string;
  orgName: string;
  orgSlug: string;
  isVerified: boolean;
  orgDescription?: string;
  services: ServiceWithDistance[];
  categories: string[];
  subcategories: string[];
  distance: number;
}

interface ProgressiveServiceGridProps {
  groups: ServiceGroup[];
  showMap: boolean;
  openDescriptionId: string | null;
  onToggleDescription: (id: string) => void;
  batchSize?: number;
}

/**
 * Progressive loading component that renders service cards in batches
 * to improve performance with large result sets
 */
export default function ProgressiveServiceGrid({
  groups,
  showMap,
  openDescriptionId,
  onToggleDescription,
  batchSize = 50
}: ProgressiveServiceGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCardId, setLoadingCardId] = useState<string | null>(null);
  const itemsPerPage = batchSize;
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Calculate pagination values
  const totalPages = Math.ceil(groups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleGroups = groups.slice(startIndex, endIndex);
  
  // Reset page when groups change
  useEffect(() => {
    setCurrentPage(1);
    setLoadingCardId(null); // Clear loading state when groups change
  }, [groups]);
  
  // Scroll to top of results when page changes
  useEffect(() => {
    if (gridRef.current) {
      // Scroll to the grid container
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);
  
  // Generate page numbers to display
  // Handle card click to show loading state
  const handleCardClick = (cardId: string) => {
    setLoadingCardId(cardId);
    
    // Clear loading state after navigation (simulated delay)
    // In practice, this would be cleared when the new page loads
    setTimeout(() => {
      setLoadingCardId(null);
    }, 3000);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <>
      <div ref={gridRef} className={`gap-4 ${showMap ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {visibleGroups.map((group) => (
          <div
            key={group.orgId}
            className="border border-gray-300 rounded-md p-4 bg-white flex flex-col"
          >
            {group.services.length === 1 ? (
              <ServiceCard
                service={group.services[0]}
                isOpen={openDescriptionId === group.services[0].id}
                onToggle={() => onToggleDescription(group.services[0].id)}
                isLoading={loadingCardId === group.services[0].id}
                onCardClick={() => handleCardClick(group.services[0].id)}
              />
            ) : (
              <GroupedServiceCard
                group={group}
                isDescriptionOpen={openDescriptionId === group.orgId}
                onToggleDescription={() => onToggleDescription(group.orgId)}
                isLoading={loadingCardId === group.orgId}
                onCardClick={() => handleCardClick(group.orgId)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 py-4">
          {/* Previous button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn-base btn-tertiary btn-sm"
            aria-label="Previous page"
          >
            Previous
          </button>
          
          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(Number(page))}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    currentPage === page
                      ? 'bg-brand-a text-brand-q border-brand-a'
                      : 'border-brand-k hover:bg-brand-q'
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )
            ))}
          </div>
          
          {/* Next button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn-base btn-tertiary btn-sm"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
      
      {/* Page info */}
      {groups.length > 0 && (
        <div className="text-center text-sm text-gray-600 mt-2">
          Showing {startIndex + 1}-{Math.min(endIndex, groups.length)} of {groups.length} organisations
        </div>
      )}
    </>
  );
}