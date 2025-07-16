import { LocationProvider } from '@/contexts/LocationContext';
import FindHelpPageClient from './FindHelpPageClient';

export default async function FindHelpPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <LocationProvider>
      <FindHelpPageClient searchParams={searchParams} />
    </LocationProvider>
  );
}
