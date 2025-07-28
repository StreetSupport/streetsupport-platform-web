import Link from 'next/link';

export default function UserGuidesPage() {
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
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-white">/</span>
                  <Link href="/resources" className="text-white hover:text-brand-q">
                    Resources
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-white">/</span>
                  <span className="text-white">User Guides</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="heading-1 mb-4 text-white">User Guides</h1>
          <p className="text-lead text-white">Essential guides to help you manage, update, and maintain organisation information on Street Support Network.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">

      {/* Content */}
      <div className="prose max-w-none">
        <h2 className="heading-3 mb-4">Street Support Admin User Guides</h2>
        <p className="mb-8">Our user guides are here to help you manage and update organisation information on Street Support Network with ease and confidence. Whether you're an administrator for an organistion, a location, or a data integrity volunteer, these guides are designed to make the process simple, clear, and effective.</p>

        <div className="space-y-8">
          {/* Adding an Organisation Guide */}
          <section>
            <h2 className="heading-3 mb-4">Adding an Organisation (Best Practice)</h2>
            <p className="mb-4">Designed for city administrators and data integrity volunteers, this guide outlines best practices for adding new organisations. It ensures that each entry is consistent, high-quality, and contributes to a network that users can rely on to find the right services in their area.</p>
            <a 
              href="/resources/user-guides/adding-an-org.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-a text-white font-semibold rounded-md hover:bg-brand-b active:bg-brand-c transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-offset-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View the guide
            </a>
          </section>

          {/* Location and Volunteer Admin Guide */}
          <section>
            <h2 className="heading-3 mb-4">Location and Volunteer Admin User Guide</h2>
            <p className="mb-4">For those managing multiple organisations within an area or volunteers managing multiple locations, these guides provide a detailed, step-by-step approach to adding, editing, and maintaining organisation profiles. We've made sure that the process is straightforward so you can keep information current and trustworthy with minimal effort.</p>
            <a 
              href="/resources/user-guides/admin-user-guide.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-a text-white font-semibold rounded-md hover:bg-brand-b active:bg-brand-c transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-offset-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View the guide
            </a>
          </section>

          {/* Organisation User Guide */}
          <section>
            <h2 className="heading-3 mb-4">Organisation User Guide</h2>
            <p className="mb-4">This guide is for organisations looking to update their information on Street Support Network. It will walk you through the process of adding or editing your details, making sure everything is accurate and easily accessible for those who need it most.</p>
            <a 
              href="/resources/user-guides/organisation-user-guide.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-a text-white font-semibold rounded-md hover:bg-brand-b active:bg-brand-c transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-offset-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View the guide
            </a>
          </section>
        </div>
        </div>
      </div>
    </>
  );
}