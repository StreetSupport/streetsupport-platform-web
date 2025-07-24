'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { clearSearchState } from '@/utils/findHelpStateUtils';

/**
 * Component that handles cleanup of Find Help search state when users navigate
 * away from the Find Help flow to non-organisation pages
 */
export default function FindHelpStateCleanup() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Clear search state if navigating away from Find Help flow
    // Keep state only for:
    // - /find-help (main search page)
    // - /find-help/organisation/[slug] (organisation pages)
    const isInFindHelpFlow = pathname === '/find-help' || 
                           pathname.startsWith('/find-help/organisation/');
    
    if (!isInFindHelpFlow) {
      clearSearchState();
    }
  }, [pathname]);
  
  // This component renders nothing
  return null;
}