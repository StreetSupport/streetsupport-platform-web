import Link from 'next/link';

export default function JobsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-brand-l hover:text-brand-a">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <Link href="/about" className="text-brand-l hover:text-brand-a">
                  About
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-brand-f">/</span>
                <span className="text-brand-f">Jobs</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-2">Jobs</h1>
      </div>

      {/* Content */}
      <div className="prose max-w-none">
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
    </div>
  );
}