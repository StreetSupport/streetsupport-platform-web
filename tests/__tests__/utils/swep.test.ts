/**
 * @jest-environment jsdom
 */

import { isSwepActive } from '@/utils/swep';
import { SwepData } from '@/types';

describe('SWEP Utilities', () => {
  describe('isSwepActive', () => {
    const baseSwepData: SwepData = {
      id: 'test-1',
      locationSlug: 'manchester',
      title: 'Test SWEP',
      body: 'Test body',
      shortMessage: 'Test message',
      swepActiveFrom: '2024-01-15T18:00:00Z',
      swepActiveUntil: '2024-01-18T09:00:00Z',
      isActive: false,
      createdAt: '2024-01-15T12:00:00Z',
      updatedAt: '2024-01-15T12:00:00Z',
      createdBy: 'admin',
    };

    it('returns true when isActive flag is true', () => {
      const swepData = { ...baseSwepData, isActive: true };
      expect(isSwepActive(swepData)).toBe(true);
    });

    it('returns false when isActive flag is false', () => {
      const swepData = { ...baseSwepData, isActive: false };
      expect(isSwepActive(swepData)).toBe(false);
    });

    it('returns false when isActive is undefined', () => {
      const swepData = { ...baseSwepData } as SwepData;
      delete (swepData as Partial<SwepData>).isActive;
      expect(isSwepActive(swepData as SwepData)).toBe(false);
    });
  });
});
