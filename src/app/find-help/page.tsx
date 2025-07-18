import { LocationProvider } from '@/contexts/LocationContext';
import FindHelpPageClient from './FindHelpPageClient';

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
