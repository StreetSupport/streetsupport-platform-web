import React from 'react';
import HomepageMap from '@/components/Homepage/HomepageMap';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">
          Street Support Network
        </h1>
        <p className="text-lg text-gray-700 max-w-prose mx-auto">
          A platform to empower communities with real-time support and resources.
        </p>
        <div className="mt-6 flex space-x-4 justify-center">
          <button className="btn-test">
            Get Started
          </button>
          <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Instant Updates', desc: 'Stay informed with live alerts and notifications.' },
          { title: 'Community Map',   desc: 'Visualise nearby resources and support hubs.' },
          { title: 'Volunteer Hub',   desc: 'Connect with volunteers in your local area.' }
        ].map((feature) => (
          <div
            key={feature.title}
            className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              {feature.title}
            </h2>
            <p className="text-gray-600">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Homepage Map */}
      <HomepageMap />
    </main>
  )
}