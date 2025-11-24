'use client';

import React, { useState, useEffect } from 'react';
import Accordion from '@/components/ui/Accordion';
import MarkdownContent from '@/components/ui/MarkdownContent';
import SocialShare from '@/components/ui/SocialShare';
import { decodeText } from '@/utils/htmlDecode';

interface FAQ {
  _id: string;
  locationKey: string;
  title: string;
  body: string;
  sortPosition: number;
  tags: string[];
}

interface AdvicePageClientProps {
  locationKey: string;
  locationName: string;
}

export default function AdvicePageClient({ locationKey, locationName }: AdvicePageClientProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/faqs?location=${locationKey}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs');
        }

        const result = await response.json();
        
        if (result.status === 'success') {
          // Sort FAQs with smallest sortPosition at the bottom (reverse order)
          const sortedFaqs = result.data.sort((a: FAQ, b: FAQ) => b.sortPosition - a.sortPosition);
          setFaqs(sortedFaqs);
        } else {
          throw new Error(result.message || 'Failed to fetch FAQs');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [locationKey]);

  const handleToggleAccordion = (faqId: string) => {
    // If clicking the same accordion, just close it
    if (openAccordion === faqId) {
      setOpenAccordion(null);
      return;
    }

    // If switching to a different accordion, show loading and then open
    if (openAccordion !== null && openAccordion !== faqId) {
      setLoadingContent(faqId);
      setTimeout(() => {
        setLoadingContent(null);
        setOpenAccordion(faqId);
      }, 300);
    } else {
      // If no accordion is open, open immediately
      setOpenAccordion(faqId);
    }
  };

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-a" role="status" aria-label="Loading"></div>
          <span className="ml-2 text-brand-f">Loading advice...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-brand-g" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-brand-g">Error loading advice</h3>
              <p className="mt-1 text-sm text-brand-k">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center py-12">
          <p className="text-brand-f mb-4 text-lg">No advice available for {locationName} at the moment.</p>
          <p className="text-brand-f">Please check back later or contact us if you have specific questions.</p>
        </div>
      </section>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="heading-3 text-brand-k mb-4">Frequently Asked Questions</h2>
          <p className="text-brand-f">
            Browse the questions below to find the information you need, or contact local services directly for personalised support.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Accordion
              key={faq._id}
              title={decodeText(faq.title)}
              isOpen={openAccordion === faq._id}
              onToggle={() => handleToggleAccordion(faq._id)}
              className={`shadow-sm transition-all duration-200 ${
                openAccordion === faq._id 
                  ? 'border-brand-a shadow-lg' 
                  : ''
              }`}
            >
              <div className="relative">
                {/* Loading spinner overlay */}
                {loadingContent === faq._id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded z-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-a"></div>
                  </div>
                )}
                
                {/* Content with opacity transition */}
                <div className={`prose max-w-none transition-opacity duration-200 ${
                  loadingContent === faq._id ? 'opacity-50' : 'opacity-100'
                }`}>
                  <MarkdownContent content={faq.body} />
                </div>
              </div>
            </Accordion>
          ))}
        </div>
        
        {/* Social Share */}
        <div className="mt-12 pt-8 border-t border-brand-q">
          <SocialShare 
            className="text-center"
            shareText={`Get advice and support for ${locationName}`}
          />
        </div>
      </div>
    </main>
  );
}