import { TournamentPost } from '@/types/tournaments';

import MapOverview from '@/components/customs/display/ui/leaflet/map-overview';
import { formatDateRange } from '@/lib/format/date';
import {
  getCurrentStep,
  getRegistrationReminder,
  getStepState,
  getTimelineProgress,
  StepState,
  TOURNAMENT_TIMELINE,
} from '@/lib/tournament';
import InfoSection from './info-section';
import OrganizerSection from './organizer-section';

function TimelineStep({
  label,
  state,
  date,
  isLast,
}: {
  label: string;
  state: StepState;
  date?: string | null;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-4">
      {/* Line */}
      {!isLast && (
        <span
          className={`absolute top-4 left-[6px] h-full w-px ${
            state === 'done'
              ? 'bg-green-400/60'
              : state === 'active'
                ? 'bg-blue-400/60'
                : 'bg-white/20'
          }`}
        />
      )}

      {/* Dot */}
      <span
        className={`relative z-10 mt-1 h-3 w-3 rounded-full ${
          state === 'done'
            ? 'bg-green-400'
            : state === 'active'
              ? 'animate-pulse bg-blue-400 ring-4 ring-blue-400/20'
              : 'bg-white/30'
        }`}
      />

      {/* Content */}
      <div className="space-y-0.5">
        <span
          className={`text-sm leading-snug ${
            state === 'active'
              ? 'font-semibold text-white'
              : state === 'done'
                ? 'text-white/80'
                : 'text-white/40'
          }`}
        >
          {label}
        </span>

        {date && (
          <span
            className={`block text-xs ${
              state === 'active' ? 'text-white/60' : 'text-white/30'
            }`}
          >
            {date}
          </span>
        )}
      </div>
    </div>
  );
}

function TimelineProgress({ value }: { value: number }) {
  return (
    <div className="space-y-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-blue-400 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="text-[10px] text-white/40">{value}% completed</div>
    </div>
  );
}

interface TournamentTabOverviewProps {
  tournament: TournamentPost;
}

const TournamentTabOverview = ({ tournament }: TournamentTabOverviewProps) => {
  const max = tournament.max_participants;
  const current = tournament.current_participants ?? 0;

  const slotsLeft = typeof max === 'number' ? Math.max(max - current, 0) : null;

  return (
    <div className="grid gap-10 md:grid-cols-3">
      {/* MAIN */}
      <div className="space-y-10 md:col-span-2">
        <section>
          <h3 className="mb-3 text-xs font-semibold tracking-widest text-white uppercase">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-white/65">
            {tournament.description
              ? tournament.description
              : tournament.category.description}
          </p>
        </section>
        <section>
          <h3 className="mb-3 text-xs font-semibold tracking-widest text-white uppercase">
            Location
          </h3>

          {/* Text location */}
          {tournament.location && (
            <p className="mb-3 text-sm text-white/65">{tournament.location}</p>
          )}

          {tournament.coordinates && (
            <div className="h-[500px] w-full rounded-lg border">
              <MapOverview
                tournamentCoords={tournament.coordinates}
                locationName={tournament.location}
              />
            </div>
          )}

          {tournament.coordinates && (
            <div className="flex justify-end">
              <a
                href={`https://www.google.com/maps?q=${tournament.coordinates.lat},${tournament.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-blue-400 hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
          )}

          {/* Fallback */}
          {!tournament.location && !tournament.coordinates && (
            <p className="text-sm text-white/40 italic">
              Location not specified
            </p>
          )}
        </section>

        <section>
          <h3 className="mb-3 text-xs font-semibold tracking-widest text-white uppercase">
            Game Rules
          </h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-white/60">
            <li>Mode of play will be standard</li>
            <li>All players must be logged in to Entiate</li>
            <li>Players have 5 minutes to join the pre-game lobby</li>
          </ul>
        </section>
      </div>
      <div className="space-y-6">
        {/* Timeline */}
        <InfoSection title="Timeline">
          {(() => {
            const currentStep = getCurrentStep(tournament);
            const progress = getTimelineProgress(currentStep);

            const reminder =
              currentStep === 'registration'
                ? getRegistrationReminder(tournament)
                : null;

            return (
              <div className="space-y-4">
                {/* Progress */}
                <TimelineProgress value={progress} />

                {/* Registration Reminder */}
                {reminder && (
                  <div className="rounded-md bg-blue-400/10 px-3 py-2 text-xs text-blue-400">
                    🔔 {reminder}
                  </div>
                )}

                {/* Timeline Steps */}
                <div className="space-y-6 pt-2">
                  {TOURNAMENT_TIMELINE.map((step, index) => (
                    <TimelineStep
                      key={step.key}
                      label={step.label}
                      state={getStepState(currentStep, step.key)}
                      date={
                        step.getDate
                          ? formatDateRange(step.getDate(tournament))
                          : null
                      }
                      isLast={index === TOURNAMENT_TIMELINE.length - 1}
                    />
                  ))}
                </div>

                {/* Final State */}
                {currentStep === 'finished' && (
                  <div className="pt-2 text-xs font-medium text-green-400">
                    Tournament has ended
                  </div>
                )}

                {currentStep === 'cancelled' && (
                  <div className="pt-2 text-xs font-medium text-red-400">
                    Tournament cancelled
                  </div>
                )}
              </div>
            );
          })()}
        </InfoSection>

        {/* Players */}
        <InfoSection title="Participants">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Confirmed</span>
              <span className="font-semibold text-white">
                {tournament.current_participants}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Slots Left</span>
              <span className="font-semibold text-blue-400">
                {slotsLeft !== null ? slotsLeft : 'Unlimited'}
              </span>
            </div>
          </div>
        </InfoSection>

        {/* Admin */}
        <InfoSection title="Organized By">
          <div className="space-y-3">
            <OrganizerSection
              name={tournament.user.name}
              username={tournament.user.username}
              avatar={tournament.user.avatar?.path || ''}
            />
          </div>
        </InfoSection>
      </div>
    </div>
  );
};

export default TournamentTabOverview;
