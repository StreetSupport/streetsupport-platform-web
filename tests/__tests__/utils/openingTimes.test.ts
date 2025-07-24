import { 
  isServiceOpenNow, 
  formatDistance,
  OpeningTimeSlot,
  OpeningStatus 
} from '@/utils/openingTimes';
import type { ServiceWithDistance } from '@/types';

// Mock Date to control time for testing
const mockDate = new Date('2024-01-15T14:30:00.000Z'); // Monday 14:30

describe('openingTimes utilities', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('formatDistance', () => {
    it('formats distance with km away suffix', () => {
      expect(formatDistance(0.5)).toBe('0.5 km away');
      expect(formatDistance(1.0)).toBe('1.0 km away');
      expect(formatDistance(2.5)).toBe('2.5 km away');
    });

    it('handles zero distance', () => {
      expect(formatDistance(0)).toBe('0.0 km away');
    });

    it('handles undefined distance', () => {
      expect(formatDistance(undefined)).toBe('');
    });

    it('handles null distance', () => {
      expect(formatDistance(null as any)).toBe('');
    });

    it('formats large distances correctly', () => {
      expect(formatDistance(10.5)).toBe('10.5 km away');
      expect(formatDistance(15.75)).toBe('15.8 km away');
    });
  });

  describe('isServiceOpenNow', () => {
    const createMockService = (
      openTimes: OpeningTimeSlot[],
      description = 'Test service'
    ): ServiceWithDistance => ({
      id: 'test-service',
      name: 'Test Service',
      category: 'test',
      subCategory: 'test',
      organisation: 'Test Org',
      organisationSlug: 'test-org',
      description,
      openTimes,
      clientGroups: [],
      latitude: 53.4808,
      longitude: -2.2426,
      distance: 1000
    });

    it('returns closed status for service with no opening times', () => {
      const service = createMockService([]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(false);
      expect(status.isAppointmentOnly).toBe(false);
    });

    it('returns open status for service open during current time', () => {
      // Monday (day 0) 9:00-17:00, current time is Monday 14:30
      const service = createMockService([
        { day: 0, start: 900, end: 1700 }
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(true);
      expect(status.isAppointmentOnly).toBe(false);
    });

    it('returns closed status for service closed during current time', () => {
      // Monday (day 0) 9:00-12:00, current time is Monday 14:30
      const service = createMockService([
        { day: 0, start: 900, end: 1200 }
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(false);
      expect(status.isAppointmentOnly).toBe(false);
    });

    it('detects appointment only services from description', () => {
      const service = createMockService(
        [{ day: 0, start: 900, end: 1700 }],
        'Service by appointment only'
      );
      const status = isServiceOpenNow(service);
      
      expect(status.isAppointmentOnly).toBe(true);
    });

    it('handles string time formats', () => {
      const service = createMockService([
        { day: 0, start: '09:00', end: '17:00' }
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(true);
    });

    it('handles mixed time formats (Day/StartTime/EndTime properties)', () => {
      const service = createMockService([
        { Day: 0, StartTime: 900, EndTime: 1700, day: 0, start: 900, end: 1700 }
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(true);
    });

    it('calculates next opening time correctly', () => {
      // Service closed on Monday, opens Tuesday 9:00
      const service = createMockService([
        { day: 1, start: 900, end: 1700 } // Tuesday
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(false);
      expect(status.nextOpen).toEqual({
        day: 'Tuesday',
        time: '09:00'
      });
    });

    it('handles services with unusual hours', () => {
      // Service open late hours (22:00 to 23:59)
      const service = createMockService([
        { day: 0, start: 2200, end: 2359 }
      ]);
      
      // Test at 23:00 (should be open)
      jest.setSystemTime(new Date('2024-01-15T23:00:00.000Z'));
      const status = isServiceOpenNow(service);
      expect(status.isOpen).toBe(true);
    });

    it('handles invalid time formats gracefully', () => {
      const service = createMockService([
        { day: 0, start: 'invalid', end: 'invalid' }
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(false);
      expect(status.isAppointmentOnly).toBe(false);
    });

    it('handles multiple opening times in a day', () => {
      // Service open 9:00-12:00 and 14:00-17:00, current time is 14:30
      const service = createMockService([
        { day: 0, start: 900, end: 1200 },
        { day: 0, start: 1400, end: 1700 }
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(true);
    });

    it('finds next opening when service has multiple days', () => {
      // Service closed Monday, opens Wednesday and Friday
      const service = createMockService([
        { day: 2, start: 900, end: 1700 }, // Wednesday
        { day: 4, start: 1000, end: 1600 }  // Friday
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(false);
      expect(status.nextOpen).toEqual({
        day: 'Wednesday',
        time: '09:00'
      });
    });

    it('handles services open 24/7', () => {
      const service = createMockService([
        { day: 0, start: 0, end: 2359 },
        { day: 1, start: 0, end: 2359 },
        { day: 2, start: 0, end: 2359 },
        { day: 3, start: 0, end: 2359 },
        { day: 4, start: 0, end: 2359 },
        { day: 5, start: 0, end: 2359 },
        { day: 6, start: 0, end: 2359 }
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(true);
    });

    it('handles edge case of opening exactly at current time', () => {
      // Service opens at 14:30 (exactly current time)
      const service = createMockService([
        { day: 0, start: 1430, end: 1700 }
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(true);
    });

    it('handles edge case of closing exactly at current time', () => {
      // Service closes at 14:30 (exactly current time)
      const service = createMockService([
        { day: 0, start: 900, end: 1430 }
      ]);
      const status = isServiceOpenNow(service);
      
      expect(status.isOpen).toBe(false);
    });

    it('handles appointment detection with various keywords', () => {
      const appointmentKeywords = [
        'appointment',
        'referral',
        'call ahead',
        'contact us first',
        'by arrangement',
        'booking required',
        'pre-arranged'
      ];

      appointmentKeywords.forEach(keyword => {
        const service = createMockService(
          [{ day: 0, start: 900, end: 1700 }],
          `Test service ${keyword}`
        );
        const status = isServiceOpenNow(service);
        
        expect(status.isAppointmentOnly).toBe(true);
      });
    });

    it('detects telephone services as appointment only', () => {
      const service = createMockService(
        [{ day: 0, start: 900, end: 1700 }],
        'Telephone support service'
      );
      service.subCategory = 'telephone';
      const status = isServiceOpenNow(service);
      
      expect(status.isAppointmentOnly).toBe(true);
    });

    it('detects medical services as appointment only', () => {
      const service = createMockService(
        [{ day: 0, start: 900, end: 1700 }],
        'Medical service'
      );
      service.category = 'medical';
      service.subCategory = 'gp';
      const status = isServiceOpenNow(service);
      
      expect(status.isAppointmentOnly).toBe(true);
    });
  });
});