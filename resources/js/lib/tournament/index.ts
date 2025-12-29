import { TournamentPost } from '@/types/tournaments';

export type TournamentStep =
  | 'announcement'
  | 'registration'
  | 'confirmation'
  | 'tournament'
  | 'finished'
  | 'cancelled';

export function getCurrentStep(tournament: TournamentPost): TournamentStep {
  const now = new Date();

  if (tournament.status === 'cancelled') return 'cancelled';
  if (tournament.status === 'finished') return 'finished';

  const regStart = new Date(tournament.registration_start);
  const regEnd = new Date(tournament.registration_end);
  const start = new Date(tournament.start_date);

  if (tournament.is_published && now < regStart) {
    return 'announcement';
  }

  if (now >= regStart && now <= regEnd) {
    return 'registration';
  }

  if (now > regEnd && now < start) {
    return 'confirmation';
  }

  if (now >= start) {
    return 'tournament';
  }

  return 'announcement';
}

export type StepState = 'done' | 'active' | 'upcoming';

export function getStepState(
  current: TournamentStep,
  step: TimelineKey,
): StepState {
  if (current === 'cancelled') return 'upcoming';

  if (current === 'finished') return 'done';

  const order: TimelineKey[] = [
    'announcement',
    'registration',
    'confirmation',
    'tournament',
  ];

  const currentIndex = order.indexOf(current as TimelineKey);
  const stepIndex = order.indexOf(step);

  if (stepIndex < currentIndex) return 'done';
  if (stepIndex === currentIndex) return 'active';
  return 'upcoming';
}

export const TOURNAMENT_TIMELINE = [
  {
    key: 'announcement',
    label: 'Announcement',
    getDate: (t: TournamentPost) =>
      t.is_published ? new Date(t.registration_start) : null,
  },
  {
    key: 'registration',
    label: 'Registration',
    getDate: (t: TournamentPost) =>
      t.registration_start && t.registration_end
        ? `${t.registration_start} – ${t.registration_end}`
        : null,
  },
  {
    key: 'confirmation',
    label: 'Confirmation',
    getDate: (t: TournamentPost) =>
      t.registration_end && t.start_date
        ? `${t.registration_end} – ${t.start_date}`
        : null,
  },
  {
    key: 'tournament',
    label: 'Tournament',
    getDate: (t: TournamentPost) =>
      t.start_date && t.end_date ? `${t.start_date} – ${t.end_date}` : null,
  },
] as const;

export type TimelineKey = (typeof TOURNAMENT_TIMELINE)[number]['key'];

export function getCountdown(targetDate: string | null) {
  if (!targetDate) return null;

  const now = new Date();
  const target = new Date(targetDate);
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return null;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export function getActiveStepCountdown(
  tournament: TournamentPost,
  currentStep: TournamentStep,
) {
  if (currentStep === 'registration') {
    return getCountdown(tournament.registration_end);
  }

  if (currentStep === 'confirmation') {
    return getCountdown(tournament.start_date);
  }

  return null;
}

export function getTimelineProgress(current: TournamentStep) {
  const order: TournamentStep[] = [
    'announcement',
    'registration',
    'confirmation',
    'tournament',
  ];

  if (current === 'finished') return 100;
  if (current === 'cancelled') return 0;

  const index = order.indexOf(current);
  if (index === -1) return 0;

  return Math.round(((index + 1) / order.length) * 100);
}


export function getRegistrationReminder(tournament: TournamentPost) {
  const now = new Date();
  const end = new Date(tournament.registration_end);

  if (now > end) return null;

  const diff = end.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days <= 0) return 'Registration closes today';
  if (days === 1) return 'Registration closes tomorrow';

  return `Registration closes in ${days} days`;
}
