import React, { ReactNode } from 'react';
import Script from 'next/script'; // import Script component
import './globals.css';

import Nav from '../components/partials/Nav';
import { LocationProvider } from '../contexts/LocationContext';
import { SearchNavigationProvider } from '../contexts/SearchNavigationContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Street Support</title>
        {/* Load Google Maps JS API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker&map_ids=8364b1415f1ab88dc38e401b`}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <LocationProvider>
          <SearchNavigationProvider>
            <Nav />
            {children}
          </SearchNavigationProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
