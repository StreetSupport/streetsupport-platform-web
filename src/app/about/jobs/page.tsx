import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';

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

      {/* Content */}
      <section className="section-spacing">
        <div className="content-container">
          <div className="prose-content">
        <p>We are a small team with a big mission - jobs that we are currently recruiting for are listed below. We also rely on volunteers, so if you are interested please get in touch with your skills and availability at <a href="mailto:admin@streetsupport.net" className="text-brand-a hover:text-brand-b underline">admin@streetsupport.net</a>.</p>

        <h2 className="heading-3 mb-4">Current Vacancies</h2>
        <ul className="list-disc pl-6 mb-8">
          <li><a href="/about/jobs/trustee/trustee-vacancy-advert.pdf" className="text-brand-a hover:text-brand-b underline">Trustee</a>.</li>
        </ul>

        {/* Divider */}
        <hr className="my-8 border-brand-q" />

        <h2 className="heading-3 mb-4">Volunteering</h2>
        <ul className="list-disc pl-6 mb-8">
          <li><a href="/about/jobs/data-integrity/" className="text-brand-a hover:text-brand-b underline">Data Integrity Volunteer</a></li>
        </ul>
          </div>
          <SocialShare />
        </div>
      </section>
    </>
  );
}