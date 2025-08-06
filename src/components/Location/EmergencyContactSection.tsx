'use client';

import Link from 'next/link';
import { trackEmergencyContact } from '@/components/analytics/GoogleAnalytics';

interface EmergencyContactSectionProps {
  locationName: string;
  locationSlug: string;
}

export default function EmergencyContactSection({ locationName, locationSlug }: EmergencyContactSectionProps) {
  return (
    <section className="bg-brand-i py-12">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-black">Help someone sleeping rough</h2>
        <p className="mb-3 text-black">
          If you are worried about someone you&apos;ve seen sleeping rough anywhere in {locationName}, you can inform{' '}
          <a 
            href="https://thestreetlink.org.uk" 
            onClick={() => trackEmergencyContact('streetlink', `location_page_${locationSlug}`)}
            className="text-brand-a hover:text-brand-b underline font-semibold"
          >
            StreetLink
          </a>.
        </p>
        <p className="mb-6 text-black">
          If the person is in immediate danger or needs urgent care, please call{' '}
          <a 
            href="tel:999" 
            onClick={() => trackEmergencyContact('999', `location_page_${locationSlug}`)}
            className="text-red-600 hover:text-red-700 underline font-semibold"
          >
            999
          </a>.
        </p>
        <Link
          href={`/${locationSlug}/advice`}
          className="inline-flex items-center justify-center px-8 py-3 bg-brand-a text-white font-semibold rounded-md hover:bg-brand-b active:bg-brand-c transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-offset-2"
        >
          See more emergency advice
        </Link>
      </div>
    </section>
  );
}