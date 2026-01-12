import { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';
import { generateSEOMetadata } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Our Impact - Making a Difference',
    description: 'Discover the impact Street Support Network has made connecting people experiencing homelessness with vital support services across the UK.',
    keywords: [
      'street support impact',
      'homelessness statistics',
      'charity impact report',
      'social impact data',
      'homelessness support statistics',
      'community impact'
    ],
    path: 'about/impact',
    image: '/assets/img/og/street-support.jpg',
    imageAlt: 'Street Support Network Impact and Statistics'
  });
}

// Current statistics - manually maintained
const getCurrentStatistics = () => {
  return {
    serviceProviders: 1815,
    services: 4565,
    totalViews: 2607163,
    totalUsers: 961360,
    partnerships: 31,
    resourceGuides: 7,
    networkEvents: 17,
    newsItems: 618,
    locations: 31, // Same as partnerships for UK locations
    averageMonthlyUsers: Math.floor(961360 / 12) // Rough estimate based on total users
  };
};

export default function ImpactPage() {
  const stats = getCurrentStatistics();

  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { label: "Impact", current: true }
        ]} 
      />

      {/* Header */}
      <section className="bg-brand-i py-12">
        <div className="content-container">
          <h1 className="heading-1 text-white">Our Impact</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content max-w-none">
            <div className="space-y-12">

              {/* Introduction */}
              <section className="text-center">
                <p className="text-lead mb-8 max-w-4xl mx-auto">
                  Our mission is to make it easier for anyone experiencing homelessness to get the help they need. We connect organisations that provide services, with individuals and businesses that want to do something to help. Here are the latest key facts and examples of how Street Support is making an impact.
                </p>
              </section>

              {/* Key Statistics Grid */}
              <section>
                <h2 className="heading-2 mb-8 text-brand-l text-center">Impact Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  
                  <div className="bg-brand-q p-6 rounded-lg text-center shadow-lg">
                    <div className="text-4xl font-bold text-brand-a mb-2">
                      {stats.serviceProviders.toLocaleString()}
                    </div>
                    <div className="text-brand-l font-semibold text-sm">Service Providers Listed</div>
                  </div>
                  
                  <div className="bg-brand-i p-6 rounded-lg text-center shadow-lg">
                    <div className="text-4xl font-bold text-brand-a mb-2">
                      {stats.services.toLocaleString()}
                    </div>
                    <div className="text-brand-l font-semibold text-sm">Services Listed</div>
                  </div>
                  
                  <div className="bg-brand-q p-6 rounded-lg text-center shadow-lg">
                    <div className="text-4xl font-bold text-brand-a mb-2">
                      {stats.totalViews.toLocaleString()}
                    </div>
                    <div className="text-brand-l font-semibold text-sm">Views to Date</div>
                  </div>
                  
                  <div className="bg-brand-i p-6 rounded-lg text-center shadow-lg">
                    <div className="text-4xl font-bold text-brand-a mb-2">
                      {stats.totalUsers.toLocaleString()}
                    </div>
                    <div className="text-brand-l font-semibold text-sm">Users to Date</div>
                  </div>

                </div>

                {/* Secondary Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  <div className="bg-white border-l-4 border-brand-a p-4 shadow">
                    <div className="text-2xl font-bold text-brand-l mb-1">{stats.partnerships}</div>
                    <div className="text-brand-f text-xs">Local Partnerships Supported</div>
                  </div>
                  
                  <div className="bg-white border-l-4 border-brand-a p-4 shadow">
                    <div className="text-2xl font-bold text-brand-l mb-1">{stats.resourceGuides}</div>
                    <div className="text-brand-f text-xs">Comprehensive Resource Guides</div>
                  </div>
                  
                  <div className="bg-white border-l-4 border-brand-a p-4 shadow">
                    <div className="text-2xl font-bold text-brand-l mb-1">{stats.networkEvents}</div>
                    <div className="text-brand-f text-xs">Network Events Hosted</div>
                  </div>
                  
                  <div className="bg-white border-l-4 border-brand-a p-4 shadow">
                    <div className="text-2xl font-bold text-brand-l mb-1">{stats.newsItems}</div>
                    <div className="text-brand-f text-xs">News Items Shared</div>
                  </div>

                </div>
              </section>

              {/* Impact Highlights */}
              <section>
                <h2 className="heading-2 mb-8 text-brand-l text-center">Impact Highlights</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  
                  <div className="bg-brand-k text-white p-8 rounded-lg">
                    <h3 className="heading-4 mb-4 !text-white">Community Engagement</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-brand-a rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-brand-f">{stats.networkEvents} networking events hosted</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-brand-a rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-brand-f">{stats.partnerships} local partnerships supported</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-brand-a rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-brand-f">{stats.newsItems} news items and updates shared</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-brand-a text-white p-8 rounded-lg">
                    <h3 className="heading-4 mb-4 text-white">Resource Development</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-brand-a" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">{stats.resourceGuides} comprehensive resource guides created</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-brand-a" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">Daily service information updates</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-brand-a" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">24/7 accessible platform</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </section>

              {/* Statistics Note */}
              <section className="text-center bg-brand-i p-6 rounded-lg">
                <p className="text-brand-l text-sm">
                  <strong>Current Statistics:</strong> These figures represent our ongoing impact across the UK as of {new Date().toLocaleDateString('en-GB', { 
                    year: 'numeric', 
                    month: 'long'
                  })}.
                </p>
              </section>

            </div>
          </div>
          <SocialShare />
        </div>
      </section>
    </>
  );
}