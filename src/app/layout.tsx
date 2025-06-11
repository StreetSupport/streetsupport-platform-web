import React, { ReactNode } from 'react';
import Script from 'next/script';
import type { Metadata, Viewport } from 'next';
import './globals.css';

import Nav from '../components/partials/Nav';
import { LocationProvider } from '../contexts/LocationContext';

export const metadata: Metadata = {
  title: { default: 'Street Support', template: '%s | Street Support' },
  description:
    'Connecting people and organisations locally to tackle homelessness.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=marker&map_ids=8364b1415f1ab88dc38e401b`}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <LocationProvider>
          <Nav />
          {children}
        </LocationProvider>
      </body>
    </html>
  );
}
