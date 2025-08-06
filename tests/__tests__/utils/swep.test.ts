/**
 * @jest-environment jsdom
 */

import { isSwepActive, formatSwepActivePeriod, parseSwepBody } from '@/utils/swep';
import { SwepData } from '@/types';

describe('SWEP Utilities', () => {
  describe('isSwepActive', () => {
    beforeEach(() => {
      // Mock current date to 2024-01-16 12:00:00 UTC
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-16T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns true when current time is within SWEP active period', () => {
      const swepData: SwepData = {
        id: 'test-1',
        locationSlug: 'manchester',
        title: 'Test SWEP',
        body: 'Test body',
        shortMessage: 'Test message',
        swepActiveFrom: '2024-01-15T18:00:00Z',
        swepActiveUntil: '2024-01-18T09:00:00Z'
      };

      expect(isSwepActive(swepData)).toBe(true);
    });

    it('returns false when current time is before SWEP active period', () => {
      const swepData: SwepData = {
        id: 'test-1',
        locationSlug: 'manchester',
        title: 'Test SWEP',
        body: 'Test body',
        shortMessage: 'Test message',
        swepActiveFrom: '2024-01-17T18:00:00Z',
        swepActiveUntil: '2024-01-20T09:00:00Z'
      };

      expect(isSwepActive(swepData)).toBe(false);
    });

    it('returns false when current time is after SWEP active period', () => {
      const swepData: SwepData = {
        id: 'test-1',
        locationSlug: 'manchester',
        title: 'Test SWEP',
        body: 'Test body',
        shortMessage: 'Test message',
        swepActiveFrom: '2024-01-10T18:00:00Z',
        swepActiveUntil: '2024-01-15T09:00:00Z'
      };

      expect(isSwepActive(swepData)).toBe(false);
    });

    it('returns true when current time exactly matches start time', () => {
      jest.setSystemTime(new Date('2024-01-15T18:00:00Z'));
      
      const swepData: SwepData = {
        id: 'test-1',
        locationSlug: 'manchester',
        title: 'Test SWEP',
        body: 'Test body',
        shortMessage: 'Test message',
        swepActiveFrom: '2024-01-15T18:00:00Z',
        swepActiveUntil: '2024-01-18T09:00:00Z'
      };

      expect(isSwepActive(swepData)).toBe(true);
    });

    it('returns true when current time exactly matches end time', () => {
      jest.setSystemTime(new Date('2024-01-18T09:00:00Z'));
      
      const swepData: SwepData = {
        id: 'test-1',
        locationSlug: 'manchester',
        title: 'Test SWEP',
        body: 'Test body',
        shortMessage: 'Test message',
        swepActiveFrom: '2024-01-15T18:00:00Z',
        swepActiveUntil: '2024-01-18T09:00:00Z'
      };

      expect(isSwepActive(swepData)).toBe(true);
    });
  });

  describe('formatSwepActivePeriod', () => {
    it('formats SWEP active period correctly', () => {
      const swepData: SwepData = {
        id: 'test-1',
        locationSlug: 'manchester',
        title: 'Test SWEP',
        body: 'Test body',
        shortMessage: 'Test message',
        swepActiveFrom: '2024-01-15T18:00:00Z',
        swepActiveUntil: '2024-01-18T09:00:00Z'
      };

      const result = formatSwepActivePeriod(swepData);
      expect(result).toMatch(/SWEP is currently active from .+ until .+/);
      expect(result).toContain('15 January');
      expect(result).toContain('18 January');
      expect(result).toContain('18:00');
      expect(result).toContain('09:00');
    });

    it('handles different date formats', () => {
      const swepData: SwepData = {
        id: 'test-1',
        locationSlug: 'manchester',
        title: 'Test SWEP',
        body: 'Test body',
        shortMessage: 'Test message',
        swepActiveFrom: '2024-12-25T23:30:00Z',
        swepActiveUntil: '2024-12-26T08:15:00Z'
      };

      const result = formatSwepActivePeriod(swepData);
      expect(result).toContain('25 December');
      expect(result).toContain('26 December');
      expect(result).toContain('23:30');
      expect(result).toContain('08:15');
    });
  });

  describe('parseSwepBody', () => {
    it('decodes basic HTML entities', () => {
      const body = 'This &lt;div&gt; contains &amp; symbols &quot;quoted&quot; text';
      const result = parseSwepBody(body);
      expect(result).toBe('This <div> contains & symbols "quoted" text');
    });

    it('handles apostrophes and quotes', () => {
      const body = "It&#39;s a &quot;great&quot; day";
      const result = parseSwepBody(body);
      expect(result).toBe('It\'s a "great" day');
    });

    it('handles complex HTML content', () => {
      const body = '&lt;p&gt;Emergency support &amp; accommodation available.&lt;/p&gt;';
      const result = parseSwepBody(body);
      expect(result).toBe('<p>Emergency support & accommodation available.</p>');
    });

    it('returns unchanged text when no entities present', () => {
      const body = 'This is plain text with no entities';
      const result = parseSwepBody(body);
      expect(result).toBe(body);
    });

    it('handles empty string', () => {
      const result = parseSwepBody('');
      expect(result).toBe('');
    });
  });
});