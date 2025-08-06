import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import locations from '@/data/locations.json';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { SwepData } from '@/types';
import { isSwepActive, formatSwepActivePeriod, parseSwepBody } from '@/utils/swep';
import swepPlaceholderData from '@/data/swep-fallback.json';
import { generateLocationSEOMetadata } from '@/utils/seo';

export const dynamic = 'force-dynamic';

// @ts-expect-error Next dynamic param inference workaround
export async function generateMetadata(props): Promise<Metadata> {
  const { slug } = await props.params;

  const location = locations.find(
    (loc) => loc.slug === slug && loc.isPublic
  );

  if (!location) {
    return {
      title: 'SWEP Information Not Found | Street Support Network',
      description: 'The requested SWEP information page could not be found.',
      robots: 'noindex, nofollow'
    };
  }

  return generateLocationSEOMetadata(location.name, slug, 'swep');
}

// @ts-expect-error Next dynamic param inference workaround
export default async function SwepPage(props) {
  const { slug } = await props.params;

  const location = locations.find(
    (loc) => loc.slug === slug && loc.isPublic
  );

  if (!location) {
    notFound();
  }

  // Get SWEP placeholder data - this will be replaced with CMS integration later
  const swepData = swepPlaceholderData.find(
    (entry: SwepData) => entry.locationSlug === slug
  ) || null;

  // If no SWEP data exists for this location, show 404
  if (!swepData) {
    notFound();
  }

  // Check if SWEP is currently active - if not, show 404
  if (!isSwepActive(swepData)) {
    notFound();
  }

  const activePeriodText = formatSwepActivePeriod(swepData);
  const parsedBody = parseSwepBody(swepData.body);

  return (
    <main>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: `/${location.slug}`, label: location.name },
          { label: "SWEP Information", current: true }
        ]} 
      />

      {/* Header */}
      <div className="bg-red-50 border-b-4 border-brand-g py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-brand-g rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h1 className="heading-2 text-red-800 mb-0">
              {swepData.title}
            </h1>
          </div>
          <p className="text-lead text-red-700 mb-4">
            {activePeriodText}
          </p>
          <div className="bg-brand-g text-white px-4 py-2 rounded-md inline-block">
            <strong>Emergency Support Active</strong>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {swepData.image && (
            <div className="mb-8">
              <img 
                src={swepData.image} 
                alt={`SWEP information for ${location.name}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: parsedBody }}
          />
          
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-xl font-semibold mb-3 text-blue-800">Emergency Contacts</h3>
            <div className="space-y-2">
              <p className="text-blue-700">
                <strong>Immediate danger:</strong>{' '}
                <a href="tel:999" className="text-blue-600 hover:text-blue-800 underline font-semibold">
                  Call 999
                </a>
              </p>
              <p className="text-blue-700">
                <strong>Someone sleeping rough:</strong>{' '}
                <a 
                  href="https://thestreetlink.org.uk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-semibold"
                >
                  Report via StreetLink
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}