import { SwepData } from '@/types';

/**
 * Check if SWEP is currently active based on datetime range
 */
export function isSwepActive(swepData: SwepData): boolean {
  return swepData.isActive || false;
}

/**
 * Format SWEP active period for display with appropriate status
 * Examples:
 * - "SWEP is currently active from 15 January 2023 until 18 January 2023" (currently active)
 * - "SWEP will be active from 15 January 2023 until 18 January 2023" (scheduled)
 * - "SWEP was active from 10 January 2023 until 12 January 2023" (ended)
 * - "SWEP is scheduled to start on 15 January 2023" (future start date)
 * - "SWEP was active until 12 January 2023" (past end date)
 * - "Active period not specified" (no dates)
 */
export function formatSwepActivePeriod(swepData: SwepData): string {
  // Show only dates without hours and minutes
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Normalize to start of day for date comparison

  // Handle different combinations of dates
  if (swepData.swepActiveFrom && swepData.swepActiveUntil) {
    const activeFrom = new Date(swepData.swepActiveFrom);
    const activeUntil = new Date(swepData.swepActiveUntil);
    activeFrom.setHours(0, 0, 0, 0);
    activeUntil.setHours(23, 59, 59, 999); // End of day
    
    const fromString = activeFrom.toLocaleDateString('en-GB', formatOptions);
    const untilString = activeUntil.toLocaleDateString('en-GB', formatOptions);
    
    if (now < activeFrom) {
      return `SWEP will be active from ${fromString} until ${untilString}`;
    } else if (now > activeUntil) {
      return `SWEP was active from ${fromString} until ${untilString}`;
    } else {
      return `SWEP is currently active from ${fromString} until ${untilString}`;
    }
  } else {
    return 'Active period not specified';
  }
}

/**
 * Parse HTML content from CMS - handles basic HTML decoding
 */
export function parseSwepBody(body: string): string {
  // Basic HTML entity decoding - extend as needed
  return body
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}