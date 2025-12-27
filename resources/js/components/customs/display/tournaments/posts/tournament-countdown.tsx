import { useCountdown } from '@/lib/format/date';
import { Timer } from 'lucide-react';

function CountdownUnit({
  value,
  label,
  highlight = false,
}: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex w-[64px] flex-col items-center rounded-lg border px-2 py-2 ${
        highlight
          ? 'border-blue-500 bg-blue-600/50 text-white'
          : 'border-white/10 bg-dark-3/80 text-white'
      }`}
    >
      <span className="text-lg font-bold tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] tracking-wide text-white/50 uppercase">
        {label}
      </span>
    </div>
  );
}

export function TournamentCountdown({ startDate }: { startDate: string }) {
  const { days, hours, minutes, seconds, isOver } = useCountdown(startDate);

  if (isOver) {
    return (
      <div className="rounded-lg border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-white flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
        LIVE NOW
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Timer size={25} className="text-white" />

      <div className="flex gap-2">
        <CountdownUnit value={days} label="Days" />
        <CountdownUnit value={hours} label="Hours" />
        <CountdownUnit value={minutes} label="Min" />
        <CountdownUnit value={seconds} label="Sec" highlight />
      </div>
    </div>
  );
}
