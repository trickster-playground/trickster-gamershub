import { useEffect, useState } from "react";

// Single date
export function absoluteDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Date range schedule
export function dateRange(
  start: Date | string,
  end: Date | string,
  locale = 'en-US',
) {
  const s = new Date(start);
  const e = new Date(end);

  const sameMonth =
    s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();

  if (sameMonth) {
    return `${s.toLocaleDateString(locale, {
      month: 'long',
      day: 'numeric',
    })} – ${e.toLocaleDateString(locale, {
      day: 'numeric',
    })}, ${e.getFullYear()}`;
  }

  return `${s.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })} – ${e.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

export function createdAt(date: Date | string, locale = 'en-US') {
  const d = new Date(date);

  const absolute = d.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const relative = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
  });

  const diffMs = d.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return { absolute, relative: relative.format(diffDays, 'day') };
}

export function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isOver: false,
  };
}

export function useCountdown(target: string) {
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return time;
}
