import { useId } from 'react';
import Script from 'next/script';

interface StructuredDataProps {
  data: object;
}

export default function StructuredData({ data }: StructuredDataProps) {
  const id = useId();
  return (
    <Script
      id={`structured-data-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
      strategy="afterInteractive"
    />
  );
}
