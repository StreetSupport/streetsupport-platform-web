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
        <div className="flex flex-wrap gap-2">
          {organisation.isVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified
            </span>
          )}
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
      </div>

      {organisation.shortDescription && (
        <MarkdownContent content={organisation.shortDescription} className="text-lg mb-2" />
      )}

      {organisation.description && (
        <MarkdownContent content={organisation.description} />
      )}

      {/* Verification warning for unverified organizations */}
      {!organisation.isVerified && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-800 mb-1">
                Information not yet verified
              </h3>
              <p className="text-sm text-amber-700">
                This organisation hasn&apos;t yet confirmed this information, so please contact them before attending. 
                If this information is out of date, let us know at{' '}
                <a 
                  href="mailto:admin@streetsupport.net" 
                  className="font-medium underline hover:text-amber-800"
                >
                  admin@streetsupport.net
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
