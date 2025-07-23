'use client';

import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
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
  onNavigate: () => void;
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
  onNavigate,
  batchSize = 20
}: ProgressiveServiceGridProps) {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [sentinelRef, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Load more items when sentinel comes into view
  useEffect(() => {
    if (isIntersecting && visibleCount < groups.length) {
      setVisibleCount(prev => Math.min(prev + batchSize, groups.length));
    }
  }, [isIntersecting, visibleCount, groups.length, batchSize]);

  // Reset visible count when groups change
  useEffect(() => {
    setVisibleCount(batchSize);
  }, [groups, batchSize]);

  const visibleGroups = groups.slice(0, visibleCount);
  const hasMore = visibleCount < groups.length;

  return (
    <>
      <div className={`gap-4 ${showMap ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
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
                onNavigate={onNavigate}
              />
            ) : (
              <GroupedServiceCard
                group={group}
                isDescriptionOpen={openDescriptionId === group.orgId}
                onToggleDescription={() => onToggleDescription(group.orgId)}
                onNavigate={onNavigate}
              />
            )}
          </div>
        ))}
      </div>

      {/* Loading sentinel - triggers loading more items when visible */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-6"
        >
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          <span className="ml-2 text-gray-600 text-sm">
            Loading more services... ({visibleCount} of {groups.length})
          </span>
        </div>
      )}

      {/* Show completion message when all items are loaded */}
      {!hasMore && groups.length > batchSize && (
        <div className="text-center py-4 text-gray-500 text-sm">
          All {groups.length} services loaded
        </div>
      )}
    </>
  );
}