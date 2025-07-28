import React, { ReactNode } from 'react';
import './globals.css';

import Nav from '../components/partials/Nav';
import SiteFooter from '../components/partials/SiteFooter';
import CustomHead from '../components/Head/Head';
import { LocationProvider } from '../contexts/LocationContext';
import FindHelpStateCleanup from '../components/FindHelp/FindHelpStateCleanup';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <CustomHead />
      <body>
        <LocationProvider>
          <FindHelpStateCleanup />
          <Nav />
          {children}
          <SiteFooter />
        </LocationProvider>
      </body>
    </html>
  );
}
