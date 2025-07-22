'use client';

import React, { useState, useEffect } from 'react';
import Accordion from '@/components/ui/Accordion';
import MarkdownContent from '@/components/ui/MarkdownContent';
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
        console.error('Error fetching FAQs:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [locationKey]);

  const handleToggleAccordion = (faqId: string) => {
    setOpenAccordion(openAccordion === faqId ? null : faqId);
  };

  if (loading) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" role="status" aria-label="Loading"></div>
          <span className="ml-2 text-gray-600">Loading advice...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading advice</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-2">No advice available for {locationName} at the moment.</p>
          <p className="text-sm text-gray-500">Please check back later or contact us if you have specific questions.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-4">
        {faqs.map((faq) => (
          <Accordion
            key={faq._id}
            title={decodeText(faq.title)}
            isOpen={openAccordion === faq._id}
            onToggle={() => handleToggleAccordion(faq._id)}
            className="mb-4"
          >
            <MarkdownContent content={faq.body} />
          </Accordion>
        ))}
      </div>
    </section>
  );
}