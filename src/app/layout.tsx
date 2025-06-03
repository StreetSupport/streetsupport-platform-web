import React, { ReactNode } from 'react';

import './globals.css'; // now resolves to src/app/globals.css

import Nav from '../components/partials/Nav';
import { LocationProvider } from '../contexts/LocationContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LocationProvider>
          <Nav />
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}
