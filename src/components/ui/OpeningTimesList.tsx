import { formatOpeningTimesByDay } from '@/utils/formatOpeningTimes';

interface Props {
  openTimes: Array<{ day: number; start: number; end: number }>;
  className?: string;
}

export default function OpeningTimesList({ openTimes, className = 'list-disc pl-5 text-sm !text-black' }: Props) {
  const formattedDays = formatOpeningTimesByDay(openTimes);

  return (
    <ul className={className}>
      {formattedDays.map(({ day, timeRanges }) => (
        <li key={day}>{day}: {timeRanges}</li>
      ))}
    </ul>
  );
}
