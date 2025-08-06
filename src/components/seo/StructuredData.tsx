import Script from 'next/script';

interface StructuredDataProps {
  data: object;
}

/**
 * Component to render structured data as JSON-LD
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <Script
      id={`structured-data-${Math.random().toString(36).substr(2, 9)}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
      strategy="beforeInteractive"
    />
  );
}