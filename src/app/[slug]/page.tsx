import Link from 'next/link';
import locations from '@/data/locations.json';
import { notFound } from 'next/navigation';
import Hero from '@/components/ui/Hero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import LocationFindHelp from '@/components/Location/LocationFindHelp';
import LocationStatistics from '@/components/Location/LocationStatistics';
import LocationNews from '@/components/Location/LocationNews';

export const dynamic = 'force-dynamic';

// Helper function to get location background image
function getLocationBackgroundImage(slug: string): string {
  // Map of available location images
  const locationImages = [
    'birmingham', 'blackpool', 'bolton', 'bournemouth-pier-tile', 'bradford',
    'brighton-and-hove', 'bury', 'cambridgeshire', 'chelmsford', 'coventry',
    'derbyshire', 'dudley', 'edinburgh', 'exeter', 'glasgow', 'leeds',
    'liverpool', 'luton', 'manchester', 'nottingham', 'oldham', 'portsmouth',
    'reading', 'rochdale', 'salford', 'sandwell', 'solihull', 'southampton',
    'stockport', 'tameside', 'trafford', 'wakefield', 'walsall',
    'wigan-and-leigh', 'wolverhampton'
  ];

  // Special cases for slug mapping
  const slugMapping: { [key: string]: string } = {
    'bournemouth': 'bournemouth-pier-tile',
    'wigan-leigh': 'wigan-and-leigh',
    'bradford': 'bradford',
    'exeter': 'exeter',
    'portsmouth': 'portsmouth'
  };

  // Check if we have a specific mapping first
  const mappedSlug = slugMapping[slug] || slug;
  
  // Check if the image exists in our available images
  if (locationImages.includes(mappedSlug)) {
    return `/assets/img/locations/${mappedSlug}.png`;
  }
  
  // Fallback to default background
  return `/assets/img/home-header-background.png`;
}

// @ts-expect-error Next dynamic param inference workaround
export default async function LocationPage(props) {
  const { slug } = await props.params;

  const location = locations.find(
    (loc) => loc.slug === slug && loc.isPublic
  );

  if (!location) {
    notFound();
  }

  const locationImage = getLocationBackgroundImage(slug);
  const homeBackground = "/assets/img/home-header-background.png";

  return (
    <main>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { label: location.name, current: true }
        ]} 
      />

      <Hero
        backgroundImage={homeBackground}
        overlayImage={locationImage !== homeBackground ? locationImage : undefined}
        locationSlug={slug}
        title={`Street Support ${location.name}`}
        subtitle={`Connecting people and organisations locally, to tackle homelessness in ${location.name}.`}
        ctaText="Find Help"
        ctaLink="/find-help"
      />

      <section className="bg-brand-i py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-black">Help someone sleeping rough</h2>
          <p className="mb-3 text-black">
            If you are worried about someone you've seen sleeping rough anywhere in {location.name}, you can inform{' '}
            <a href="https://thestreetlink.org.uk" className="text-brand-a hover:text-brand-b underline font-semibold">StreetLink</a>.
          </p>
          <p className="mb-6 text-black">
            If the person is in immediate danger or needs urgent care, please call{' '}
            <a href="tel:999" className="text-red-600 hover:text-red-700 underline font-semibold">999</a>.
          </p>
          <Link
            href={`/${location.slug}/advice`}
            className="inline-flex items-center justify-center px-8 py-3 bg-brand-a text-white font-semibold rounded-md hover:bg-brand-b active:bg-brand-c transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-a focus:ring-offset-2"
          >
            See more emergency advice
          </Link>
        </div>
      </section>

      {/* Find Help Tools */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Find Support in {location.name}
            </h2>
            <p className="text-body max-w-3xl mx-auto">
              Search for support services available near you. Use the filters below to find specific types of help, and see what's available on the map.
            </p>
          </div>
          <LocationFindHelp 
            locationName={location.name}
            latitude={location.latitude}
            longitude={location.longitude}
          />
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <LocationStatistics 
            locationSlug={slug}
            locationName={location.name}
          />
          <LocationNews 
            locationSlug={slug}
            locationName={location.name}
          />
        </div>
      </section>

      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>
          <p className="mb-4">
            If you'd like to get involved or have suggestions, please contact us at{' '}
            <a href={`mailto:${slug}@streetsupport.net`} className="text-brand-a hover:text-brand-b underline">{slug}@streetsupport.net</a>.
          </p>
          <p>
            We are looking for businesses and organisations to{' '}
            <Link href="/give-help/business-support/" className="text-brand-a hover:text-brand-b underline">support us</Link> so we can keep improving this resource.
          </p>
        </div>
      </section>
    </main>
  );
}
