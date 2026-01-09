import type { ServiceWithDistance } from '@/types';

export interface OpeningTimeSlot {
  day: number;
  start: number;
  end: number;
  // We don't use these 3 properties below, but they were defined before. 
  // So we keep them for now.
  Day?: number;
  StartTime?: number | string;
  EndTime?: number | string;
}

export interface OpeningStatus {
  isOpen: boolean;
  isAppointmentOnly: boolean;
  nextOpen?: {
    day: string;
    time: string;
  };
}

// Database uses Monday-first indexing: 0=Monday, 1=Tuesday, ..., 6=Sunday
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function normalizeOpeningTime(slot: OpeningTimeSlot) {
  const dayValue = slot.Day ?? slot.day;
  const startValue = slot.StartTime ?? slot.start;
  const endValue = slot.EndTime ?? slot.end;
  
  return {
    day: typeof dayValue === 'number' ? dayValue : parseInt(dayValue as string, 10),
    start: startValue,
    end: endValue
  };
}

function formatTime(time: number | string): string {
  if (typeof time === 'string') return time;
  if (typeof time !== 'number') return 'N/A';
  const timeStr = time.toString().padStart(4, '0');
  return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
}

function timeToMinutes(time: number | string): number {
  if (typeof time === 'string') {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  if (typeof time !== 'number') return 0;
  const timeStr = time.toString().padStart(4, '0');
  const hours = parseInt(timeStr.slice(0, 2), 10);
  const minutes = parseInt(timeStr.slice(2), 10);
  return hours * 60 + minutes;
}

export function isServiceOpenNow(service: ServiceWithDistance): OpeningStatus {
  const isAppointmentOnly = isAppointmentOnlyService(service);
  
  if (!service.openTimes || service.openTimes.length === 0) {
    return { isOpen: false, isAppointmentOnly };
  }

  const now = new Date();
  // Convert JavaScript day (0=Sunday) to database day (0=Monday)
  const jsDay = now.getDay();
  const currentDay = (jsDay + 6) % 7;  // JS 0(Sun)->6, JS 1(Mon)->0, etc.
  const currentMinutes = now.getHours() * 60 + now.getMinutes();


  // Check if currently open
  for (const slot of service.openTimes) {
    const normalized = normalizeOpeningTime(slot as OpeningTimeSlot);
    
    
    if (normalized.day === currentDay) {
      const startMinutes = timeToMinutes(normalized.start);
      const endMinutes = timeToMinutes(normalized.end);
      
      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        return { isOpen: true, isAppointmentOnly };
      }
    }
  }

  // Find next opening time
  const sortedSlots = service.openTimes
    .map(slot => normalizeOpeningTime(slot as OpeningTimeSlot))
    .filter(slot => slot.day !== undefined && slot.start !== undefined)
    .sort((a, b) => {
      // Sort by day, with current day and later days first
      // Add 7 to days earlier in the week to represent next week
      const dayA = a.day >= currentDay ? a.day : a.day + 7;
      const dayB = b.day >= currentDay ? b.day : b.day + 7;
      
      if (dayA !== dayB) return dayA - dayB;
      
      // Same day, sort by time
      return timeToMinutes(a.start) - timeToMinutes(b.start);
    });

  // Find next opening
  for (const slot of sortedSlots) {
    const slotDay = slot.day >= currentDay ? slot.day : slot.day + 7;
    const slotMinutes = timeToMinutes(slot.start);
    
    // If it's today and the time hasn't passed, or it's a future day
    if (slotDay > currentDay || (slotDay === currentDay && slotMinutes > currentMinutes)) {
      // Database day directly maps to DAYS array index (0=Monday, 1=Tuesday, ..., 6=Sunday)
      return {
        isOpen: false,
        isAppointmentOnly,
        nextOpen: {
          day: DAYS[slot.day],
          time: formatTime(slot.start)
        }
      };
    }
  }

  // If we get here, use the first slot of next week
  if (sortedSlots.length > 0) {
    const nextSlot = sortedSlots[0];
    // Database day directly maps to DAYS array index (0=Monday, 1=Tuesday, ..., 6=Sunday)
    return {
      isOpen: false,
      isAppointmentOnly,
      nextOpen: {
        day: DAYS[nextSlot.day],
        time: formatTime(nextSlot.start)
      }
    };
  }

  return { isOpen: false, isAppointmentOnly };
}

function isAppointmentOnlyService(service: ServiceWithDistance): boolean {
  // Check for telephone/phone-only services
  if (service.isAppointmentOnly || service.subCategory === 'telephone') {
    return true;
  }
  
  // Check for appointment-related keywords in description
  const appointmentKeywords = [
    'appointment',
    'referral',
    'call ahead',
    'contact us first',
    'by arrangement',
    'booking required',
    'pre-arranged'
  ];
  
  const description = service.description?.toLowerCase() || '';
  const hasAppointmentKeyword = appointmentKeywords.some(keyword => 
    description.includes(keyword)
  );
  
  // Medical services are typically appointment-based
  const appointmentCategories = ['medical'];
  const appointmentSubCategories = ['gp', 'counselling', 'mental-health', 'dentist'];
  
  const isMedicalAppointment = appointmentCategories.includes(service.category) &&
    appointmentSubCategories.includes(service.subCategory);
  
  return hasAppointmentKeyword || isMedicalAppointment;
}

export function formatDistance(distance?: number): string {
  if (distance === undefined || distance === null) return '';
  return `${distance.toFixed(1)} km away`;
}