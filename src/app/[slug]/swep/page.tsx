import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import locations from '@/data/locations.json';
import { generateLocationSEOMetadata } from '@/utils/seo';
import SwepPageContent from '@/components/SwepPageContent';

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

  return <SwepPageContent locationSlug={slug} locationName={location.name} />;
}