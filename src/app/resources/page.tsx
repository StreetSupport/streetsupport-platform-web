import Link from 'next/link';
import Image from 'next/image';

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="px-6 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Resources</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-gray-50 px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Resources</h1>
        <p className="text-xl text-gray-700">Practical guides to support homelessness efforts and collaboration.</p>
      </div>

      {/* Content */}
      <div className="px-6 py-12">
        <div className="prose max-w-none mb-12">
          <p>We've created this resource library to help anyone working to support people experiencing homelessness. You'll find practical guides, policies, and resources to help you to maximise the impact of your work within your location.</p>
        </div>

        {/* Resources for Everyone */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Resources for Everyone</h2>
          <p className="text-gray-700 mb-8">This section is for anyone looking to make a difference. Whether you're an individual, a business, or part of a community group, you'll find best practice guides and information to help support people experiencing homelessness.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Alternative Giving */}
            <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/img/resource-icons/alternative-giving-icon.png"
                  alt="Alternative Giving"
                  width={55}
                  height={55}
                  className="mr-3"
                  sizes="55px"
                  sizes="55px"
                />
                <h3 className="text-xl font-semibold">Alternative Giving</h3>
              </div>
              <p className="text-gray-600 mb-4">What it means to give differently, and why you should be thinking about it.</p>
              <Link href="/resources/alternative-giving" className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-e text-white rounded hover:bg-brand-f transition-colors">
                Learn more
              </Link>
            </article>

            {/* Effective Volunteering */}
            <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/img/resource-icons/volunteering-icon.png"
                  alt="Effective Volunteering"
                  width={55}
                  height={55}
                  className="mr-3"
                  sizes="55px"
                />
                <h3 className="text-xl font-semibold">Effective Volunteering</h3>
              </div>
              <p className="text-gray-600 mb-4">How to make the most impact with your volunteering.</p>
              <Link href="/resources/effective-volunteering" className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-e text-white rounded hover:bg-brand-f transition-colors">
                Learn more
              </Link>
            </article>

            {/* Homelessness Charters */}
            <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/img/resource-icons/charters-icon.png"
                  alt="Homelessness Charters"
                  width={55}
                  height={55}
                  className="mr-3"
                  sizes="55px"
                />
                <h3 className="text-xl font-semibold">Homelessness Charters</h3>
              </div>
              <p className="text-gray-600 mb-4">What is a Homelessness Charter, and do you need one?</p>
              <Link href="/resources/charters" className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-e text-white rounded hover:bg-brand-f transition-colors">
                Learn more
              </Link>
            </article>

            {/* Street Feeding */}
            <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/img/resource-icons/streetfeeding-icon.png"
                  alt="Street Feeding"
                  width={55}
                  height={55}
                  className="mr-3"
                  sizes="55px"
                />
                <h3 className="text-xl font-semibold">Street Feeding</h3>
              </div>
              <p className="text-gray-600 mb-4">Our stance on Street Feeding for sustainable support and change.</p>
              <Link href="/resources/street-feeding-groups" className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-e text-white rounded hover:bg-brand-f transition-colors">
                Learn more
              </Link>
            </article>
          </div>
        </section>

        {/* Resources for Our Network */}
        <section>
          <h2 className="text-3xl font-bold mb-4">Resources for Our Network</h2>
          <p className="text-gray-700 mb-8">This section is for our Street Support Network Partners, designed to help you promote your location, customise the SSN brand for your area, and benefit from being part of our Network. From marketing tools to communication guides, these resources will help you maximise your impact and share our mission.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Branding */}
            <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/img/resource-icons/branding-icon.png"
                  alt="Branding"
                  width={55}
                  height={55}
                  className="mr-3"
                  sizes="55px"
                />
                <h3 className="text-xl font-semibold">Branding</h3>
              </div>
              <p className="text-gray-600 mb-4">Guidelines to adapt and align with the Street Support Network identity.</p>
              <Link href="/resources/branding" className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-e text-white rounded hover:bg-brand-f transition-colors">
                Learn more
              </Link>
            </article>

            {/* Partnership Communications */}
            <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/img/resource-icons/partnership-comms-icon.png"
                  alt="Partnership Communications"
                  width={55}
                  height={55}
                  className="mr-3"
                  sizes="55px"
                />
                <h3 className="text-xl font-semibold">Partnership Communications</h3>
              </div>
              <p className="text-gray-600 mb-4">How to make the most of being part of Street Support Network.</p>
              <Link href="/resources/partnership-comms" className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-e text-white rounded hover:bg-brand-f transition-colors">
                Learn more
              </Link>
            </article>

            {/* Marketing */}
            <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/img/resource-icons/marketing-icon.png"
                  alt="Marketing"
                  width={55}
                  height={55}
                  className="mr-3"
                  sizes="55px"
                />
                <h3 className="text-xl font-semibold">Marketing</h3>
              </div>
              <p className="text-gray-600 mb-4">Strategies to raise awareness and engage your community effectively.</p>
              <Link href="/resources/marketing" className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-e text-white rounded hover:bg-brand-f transition-colors">
                Learn more
              </Link>
            </article>

            {/* User Guides */}
            <article className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/img/resource-icons/user-guides-icon.png"
                  alt="User guides"
                  width={55}
                  height={55}
                  className="mr-3"
                  sizes="55px"
                />
                <h3 className="text-xl font-semibold">User Guides</h3>
              </div>
              <p className="text-gray-600 mb-4">Step-by-step documentation to help you manage and update organisation data effortlessly.</p>
              <Link href="/resources/user-guides" className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-e text-white rounded hover:bg-brand-f transition-colors">
                Learn more
              </Link>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}