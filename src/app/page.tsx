import React from 'react';
import Link from 'next/link';
import HomepageMap from '@/components/Homepage/HomepageMap';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-a via-brand-b to-brand-c text-white py-24 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Working Together to Tackle<br />
            <span className="text-brand-d">Homelessness</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto font-light">
            Find support services near you.
          </p>
          <Link
            href="/find-help"
            className="inline-block px-8 py-4 bg-brand-d hover:bg-brand-e text-black font-semibold text-lg rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
          >
            Find Help
          </Link>
        </div>
      </section>

      {/* Where we are section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Where we are
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Street Support Network is currently active in several locations across the UK.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
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
      <section className="py-16 px-4 bg-brand-a text-white">
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
      <section className="py-16 px-4 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            In collaboration with...
          </h2>
          <div className="h-1 w-24 bg-brand-d mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
            We are looking for businesses and supporters to{' '}
            <Link href="/give-help/business-support/" className="text-brand-a hover:text-brand-b underline font-medium">
              partner with us in the mission to tackle homelessness
            </Link>.
          </p>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
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