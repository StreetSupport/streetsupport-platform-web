import Link from 'next/link';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';
import { generateSEOMetadata } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Jobs and Volunteering Opportunities',
    description: 'Join our team at Street Support Network. Current job vacancies and volunteering opportunities to help people experiencing homelessness.',
    keywords: [
      'street support jobs',
      'charity jobs',
      'volunteering opportunities',
      'homelessness sector careers',
      'nonprofit jobs',
      'trustee positions'
    ],
    path: 'about/jobs',
    image: '/assets/img/og/street-support.jpg',
    imageAlt: 'Jobs and Volunteering at Street Support Network'
  });
}

export default function JobsPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About Street Support" },
          { label: "Jobs", current: true }
        ]} 
      />

      {/* Header */}
      <section className="bg-brand-i py-12">
        <div className="content-container">
          <h1 className="heading-1 text-white">Jobs</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content max-w-none">
            <div className="space-y-12">
              
              {/* Introduction */}
              <section>
                <p className="text-lead mb-8">
                  We are a small team with a big mission - jobs that we are currently recruiting for are listed below. We also rely on volunteers, so if you are interested please get in touch with your skills and availability at <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a>.
                </p>
              </section>

              {/* Current Vacancies */}
              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Current Vacancies</h2>
                <div className="bg-brand-q p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-a rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-brand-l mb-2">Trustee Position</h3>
                        <p className="text-body mb-3">
                          Join our board of trustees and help guide the strategic direction of Street Support Network. We&apos;re looking for passionate individuals who can contribute their skills and expertise to our mission.
                        </p>
                        <a 
                          href="/about/jobs/trustee/trustee-vacancy-advert.pdf" 
                          className="inline-flex items-center px-4 py-2 bg-brand-a text-white font-semibold rounded-lg hover:bg-brand-b hover:text-white transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Full Details
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Volunteering */}
              <section>
                <h2 className="heading-2 mb-6 text-brand-l">Volunteering Opportunities</h2>
                <div className="bg-brand-i p-6 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-a rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-brand-l mb-2">Data Integrity Volunteer</h3>
                        <p className="text-body mb-3">
                          Help us maintain accurate and up-to-date information about support services. This remote role is perfect for detail-oriented individuals who want to make a direct impact.
                        </p>
                        <Link 
                          href="/about/jobs/data-integrity/" 
                          className="inline-flex items-center px-4 py-2 bg-brand-a text-white font-semibold rounded-lg hover:bg-brand-b hover:text-white transition-colors"
                        >
                          Learn More
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Get Involved CTA */}
              <section className="bg-brand-k text-white p-8 rounded-lg">
                <div className="text-center">
                  <h2 className="heading-3 mb-4 text-white">Want to Get Involved?</h2>
                  <p className="text-brand-f mb-6 max-w-2xl mx-auto">
                    Whether you&apos;re looking for paid opportunities or want to volunteer your time and skills, we&apos;d love to hear from you. Together, we can make a real difference in supporting people experiencing homelessness.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="mailto:admin@streetsupport.net"
                      className="inline-flex items-center justify-center px-6 py-3 bg-brand-a text-white font-semibold rounded-lg hover:bg-brand-b hover:text-white transition-colors"
                    >
                      Get in Touch
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </a>
                    <Link
                      href="/about"
                      className="inline-flex items-center justify-center px-6 py-3 border-2 border-brand-a text-brand-a font-semibold rounded-lg hover:bg-brand-a hover:text-white transition-colors"
                    >
                      Learn About Us
                    </Link>
                  </div>
                </div>
              </section>

            </div>
          </div>
          <SocialShare />
        </div>
      </section>
    </>
  );
}