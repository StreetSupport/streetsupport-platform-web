'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearchNavigation } from '@/contexts/SearchNavigationContext';
import type { OrganisationDetails } from '@/utils/organisation';
import { decodeText } from '@/utils/htmlDecode';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationOverview({ organisation }: Props) {
  const router = useRouter();
  const { hasSearchState, searchState } = useSearchNavigation();
  
  const decodedName = decodeText(organisation.name);
  const decodedDescription = decodeText(organisation.description || '');

  const handleBackToResults = () => {
    if (hasSearchState && searchState) {
      // Build the URL with preserved search parameters
      const params = new URLSearchParams(searchState.searchParams);
      const url = `/find-help${params.toString() ? `?${params.toString()}` : ''}`;
      router.push(url);
    } else {
      // Fallback to generic find-help page
      router.push('/find-help');
    }
  };

  return (
    <section className="mb-6">
      {hasSearchState && (
        <div className="mb-4">
          <button
            onClick={handleBackToResults}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="Back to search results"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to search results
          </button>
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-2">{decodedName}</h1>

      {organisation.shortDescription && (
        <p className="text-lg mb-2">{decodeText(organisation.shortDescription)}</p>
      )}

      {decodedDescription && (
        <p className="text-gray-700 whitespace-pre-line">{decodedDescription}</p>
      )}
    </section>
  );
}
