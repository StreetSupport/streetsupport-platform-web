import React from 'react';
import Link from 'next/link';
import HomepageMap from '@/components/Homepage/HomepageMap';
import Hero from '@/components/ui/Hero';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero
        backgroundImage="/assets/img/home-header-background.png"
        title="Working Together to Tackle Homelessness"
        subtitle="Find support services near you."
        ctaText="Find Help"
        ctaLink="/find-help"
      />

      {/* Where we are section */}
      <section className="section-spacing px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="heading-2">
                Where we are
              </h2>
              <p className="text-body">
                Street Support Network is currently active in several locations across the UK.
              </p>
              <p className="text-body mb-8">
                Want to see what is happening near you? Select one location to visit their page.
              </p>
            </div>
            <div className="w-full">
              <HomepageMap />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-spacing px-4 bg-brand-a text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2 text-brand-d">1815</div>
              <div className="text-xl md:text-2xl font-light">Organisations</div>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold mb-2 text-brand-d">4567</div>
              <div className="text-xl md:text-2xl font-light">Services</div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="section-spacing px-4 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading-3 mb-4">
            In collaboration with...
          </h2>
          <div className="h-1 w-24 bg-brand-d mx-auto mb-8"></div>
          <p className="text-body mb-6 max-w-2xl mx-auto">
            We are looking for businesses and supporters to{' '}
            <Link href="/give-help/business-support/" className="text-brand-a hover:text-brand-b underline font-medium">
              partner with us in the mission to tackle homelessness
            </Link>.
          </p>
          <p className="text-body max-w-2xl mx-auto">
            If you share our vision of a society without homelessness, please{' '}
            <Link href="/contact" className="text-brand-a hover:text-brand-b underline font-medium">
              get in touch
            </Link>.
          </p>
        </div>
      </section>
    </main>
  );
}