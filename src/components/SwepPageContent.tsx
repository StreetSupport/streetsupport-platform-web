'use client';

import React, { useState, useEffect } from 'react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { SwepData } from '@/types';
import { formatSwepActivePeriod, parseSwepBody } from '@/utils/swep';

interface SwepPageContentProps {
  locationSlug: string;
  locationName: string;
}

export default function SwepPageContent({ locationSlug, locationName }: SwepPageContentProps) {
  const [swepData, setSwepData] = useState<SwepData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchSwepData() {
      try {
        const response = await fetch(`/api/locations/${locationSlug}/swep`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data.swep) {
          setSwepData(result.data.swep);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Failed to fetch SWEP data:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSwepData();
  }, [locationSlug]);

  if (loading) {
    return (
      <main>
        <Breadcrumbs 
          items={[
            { href: "/", label: "Home" },
            { href: `/${locationSlug}`, label: locationName },
            { label: "SWEP Information", current: true }
          ]} 
        />
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-6 text-center">
            Loading SWEP information...
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !swepData) {
    return (
      <main>
        <Breadcrumbs 
          items={[
            { href: "/", label: "Home" },
            { href: `/${locationSlug}`, label: locationName },
            { label: "SWEP Information", current: true }
          ]} 
        />
        <div className="py-12">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">SWEP Information Not Available</h1>
            <p>There is currently no SWEP information available for {locationName}.</p>
          </div>
        </div>
      </main>
    );
  }

  const activePeriodText = formatSwepActivePeriod(swepData);
  const parsedBody = parseSwepBody(swepData.body);

  return (
    <main>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: `/${locationSlug}`, label: locationName },
          { label: "SWEP Information", current: true }
        ]} 
      />

      {/* Header */}
      <div className="bg-red-50 border-b-4 border-brand-g py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-brand-g rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h1 className="text-3xl font-bold text-red-800 mb-0">
              {swepData.title}
            </h1>
          </div>
          <p className="text-lg text-red-700 mb-4">
            {activePeriodText}
          </p>
          <div className="bg-brand-g text-white px-4 py-2 rounded-md inline-block">
            <strong>Emergency Support Available</strong>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {swepData.image && (
            <div className="mb-8">
              <img 
                src={swepData.image} 
                alt={`SWEP information for ${locationName}`}
                className="w-full h-auto object-contain rounded-lg shadow-md"
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: parsedBody }}
          />
          
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-xl font-semibold mb-3 text-blue-800">Emergency Contacts</h3>
            <div className="space-y-2">
              <p className="text-blue-700">
                <strong>Immediate danger:</strong>{' '}
                <a href="tel:999" className="text-blue-600 hover:text-blue-800 underline font-semibold">
                  Call 999
                </a>
              </p>
              <p className="text-blue-700">
                <strong>Someone sleeping rough:</strong>{' '}
                <a 
                  href="https://thestreetlink.org.uk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-semibold"
                >
                  Report via StreetLink
                </a>
              </p>
              {swepData.emergencyContact && (
                <p className="text-blue-700">
                  <strong>Local SWEP Support:</strong>{' '}
                  <a 
                    href={`tel:${swepData.emergencyContact.phone}`}
                    className="text-blue-600 hover:text-blue-800 underline font-semibold"
                  >
                    {swepData.emergencyContact.phone}
                  </a>
                  <br />
                  <small className="text-blue-600">
                    {swepData.emergencyContact.hours}
                  </small>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}