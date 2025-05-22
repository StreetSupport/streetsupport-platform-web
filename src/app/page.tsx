'use client';

import React from 'react';
import LocationSelector from '@/components/Location/LocationSelector';
import PrimaryButton from '@/components/Button/PrimaryButton';

export default function HomePage() {
  return (
    <>
      {/* Yellow header bar */}
      <div className="w-full h-4 bg-brand-e" />

      {/* Hero section with background */}
      <section
        className="pt-10 pb-10 m:pt-20 m:pb-20"
        style={{
          backgroundImage: 'url(/assets/img/bg/cityscape.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="px-6 lg:px-12 max-w-screen-xl mx-auto text-left">
          <h1 className="text-[35px] leading-[1.3] mb-5 font-headline">
            Working Together to Tackle Homelessness
          </h1>
          <h2 className="text-[20px] leading-[1.3] mb-5 font-headline text-brand-d">
            Find support services near you.
          </h2>
          <PrimaryButton href="/find-help" variant="cta">
            Find Help
          </PrimaryButton>
        </div>
      </section>

      {/* Where we are section */}
      <section className="pt-10 pb-10 m:pt-20 m:pb-20">
        <div className="px-6 lg:px-12 max-w-screen-xl mx-auto">
          <div className="flex flex-col m:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <h2 className="text-[20px] leading-[1.3] mb-5 font-headline">Where we are</h2>
              <p className="leading-[1.5]">
                Street Support Network is currently active in several locations across the UK.
              </p>
              <p className="text-[16px] leading-[1.3] mb-5 font-headline">
                Want to see what is happening near you? Select one…
              </p>

              <LocationSelector hideLegend={true} />
            </div>

            <div className="flex-1">
              <div className="w-full h-96 bg-gray-200 js-map"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
