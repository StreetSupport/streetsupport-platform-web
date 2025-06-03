'use client';

import { LocationProvider } from '@/contexts/LocationContext';
import FindHelpEntry from '@/components/FindHelp/FindHelpEntry';
import FindHelpResults from '@/components/FindHelp/FindHelpResults';

export default function FindHelpPage() {
  console.log('[FindHelpPage] Rendering...');

  return (
    <LocationProvider>
      <div>
        <FindHelpEntry />
        <FindHelpResults />
      </div>
    </LocationProvider>
  );
}
