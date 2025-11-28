import { SwepData } from '@/types';

/**
 * Check if SWEP is currently active based on datetime range
 */
export function isSwepActive(swepData: SwepData): boolean {
  return swepData.isActive || false;
}
