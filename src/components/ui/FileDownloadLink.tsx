'use client';

import { trackFileDownload } from '@/components/analytics/GoogleAnalytics';

interface FileDownloadLinkProps {
  href: string;
  fileName: string;
  fileType: string;
  context?: string;
  className?: string;
  children: React.ReactNode;
}

export default function FileDownloadLink({ 
  href, 
  fileName, 
  fileType, 
  context, 
  className = '',
  children 
}: FileDownloadLinkProps) {
  return (
    <a 
      href={href}
      target="_blank" 
      rel="noopener noreferrer"
      onClick={() => trackFileDownload(fileName, fileType, context)}
      className={className}
    >
      {children}
    </a>
  );
}