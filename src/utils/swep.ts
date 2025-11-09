import { SwepData } from '@/types';

/**
 * Check if SWEP is currently active based on datetime range
 */
export function isSwepActive(swepData: SwepData): boolean {
  return swepData.isActive || false;
}

/**
 * Format SWEP active period for display
 * e.g. "SWEP is currently active from 4 August until 6 August"
 * or "SWEP is currently active from 4 August"
 * or "SWEP is currently active until 6 August"
 */
export function formatSwepActivePeriod(swepData: SwepData): string {
  // Show only dates without hours and minutes
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long'
  };
  
  // Handle different combinations of dates
  if (swepData.swepActiveFrom && swepData.swepActiveUntil) {
    // Both dates present
    const activeFrom = new Date(swepData.swepActiveFrom);
    const activeUntil = new Date(swepData.swepActiveUntil);
    const fromString = activeFrom.toLocaleDateString('en-GB', formatOptions);
    const untilString = activeUntil.toLocaleDateString('en-GB', formatOptions);
    return `SWEP is currently active from ${fromString} until ${untilString}`;
  } else if (swepData.swepActiveFrom) {
    // Only start date present
    const activeFrom = new Date(swepData.swepActiveFrom);
    const fromString = activeFrom.toLocaleDateString('en-GB', formatOptions);
    return `SWEP is currently active from ${fromString}`;
  } else if (swepData.swepActiveUntil) {
    // Only end date present
    const activeUntil = new Date(swepData.swepActiveUntil);
    const untilString = activeUntil.toLocaleDateString('en-GB', formatOptions);
    return `SWEP is currently active until ${untilString}`;
  } else {
    // No dates specified
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