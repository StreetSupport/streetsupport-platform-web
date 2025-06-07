'use client';

import { LocationProvider } from '@/contexts/LocationContext';
import FindHelpEntry from '@/components/FindHelp/FindHelpEntry';
import FindHelpResults from '@/components/FindHelp/FindHelpResults';
import rawProviders from '@/data/service-providers.json';

export default function FindHelpPage() {
  const providers = rawProviders as any[];

  return (
    <LocationProvider>
      <div>
        <FindHelpEntry />
        <FindHelpResults providers={providers} />
      </div>
    </LocationProvider>
  );
}
