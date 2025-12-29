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
import {
  Cog,
  GitPullRequest,
  SlashIcon,
  Ticket,
  User,
  Users,
} from 'lucide-react';

/**
 * Assets
 */
import TournamentTabOverview from '@/components/customs/display/tournaments/posts/show/overview/tabs-overview';
import { TournamentCountdown } from '@/components/customs/display/tournaments/posts/tournament-countdown';
import { useState } from 'react';

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
    <div className="flex items-center gap-2 px-3 py-2">
      {icon}
      <div className="leading-tight">
        <p className="text-xs tracking-wide text-blue-400 uppercase">
          {label}
        </p>
        <p className="text-base font-semibold">{value}</p>
      </div>
    </div>
  );
}

export default function TournamentsShow() {
  const { tournament } = usePage<{ tournament: TournamentPost }>().props;

  const banner =
    tournament.attachments?.find((a) => a.type === 'banner')?.path ??
    'https://images4.alphacoders.com/136/1363796.jpeg';

  const tabs = ['Overview', 'Matches', 'Players', 'Results'];
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <CustomAppLayout>
      <Head title={tournament.title} />

      <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-3 space-y-4 py-8">
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
        <div className="relative h-[clamp(240px,38vw,420px)] overflow-hidden rounded-2xl border">
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
                  <h1 className="line-clamp-2 max-w-[80%] text-2xl font-extrabold lg:text-4xl">
                    {tournament.title}
                  </h1>
                </div>
              </div>

              <div className="text-right">
                <p className="text-base text-blue-400 uppercase">Prize Pool</p>
                <p className="text-2xl font-extrabold lg:text-3xl">
                  {tournament.prize_pool
                    ? `₹${tournament.prize_pool.toLocaleString()}`
                    : 'TBA'}
                </p>
              </div>
            </div>

            {/* BOTTOM */}
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <MetaBadge
                  icon={
                    tournament.mode === 'team' ? (
                      <Users size={20} />
                    ) : (
                      <User size={20} />
                    )
                  }
                  label={tournament.format}
                  value={
                    tournament.mode === 'team'
                      ? `${tournament.team_size} vs ${tournament.team_size}`
                      : 'Solo'
                  }
                />
                <MetaBadge
                  icon={<Ticket size={20} />}
                  label="Entry"
                  value={
                    tournament.registration_fee
                      ? `₹${tournament.registration_fee}`
                      : 'Free'
                  }
                />
              </div>
              <TournamentCountdown startDate={tournament.start_date} />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 pb-20">
          <div className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between p-2">
              {/* Tabs */}
              <div className="flex gap-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    data-active={tab === activeTab}
                    onClick={() => setActiveTab(tab)}
                    className="relative pb-2 text-sm font-medium text-white/60 transition hover:text-white data-[active=true]:text-white"
                  >
                    {tab}

                    {/* Active underline */}
                    <span className="absolute -bottom-px left-0 h-[2px] w-full scale-x-0 bg-blue-500 transition-transform data-[active=true]:scale-x-100" />
                  </button>
                ))}
              </div>

              {/* Action */}
              <Button
                variant="outline"
                className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <GitPullRequest />
                View Brackets
              </Button>
            </div>
          </div>

          <div className="mt-8">
            {activeTab === 'Overview' && (
              <TournamentTabOverview tournament={tournament} />
            )}
          </div>
        </div>
      </div>
    </CustomAppLayout>
  );
}
