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
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: `/${location.slug}`, label: location.name },
          { label: "Advice", current: true }
        ]} 
      />

      {/* Header */}
      <div className="bg-brand-i py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="heading-2 text-brand-k mb-4">
            Advice for {location.name}
          </h1>
          <p className="text-lead text-brand-l">
            Get help with common questions about homelessness support and services.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <AdvicePageClient locationKey={location.key} locationName={location.name} />
    </>
  );
}