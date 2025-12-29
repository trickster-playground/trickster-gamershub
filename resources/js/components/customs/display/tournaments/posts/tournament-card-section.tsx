import Tournaments from '@/actions/App/Http/Controllers/Tournaments';
import { formatRupiah } from '@/lib/format/currency';
import { absoluteDate } from '@/lib/format/date';
import { TournamentPost } from '@/types/tournaments';
import { Link } from '@inertiajs/react';

interface TournamentCardSectionProps {
  tournaments: {
    data: TournamentPost[];
  };
}

const TournamentCardSection = ({ tournaments }: TournamentCardSectionProps) => {
  return (
    <div className="mx-auto grid max-w-[1820px] grid-cols-1 gap-6 p-4 lg:grid-cols-12">
      <div className="mx-auto w-full py-10 lg:col-span-12">
        {/* Header */}
        <div className="relative mb-6 flex items-center gap-4">
          <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
          <h2 className="text-2xl font-bold tracking-wider text-white">
            All Tournament
          </h2>
        </div>

        {/* Cards */}
        <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {tournaments.data.map((tournament) => (
            <Link
              key={tournament.id}
              href={Tournaments.TournamentController.show(tournament.slug)}
            >
              <div className="group relative mx-auto h-[350px] w-full cursor-pointer overflow-hidden rounded-3xl bg-black">
                {/* Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${
                      tournament.attachments?.[0]?.path ??
                      '/images/tournament-placeholder.jpg'
                    })`,
                  }}
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/20" />
                <div className="absolute top-0 -left-24 h-full w-48 rotate-12 bg-blue-600/20 blur-3xl" />

                {/* Category */}
                <div
                  className="absolute top-3 right-3 z-10 rounded-full px-3 py-1 text-[11px] font-bold text-white shadow-xl ring-1 ring-white/20 sm:top-4 sm:right-4 sm:text-xs"
                  style={{
                    backgroundColor: tournament.category.color,
                    boxShadow: `0 0 18px ${tournament.category.color}80`,
                  }}
                >
                  {tournament.category.name}
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white sm:p-6">
                  {/* Badges */}
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold tracking-wide uppercase">
                    <span className="rounded-full bg-blue-600 px-3 py-1">
                      {tournament.status}
                    </span>
                    <span className="rounded-full bg-red-600 px-3 py-1 capitalize">
                      {tournament.format}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="line-clamp-2 max-w-[60%] text-lg leading-snug font-extrabold uppercase sm:text-xl">
                    {tournament.title}
                  </h3>

                  {/* Meta */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70 capitalize sm:text-sm">
                    <span>
                      {tournament.location === 'online' ? 'Online' : 'Offline'}
                    </span>
                    <span className="opacity-50">•</span>
                    <span>{tournament.mode}</span>
                    <span className="opacity-50">•</span>
                    <span>
                      {tournament.max_participants ?? 'Unlimited'} Slots
                    </span>
                    <span className="opacity-50">•</span>
                    <span>{absoluteDate(tournament.start_date)}</span>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-end justify-between gap-4">
                    {/* Prize Pool */}
                    {tournament.prize_pool ? (
                      <span className="text-lg font-extrabold text-blue-400 sm:text-xl">
                        {formatRupiah(tournament.prize_pool)}
                      </span>
                    ) : (
                      <div className="text-xs leading-tight font-semibold text-blue-400/90 sm:text-sm">
                        Dynamic prize pool
                        <div className="text-[10px] text-white/50 sm:text-xs">
                          Based on registrations
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <span className="flex items-center gap-1 text-xs font-bold tracking-wide text-white/80 uppercase transition-all group-hover:translate-x-1 group-hover:text-blue-400 sm:text-sm">
                      View
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>

                {/* Border */}
                <div className="absolute inset-0 rounded-3xl border border-white/10 transition group-hover:border-blue-500/40" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentCardSection;
