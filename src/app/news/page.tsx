import Link from 'next/link';

export default function NewsPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-brand-n py-4">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-white hover:text-brand-q">
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-white">/</span>
                  <span className="text-white">News</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-6">News & Updates</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-8">
          Stay updated with the latest news, developments, and stories from Street Support and the homelessness sector.
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Latest Articles</h2>
          
          <div className="space-y-6">
            <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href="/news/platform-expansion-2024" className="text-blue-600 hover:text-blue-800">
                      Street Support Expands to Five New Cities in 2024
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">January 15, 2024</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Platform Update</span>
              </div>
              <p className="text-gray-700 mb-3">
                We're excited to announce our expansion into Birmingham, Leeds, Liverpool, Sheffield, and Bristol, bringing our platform to thousands more people in need of support services.
              </p>
              <Link href="/news/platform-expansion-2024" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Read more →
              </Link>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href="/news/winter-support-initiatives" className="text-blue-600 hover:text-blue-800">
                      Winter Support Initiatives Show 40% Increase in Service Access
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">December 20, 2023</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Impact Report</span>
              </div>
              <p className="text-gray-700 mb-3">
                Our winter emergency support campaign has successfully connected over 2,000 additional people with emergency accommodation and essential services during the coldest months.
              </p>
              <Link href="/news/winter-support-initiatives" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Read more →
              </Link>
            </article>

            <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    <Link href="/news/mobile-app-accessibility-update" className="text-blue-600 hover:text-blue-800">
                      New Mobile Accessibility Features Launch
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">November 8, 2023</p>
                </div>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">Feature Launch</span>
              </div>
              <p className="text-gray-700 mb-3">
                We've launched enhanced accessibility features including voice navigation, text-to-speech, and simplified interfaces to better serve users with diverse needs and abilities.
              </p>
              <Link href="/news/mobile-app-accessibility-update" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Read more →
              </Link>
            </article>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Platform Updates</h4>
              <p className="text-sm text-gray-600">New features, expansions, and technical improvements</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Impact Stories</h4>
              <p className="text-sm text-gray-600">Real stories of how Street Support is making a difference</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Partnerships</h4>
              <p className="text-sm text-gray-600">New collaborations and community partnerships</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Policy & Research</h4>
              <p className="text-sm text-gray-600">Insights on homelessness policy and sector developments</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Events</h4>
              <p className="text-sm text-gray-600">Conferences, workshops, and community events</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Announcements</h4>
              <p className="text-sm text-gray-600">Important updates and organisational news</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-gray-700 mb-4">
              Get monthly updates on platform developments, impact stories, and sector news delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <button className="btn-base btn-primary btn-sm">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">In the Media</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="text-sm text-gray-600">"Street Support's innovative approach to connecting homeless people with services has transformed how we think about digital inclusion in social care."</p>
              <cite className="text-xs text-gray-500">— Social Care Today, March 2024</cite>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="text-sm text-gray-600">"The platform's expansion across the UK represents a significant step forward in addressing homelessness through technology."</p>
              <cite className="text-xs text-gray-500">— Third Sector Magazine, February 2024</cite>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8">
        <Link
          href="/contact"
          className="btn-base btn-primary btn-md mr-4"
        >
          Contact Our Media Team
        </Link>
        <Link
          href="/about/impact"
          className="btn-base btn-secondary btn-md"
        >
          View Our Impact
        </Link>
      </div>
      </div>
    </>
  );
}