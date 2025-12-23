import { TournamentPost } from '@/types/tournaments';

interface FeaturedTournamentCardProps {
  tournaments: TournamentPost[];
}

const FeaturedTournamentCard = ({
  tournaments,
}: FeaturedTournamentCardProps) => {
  return (
    <>
      <div className="mx-auto grid max-w-[1820px] grid-cols-1 gap-6 p-4 lg:grid-cols-12">
        {/* ===== Featured Tournament ===== */}
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 py-4 lg:col-span-8">
          <div className="relative mb-6 ml-4 flex items-center gap-4">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            <h2 className="text-2xl font-bold tracking-wider text-white">
              Featured Tournament
            </h2>
          </div>

          <div
            className="relative mx-4 h-[410px] overflow-hidden rounded-2xl bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images4.alphacoders.com/136/1363796.jpeg')",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
              <span className="mb-2 w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">
                NEW
              </span>

              <h3 className="text-2xl font-bold">
                Valorant Champions Tour 2024
              </h3>

              <p className="mt-1 text-sm text-white/80">
                Global Tournament • BO5 • LAN Event
              </p>
            </div>
          </div>
        </div>

        {/* ===== Right Info  ===== */}

        <div className="mx-auto flex w-full flex-col gap-4 py-4 lg:col-span-4">
          <div className="relative mb-6 ml-4 flex items-center gap-4">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            <h2 className="text-2xl font-bold tracking-wider text-white">
              Tournament Information
            </h2>
          </div>

          <div className="relative mx-4 flex h-full flex-col overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-black text-white backdrop-blur-sm">
            {/* Blue Glow Top */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_20%)]" />

            {/* Soft Fade Bottom */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 p-5">
              <p className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                Latest Tournament
              </p>
              <h3 className="mt-1 text-lg leading-tight font-extrabold uppercase">
                Valorant Champions
                <br />
                Tour 2024
              </h3>
            </div>

            {/* Core Stats */}
            <div className="relative z-10 grid grid-cols-2 gap-3 p-4">
              {[
                { label: 'Prize Pool', value: '$50K', highlight: true },
                { label: 'Format', value: 'BO5' },
                { label: 'Start Date', value: '12 Oct 2024' },
                { label: 'Type', value: 'LAN EVENT' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-blue-500/40 hover:bg-blue-500/5"
                >
                  <p className="text-xs font-bold text-white/50">
                    {item.label}
                  </p>
                  <p
                    className={`mt-1 font-extrabold ${
                      item.highlight
                        ? 'text-2xl text-blue-400'
                        : 'text-sm text-white'
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="relative z-10 flex items-center justify-between p-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                <span className="text-sm font-bold tracking-wide text-red-500 uppercase">
                  Live Now
                </span>
              </div>

              <button className="text-sm font-bold tracking-wide text-white uppercase transition hover:text-blue-400">
                View Details →
              </button>
            </div>
          </div>
        </div>

        {/* ===== All Tournaments ===== */}
        <div className="mx-auto w-full py-10 lg:col-span-12">
          <div className="relative mb-6 flex items-center gap-4">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            <h2 className="text-2xl font-bold tracking-wider text-white">
              All Tournament
            </h2>
          </div>

          <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div
                key={i}
                className="group relative mx-auto h-[320px] w-full overflow-hidden rounded-3xl"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://images4.alphacoders.com/136/1363796.jpeg')",
                  }}
                />

                {/* Diagonal Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/60 to-transparent" />

                {/* blue Accent Slash */}
                <div className="absolute top-0 -left-20 h-full w-40 rotate-12 bg-blue-600/20 blur-2xl" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                  {/* Status */}
                  <span className="mb-3 w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-extrabold tracking-wider uppercase">
                    Upcoming
                  </span>

                  {/* Title */}
                  <h3 className="text-xl leading-tight font-extrabold uppercase">
                    Regional
                    <br />
                    Valorant Cup
                  </h3>

                  {/* Meta */}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/70">
                    <span>SEA</span>
                    <span>•</span>
                    <span>16 Teams</span>
                    <span>•</span>
                    <span>12 Oct 2024</span>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-extrabold text-blue-500">
                      $10K
                    </span>

                    <span className="text-sm font-bold text-white/80 uppercase transition group-hover:text-blue-500">
                      View →
                    </span>
                  </div>
                </div>

                {/* Border Glow */}
                <div className="absolute inset-0 rounded-3xl border border-white/10 transition group-hover:border-blue-500/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturedTournamentCard;
