import { notFound } from 'next/navigation';
import locations from '@/data/locations.json';
import AdvicePageClient from './AdvicePageClient';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

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
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: `/${location.slug}`, label: location.name },
          { label: "Advice", current: true }
        ]} 
      />

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