import { SwepData } from '@/types';

/**
 * Check if SWEP is currently active based on datetime range
 */
export function isSwepActive(swepData: SwepData): boolean {
  return swepData.isActive || false;
}

/**
 * Format SWEP active period for display
 * e.g. "SWEP is currently active from 4 August 18:00 until 6 August 09:00"
 */
export function formatSwepActivePeriod(swepData: SwepData): string {
  const activeFrom = new Date(swepData.swepActiveFrom);
  const activeUntil = new Date(swepData.swepActiveUntil);
  
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  const fromString = activeFrom.toLocaleDateString('en-GB', formatOptions);
  const untilString = activeUntil.toLocaleDateString('en-GB', formatOptions);
  
  return `SWEP is currently active from ${fromString} until ${untilString}`;
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