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
      <nav className="bg-gray-50 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <ol className="flex space-x-2 text-sm text-gray-700">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-1">/</span>
            </li>
            <li>
              <Link href={`/${location.slug}`} className="hover:underline">{location.name}</Link>
              <span className="mx-1">/</span>
            </li>
            <li>Advice</li>
          </ol>
        </div>
      </nav>

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