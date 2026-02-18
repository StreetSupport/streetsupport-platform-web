interface FormattedDay {
  day: string;
  timeRanges: string;
}

export function formatOpeningTimesByDay(
  openTimes: Array<{ day: number; start: number; end: number }>
): FormattedDay[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayGroups = new Map<string, Array<{ start: string; end: string }>>();

  for (const slot of openTimes) {
    const dayIndex = Number(slot.day);
    if (dayIndex < 0 || dayIndex > 6) continue;

    const dayName = days[dayIndex];
    if (!dayGroups.has(dayName)) dayGroups.set(dayName, []);

    dayGroups.get(dayName)!.push({
      start: formatTime(Number(slot.start)),
      end: formatTime(Number(slot.end)),
    });
  }

  return days
    .filter(day => dayGroups.has(day))
    .map(day => ({
      day,
      timeRanges: dayGroups.get(day)!
        .map(s => `${s.start} \u2013 ${s.end}`)
        .join(', '),
    }));
}

function formatTime(time: number): string {
  if (isNaN(time)) return '00:00';
  const str = time.toString().padStart(4, '0');
  return `${str.slice(0, 2)}:${str.slice(2)}`;
}
