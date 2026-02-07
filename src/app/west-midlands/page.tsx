export const dynamic = 'force-dynamic';

import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Hero from '@/components/ui/Hero';
import GetInTouchBanner from '@/components/ui/GetInTouchBanner';
import BannerWrapper from '@/components/Banners/BannerWrapper';
import LocationCardsGrid from '@/components/Location/LocationCardsGrid';
import LocationFindHelp from '@/components/Location/LocationFindHelp';
import RegionalStatistics from '@/components/Location/RegionalStatistics';
import NewsGrid from '@/components/News/NewsGrid';
import { generateSEOMetadata } from '@/utils/seo';
import WatsonXChat from '@/components/ui/WatsonXChat';

// Central coordinates for West Midlands region (roughly Sandwell/West Bromwich area)
const WEST_MIDLANDS_CENTRE = {
  latitude: 52.50,
  longitude: -1.85,
  radius: 30, // 30km to cover all 7 locations including Coventry
  limit: 1500 // Higher limit to include all ~1400 services across the region
};

export const metadata = generateSEOMetadata({
  title: 'Street Support West Midlands',
  description: 'A home for Street Support Network in the West Midlands. Find homelessness support services across Birmingham, Coventry, Dudley, Sandwell, Solihull, Walsall, and Wolverhampton.',
  keywords: [
    'West Midlands homelessness support',
    'Birmingham homeless help',
    'Coventry street support',
    'Dudley homeless services',
    'Sandwell homelessness',
    'Solihull street support',
    'Walsall homeless help',
    'Wolverhampton homelessness services',
    'WMCA homelessness taskforce'
  ],
  path: 'west-midlands',
  image: '/assets/img/og/street-support.jpg'
});

const westMidlandsLocations = [
  { name: 'Birmingham', slug: 'birmingham', image: '/assets/img/locations/birmingham.png' },
  { name: 'Coventry', slug: 'coventry', image: '/assets/img/locations/coventry.png' },
  { name: 'Dudley', slug: 'dudley', image: '/assets/img/locations/dudley.png' },
  { name: 'Sandwell', slug: 'sandwell', image: '/assets/img/locations/sandwell.png' },
  { name: 'Solihull', slug: 'solihull', image: '/assets/img/locations/solihull.png' },
  { name: 'Walsall', slug: 'walsall', image: '/assets/img/locations/walsall.png' },
  { name: 'Wolverhampton', slug: 'wolverhampton', image: '/assets/img/locations/wolverhampton.png' }
];

export default async function WestMidlandsPage() {
  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { label: "West Midlands", current: true }
        ]} 
      />

      <Hero
        backgroundImage="/assets/img/home-header-background.png"
        overlayImage="/assets/img/locations/west-midlands.png"
        locationSlug="west-midlands"
        title="Street Support West Midlands"
        subtitle="Connecting people and organisations locally, to tackle homelessness across the West Midlands."
        ctaText="Find Help"
        ctaLink="/find-help"
      />

      <LocationCardsGrid
        locations={westMidlandsLocations}
        title="Select your area"
      />

      {/* Find Help Widget */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Find Support in the West Midlands
            </h2>
            <p className="text-body max-w-3xl mx-auto">
              Search for support services available across the West Midlands region. Use the filters below to find specific types of help.
            </p>
          </div>
          <LocationFindHelp
            locationName="the West Midlands"
            latitude={WEST_MIDLANDS_CENTRE.latitude}
            longitude={WEST_MIDLANDS_CENTRE.longitude}
            radius={WEST_MIDLANDS_CENTRE.radius}
            limit={WEST_MIDLANDS_CENTRE.limit}
          />
        </div>
      </section>

      {/* Campaign Banners - displays active banners for West Midlands */}
      <BannerWrapper locationSlug="west-midlands" />

      {/* Stats Section */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <RegionalStatistics
            locationSlugs={westMidlandsLocations.map(loc => loc.slug)}
            regionName="the West Midlands"
          />
        </div>
      </section>

      {/* News Section */}
      <NewsGrid
        title="Latest News from the West Midlands"
        showSearch={false}
        maxItems={3}
      />

      <GetInTouchBanner email="westmidlands@streetsupport.net" />

      {/* WatsonX Chat for West Midlands */}
      <WatsonXChat />

    </>
  );
}