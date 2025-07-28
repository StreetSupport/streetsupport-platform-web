import Link from 'next/link';
import { notFound } from 'next/navigation';
import locations from '@/data/locations.json';
import AdvicePageClient from './AdvicePageClient';

export const dynamic = 'force-dynamic';

// @ts-expect-error Next dynamic param inference workaround
export default async function AdvicePage(props) {
  const { slug } = await props.params;

  const location = locations.find(
    (loc) => loc.slug === slug && loc.isPublic
  );

  if (!location) {
    notFound();
  }

  return (
    <main className="space-y-8">
      {/* Breadcrumbs */}
      <div className="bg-brand-n py-4">
        <div className="max-w-7xl mx-auto px-6">
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
                  <Link href={`/${location.slug}`} className="text-white hover:text-brand-q">
                    {location.name}
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-white">/</span>
                  <span className="text-white">Advice</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <section className="bg-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">
            Advice for {location.name}
          </h1>
          <p className="text-lg text-gray-700">
            Find answers to common questions and get advice on support available in {location.name}.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <AdvicePageClient locationKey={location.key} locationName={location.name} />
    </main>
  );
}