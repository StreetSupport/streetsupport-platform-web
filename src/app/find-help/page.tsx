import { Metadata } from 'next';
import { LocationProvider } from '@/contexts/LocationContext';
import FindHelpPageClient from './FindHelpPageClient';
import { generateSEOMetadata } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateSEOMetadata({
    title: 'Find Help',
    description: 'Search for homelessness support services near you. Find emergency accommodation, food, advice, and other essential services for people experiencing homelessness.',
    keywords: [
      'find homeless services',
      'homeless support near me',
      'emergency accommodation',
      'food banks',
      'homeless advice',
      'crisis support',
      'rough sleeping help',
      'homelessness services UK'
    ],
    path: 'find-help',
    image: '/assets/img/og/street-support.jpg',
    imageAlt: 'Find Help - Street Support Network'
  });
}

export default async function FindHelpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <LocationProvider>
      <FindHelpPageClient searchParams={resolvedSearchParams} />
    </LocationProvider>
  );
}
