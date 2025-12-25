/**
 * Node Modules
 */
import { Head, Link, usePage } from '@inertiajs/react';

/**
 * Routes
 */

/**
 * Layouts
 */
import CustomAppLayout from '@/layouts/customs/custom-app-layout';

/**
 *  Components
 */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/**
 * Types
 */
import { Button } from '@/components/ui/button';
import { TournamentPost } from '@/types/tournaments';
import { Cog, SlashIcon } from 'lucide-react';

/**
 * Assets
 */
import { TournamentCountdown } from '@/components/customs/display/tournaments/posts/tournament-countdown';
import { useCountdown } from '@/lib/format/date';

function MetaBadge({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 backdrop-blur">
      {icon}
      <div className="leading-tight">
        <p className="text-[10px] tracking-wide text-white/60 uppercase">
          {label}
        </p>
        <p className="text-xs font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default function TournamentsShow() {
  const { tournament } = usePage<{ tournament: TournamentPost }>().props;

  const banner =
    tournament.attachments?.find((a) => a.type === 'banner')?.path ??
    'https://images4.alphacoders.com/136/1363796.jpeg';

  const { days, hours, minutes } = useCountdown(tournament.start_date);

  const statusColor = {
    draft: 'bg-blue-500/20 text-blue-300',
    upcoming: 'bg-blue-500/20 text-blue-300',
    ongoing: 'bg-green-500/20 text-green-300',
    finished: 'bg-gray-500/20 text-gray-300',
    cancelled: 'bg-blue-500/20 text-blue-300',
  }[tournament.status];

  return (
    <CustomAppLayout>
      <Head title={tournament.title} />

      <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-3 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Overview</h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/tournaments">Tournaments</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{tournament.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Button className="comic-button !h-12 !w-35 text-base">
            <Cog className="size-5" />
            Manage
          </Button>
        </div>

        {/* Banner */}
        <div className="relative h-[clamp(240px,38vw,420px)] overflow-hidden rounded-2xl">
          <img
            src={banner}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-10">
            {/* TOP */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={tournament.category.icon}
                  className="h-15 w-15 rounded-sm bg-black/40 p-2"
                />

                <div>
                  <p className="text-xs tracking-widest text-blue-400 uppercase">
                    {tournament.category.name}
                  </p>
                  <h1 className="text-2xl font-extrabold lg:text-4xl">
                    {tournament.title}
                  </h1>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-blue-400 uppercase">Prize Pool</p>
                <p className="text-2xl font-extrabold lg:text-3xl">
                  {tournament.prize_pool
                    ? `₹${tournament.prize_pool.toLocaleString()}`
                    : 'TBA'}
                </p>
              </div>
            </div>

            {/* BOTTOM */}
            <div className="flex justify-end">
              <TournamentCountdown startDate={tournament.start_date} />
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-30 mt-6 flex items-center justify-between border-b border-white/10 bg-background/80 backdrop-blur">
          <div className="flex gap-6">
            {['Overview', 'Matches', 'Players', 'Results'].map((tab) => (
              <button
                key={tab}
                className="pb-3 text-sm font-medium text-white/60 hover:text-white data-[active=true]:border-b-2 data-[active=true]:text-white"
              >
                {tab}
              </button>
            ))}
          </div>

          <Button variant="outline">View Brackets</Button>
        </div>
      </div>
    </CustomAppLayout>
  );
}
