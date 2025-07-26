import Link from 'next/link';

export default function UserGuidesPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="/resources" className="text-gray-700 hover:text-blue-600">
                  Resources
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">User Guides</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">User Guides</h1>
        <p className="text-xl text-gray-700">Essential guides to help you manage, update, and maintain organisation information on Street Support Network.</p>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">Street Support Admin User Guides</h2>
        <p className="mb-8">Our user guides are here to help you manage and update organisation information on Street Support Network with ease and confidence. Whether you're an administrator for an organistion, a location, or a data integrity volunteer, these guides are designed to make the process simple, clear, and effective.</p>

        <div className="space-y-8">
          {/* Adding an Organisation Guide */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Adding an Organisation (Best Practice)</h2>
            <p className="mb-4">Designed for city administrators and data integrity volunteers, this guide outlines best practices for adding new organisations. It ensures that each entry is consistent, high-quality, and contributes to a network that users can rely on to find the right services in their area.</p>
            <a 
              href="/resources/user-guides/adding-an-org.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-d text-white rounded hover:bg-brand-e transition-colors"
            >
              View the guide
            </a>
          </section>

          {/* Location and Volunteer Admin Guide */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Location and Volunteer Admin User Guide</h2>
            <p className="mb-4">For those managing multiple organisations within an area or volunteers managing multiple locations, these guides provide a detailed, step-by-step approach to adding, editing, and maintaining organisation profiles. We've made sure that the process is straightforward so you can keep information current and trustworthy with minimal effort.</p>
            <a 
              href="/resources/user-guides/admin-user-guide.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-d text-white rounded hover:bg-brand-e transition-colors"
            >
              View the guide
            </a>
          </section>

          {/* Organisation User Guide */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Organisation User Guide</h2>
            <p className="mb-4">This guide is for organisations looking to update their information on Street Support Network. It will walk you through the process of adding or editing your details, making sure everything is accurate and easily accessible for those who need it most.</p>
            <a 
              href="/resources/user-guides/organisation-user-guide.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-d text-white rounded hover:bg-brand-e transition-colors"
            >
              View the guide
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}