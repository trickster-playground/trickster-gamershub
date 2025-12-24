/**
 * Node Modules
 */
import { Head, usePage } from '@inertiajs/react';

/**
 * Routes
 */
import { tournaments } from '@/routes/';

/**
 * Layouts
 */
import CustomAppLayout from '@/layouts/customs/custom-app-layout';

/**
 *  Components
 */
/**
 * Types
 */
import { formatRupiah } from '@/lib/format/currency';
import { absoluteDate } from '@/lib/format/date';
import { type BreadcrumbItem } from '@/types';
import { TournamentPost } from '@/types/tournaments';

/**
 * Assets
 */

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tournaments',
    href: tournaments().url,
  },
];

export default function TournamentsShow() {
  const { tournament } = usePage<{ tournament: TournamentPost }>().props;

  const banner =
    tournament.attachments?.find((a) => a.type === 'banner')?.path ??
    'https://images4.alphacoders.com/136/1363796.jpeg';

  return (
    <CustomAppLayout breadcrumbs={breadcrumbs}>
      <Head title={tournament.title} />

      {/* HERO */}
      <section className="relative h-[420px] overflow-hidden rounded-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${banner})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end p-6 text-white">
          <span
            className="mb-3 w-fit rounded-full px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: tournament.category.color }}
          >
            {tournament.category.name}
          </span>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            {tournament.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/80">
            <span>{tournament.location}</span>
            <span>•</span>
            <span>{absoluteDate(tournament.start_date)}</span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-xl font-extrabold text-blue-400">
              {tournament.prize_pool
                ? formatRupiah(tournament.prize_pool)
                : 'Dynamic Prize Pool'}
            </span>

            <button className="rounded-xl bg-blue-600 px-6 py-2 font-bold hover:bg-blue-700">
              Register
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT */}
        <div className="space-y-8 lg:col-span-8">
          <div>
            <h2 className="mb-3 text-xl font-bold text-white">Overview</h2>
            <p className="text-white/80">
              {tournament.description ?? 'No description provided.'}
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-bold text-white">Rules</h2>
            {/* nanti bisa markdown */}
          </div>
        </div>

        {/* RIGHT (STICKY) */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
            <h3 className="mb-4 text-lg font-bold text-white">
              Tournament Info
            </h3>

            <ul className="space-y-3 text-sm text-white/80">
              <li>Status: {tournament.status}</li>
              <li>Format: {tournament.format}</li>
              <li>Mode: {tournament.mode}</li>
              <li>Slots: {tournament.max_participants ?? 'Unlimited'}</li>
            </ul>

            <button className="mt-6 w-full rounded-xl bg-blue-600 py-2 font-bold hover:bg-blue-700">
              Register Now
            </button>
          </div>
        </aside>
      </section>
    </CustomAppLayout>
  );
}
