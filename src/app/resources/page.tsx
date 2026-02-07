import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';

export default function ResourcesPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { label: "Resources", current: true }
        ]} 
      />

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="heading-1 text-white">Resources</h1>
          <p className="text-lead text-white">Practical guides to support homelessness efforts and collaboration.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Content */}
        <div className="px-6 py-12">
        <div className="prose max-w-none mb-12">
          <p>We&apos;ve created this resource library to help anyone working to support people experiencing homelessness. You&apos;ll find practical guides, policies, and resources to help you to maximise the impact of your work within your location.</p>
        </div>

        {/* Resources for Everyone */}
        <section className="mb-16">
          <h2 className="heading-2">Resources for Everyone</h2>
          <p className="text-body mb-8">This section is for anyone looking to make a difference. Whether you&apos;re an individual, a business, or part of a community group, you&apos;ll find best practice guides and information to help support people experiencing homelessness.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Alternative Giving */}
            <article className="bg-white border border-brand-q rounded-md flex flex-col h-full p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Image
                  src="/assets/img/resource-icons/alternative-giving-icon.png"
                  alt="Alternative Giving"
                  width={70}
                  height={70}
                  className="mr-4"
                  sizes="55px"
                />
                <h3 className="heading-5">Alternative Giving</h3>
              </div>
              <p className="text-small mb-6 flex-grow">What it means to give differently, and why you should be thinking about it.</p>
              <Link href="/resources/alternative-giving" className="btn-base btn-primary btn-md w-full mt-auto" aria-label="Learn more about alternative giving">
                Learn more
              </Link>
            </article>

            {/* Effective Volunteering */}
            <article className="bg-white border border-brand-q rounded-md flex flex-col h-full p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Image
                  src="/assets/img/resource-icons/volunteering-icon.png"
                  alt="Effective Volunteering"
                  width={70}
                  height={70}
                  className="mr-4"
                  sizes="55px"
                />
                <h3 className="heading-5">Effective Volunteering</h3>
              </div>
              <p className="text-small mb-6 flex-grow">How to make the most impact with your volunteering.</p>
              <Link href="/resources/effective-volunteering" className="btn-base btn-primary btn-md w-full mt-auto" aria-label="Learn more about effective volunteering">
                Learn more
              </Link>
            </article>

            {/* Homelessness Charters */}
            <article className="bg-white border border-brand-q rounded-md flex flex-col h-full p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Image
                  src="/assets/img/resource-icons/charters-icon.png"
                  alt="Homelessness Charters"
                  width={70}
                  height={70}
                  className="mr-4"
                  sizes="55px"
                />
                <h3 className="heading-5">Homelessness Charters</h3>
              </div>
              <p className="text-small mb-6 flex-grow">What is a Homelessness Charter, and do you need one?</p>
              <Link href="/resources/charters" className="btn-base btn-primary btn-md w-full mt-auto" aria-label="Learn more about homelessness charters">
                Learn more
              </Link>
            </article>

            {/* Street Feeding */}
            <article className="bg-white border border-brand-q rounded-md flex flex-col h-full p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Image
                  src="/assets/img/resource-icons/streetfeeding-icon.png"
                  alt="Street Feeding"
                  width={70}
                  height={70}
                  className="mr-4"
                  sizes="55px"
                />
                <h3 className="heading-5">Street Feeding</h3>
              </div>
              <p className="text-small mb-6 flex-grow">Our stance on Street Feeding for sustainable support and change.</p>
              <Link href="/resources/street-feeding-groups" className="btn-base btn-primary btn-md w-full mt-auto" aria-label="Learn more about street feeding">
                Learn more
              </Link>
            </article>
          </div>
        </section>

        {/* Resources for Our Network */}
        <section>
          <h2 className="heading-2">Resources for Our Network</h2>
          <p className="text-body mb-8">This section is for our Street Support Network Partners, designed to help you promote your location, customise the SSN brand for your area, and benefit from being part of our Network. From marketing tools to communication guides, these resources will help you maximise your impact and share our mission.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Branding */}
            <article className="bg-white border border-brand-q rounded-md flex flex-col h-full p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Image
                  src="/assets/img/resource-icons/branding-icon.png"
                  alt="Branding"
                  width={70}
                  height={70}
                  className="mr-4"
                  sizes="55px"
                />
                <h3 className="heading-5">Branding</h3>
              </div>
              <p className="text-small mb-6 flex-grow">Guidelines to adapt and align with the Street Support Network identity.</p>
              <Link href="/resources/branding" className="btn-base btn-primary btn-md w-full mt-auto" aria-label="Learn more about branding">
                Learn more
              </Link>
            </article>

            {/* Partnership Communications */}
            <article className="bg-white border border-brand-q rounded-md flex flex-col h-full p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Image
                  src="/assets/img/resource-icons/partnership-comms-icon.png"
                  alt="Partnership Communications"
                  width={70}
                  height={70}
                  className="mr-4"
                  sizes="55px"
                />
                <h3 className="heading-5">Partnership Communications</h3>
              </div>
              <p className="text-small mb-6 flex-grow">How to make the most of being part of Street Support Network.</p>
              <Link href="/resources/partnership-comms" className="btn-base btn-primary btn-md w-full mt-auto" aria-label="Learn more about partnership communications">
                Learn more
              </Link>
            </article>

            {/* Marketing */}
            <article className="bg-white border border-brand-q rounded-md flex flex-col h-full p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Image
                  src="/assets/img/resource-icons/marketing-icon.png"
                  alt="Marketing"
                  width={70}
                  height={70}
                  className="mr-4"
                  sizes="55px"
                />
                <h3 className="heading-5">Marketing</h3>
              </div>
              <p className="text-small mb-6 flex-grow">Strategies to raise awareness and engage your community effectively.</p>
              <Link href="/resources/marketing" className="btn-base btn-primary btn-md w-full mt-auto" aria-label="Learn more about marketing">
                Learn more
              </Link>
            </article>

            {/* User Guides */}
            <article className="bg-white border border-brand-q rounded-md flex flex-col h-full p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Image
                  src="/assets/img/resource-icons/user-guides-icon.png"
                  alt="User guides"
                  width={70}
                  height={70}
                  className="mr-4"
                  sizes="55px"
                />
                <h3 className="heading-5">User Guides</h3>
              </div>
              <p className="text-small mb-6 flex-grow">Step-by-step documentation to help you manage and update organisation data effortlessly.</p>
              <Link href="/resources/user-guides" className="btn-base btn-primary btn-md w-full mt-auto" aria-label="Learn more about user guides">
                Learn more
              </Link>
            </article>
          </div>
        </section>
        
        <SocialShare shareText="Check out these helpful resources on Street Support Network" />
        </div>
      </div>
    </>
  );
}