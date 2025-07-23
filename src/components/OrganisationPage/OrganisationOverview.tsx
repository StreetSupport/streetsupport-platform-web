'use client';
import React from 'react';
import MarkdownContent from '@/components/ui/MarkdownContent';
import type { OrganisationDetails } from '@/utils/organisation';
import { decodeText } from '@/utils/htmlDecode';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationOverview({ organisation }: Props) {
  
  const decodedName = decodeText(organisation.name);

  // Check if organization is a registered charity
  // Handle cases where tags might be string, array, or undefined
  const isCharity = (() => {
    // First check if there's a RegisteredCharity field (more reliable)
    if (organisation.RegisteredCharity !== undefined && organisation.RegisteredCharity !== null) {
      const isRegisteredCharity = organisation.RegisteredCharity !== 0;
      if (isRegisteredCharity) return true;
    }
    
    // Fallback to tags check with proper type checking
    if (Array.isArray(organisation.tags)) {
      const hasCharityTag = organisation.tags.some(tag => 
        tag.toLowerCase().includes('charity') || 
        tag.toLowerCase().includes('registered charity')
      );
      if (hasCharityTag) return true;
    }
    
    // If tags is a string, check if it contains charity
    if (typeof organisation.tags === 'string' && organisation.tags.length > 0) {
      const hasCharityInString = organisation.tags.toLowerCase().includes('charity');
      if (hasCharityInString) return true;
    }
    
    // Check if organisation name contains charity
    const nameContainsCharity = organisation.name.toLowerCase().includes('charity');
    
    return nameContainsCharity;
  })();


  return (
    <section className="mb-6">
      
      <div className="flex items-start gap-3 mb-2">
        <h1 className="text-2xl font-bold">{decodedName}</h1>
        {isCharity && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
            <svg
              className="w-3 h-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            Registered Charity
          </span>
        )}
      </div>

      {organisation.shortDescription && (
        <MarkdownContent content={organisation.shortDescription} className="text-lg mb-2" />
      )}

      {organisation.description && (
        <MarkdownContent content={organisation.description} />
      )}
    </section>
  );
}
