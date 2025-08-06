'use client';

import { trackFileDownload } from '@/components/analytics/GoogleAnalytics';

interface PDFDownloadLinkProps {
  href: string;
  fileName: string;
  context?: string;
  className?: string;
  children: React.ReactNode;
}

export default function PDFDownloadLink({ 
  href, 
  fileName, 
  context = 'pdf', 
  className = '',
  children 
}: PDFDownloadLinkProps) {
  return (
    <a 
      href={href}
      target="_blank" 
      rel="noopener noreferrer"
      onClick={() => trackFileDownload(fileName, 'pdf', context)}
      className={className}
    >
      {children}
    </a>
  );
}