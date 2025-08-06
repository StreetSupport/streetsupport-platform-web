import { SwepData } from '@/types';
import { isSwepActive } from './swep';

export async function fetchSwepData(locationSlug: string): Promise<SwepData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/locations/${locationSlug}/swep`, {
      // Use ISR for better performance
      next: { revalidate: 300 } // 5 minutes
    });

    if (!response.ok) {
      console.warn(`Failed to fetch SWEP data for ${locationSlug}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.status === 'success' && data.data.swep) {
      return data.data.swep;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching SWEP data for ${locationSlug}:`, error);
    return null;
  }
}

export async function getActiveSwepData(locationSlug: string): Promise<SwepData | null> {
  const swepData = await fetchSwepData(locationSlug);
  
  // Only return if SWEP is currently active
  if (swepData && isSwepActive(swepData)) {
    return swepData;
  }
  
  return null;
}