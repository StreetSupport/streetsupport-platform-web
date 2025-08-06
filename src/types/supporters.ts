/**
 * Type definitions for supporter/partner organisation data
 */

export interface Supporter {
  name: string;
  displayName: string;
  logoPath: string | null;
  url: string;
}

export interface SupportersData {
  [locationSlug: string]: Supporter[];
}

export interface SupporterLogosProps {
  locationSlug: string;
  className?: string;
}