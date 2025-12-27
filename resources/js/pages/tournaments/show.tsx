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
  ArrowBigRight,
  Cog,
  GitPullRequest,
  ShieldCheck,
  SlashIcon,
  Ticket,
  User,
  Users,
} from 'lucide-react';

/**
 * Assets
 */
import UserProfileController from '@/actions/App/Http/Controllers/Users/UserProfileController';
import { TournamentCountdown } from '@/components/customs/display/tournaments/posts/tournament-countdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
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
        <p className="text-[10px] tracking-wide text-white/60 uppercase">
          {label}
        </p>
        <p className="text-xs font-semibold">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <h4 className="mb-4 text-xs font-semibold tracking-widest text-white uppercase">
        {title}
      </h4>

      {children}
    </div>
  );
}

function AdminItem({
  name,
  username,
  avatar,
}: {
  name: string;
  username: string;
  avatar: string;
}) {
  const getInitials = useInitials();
  return (
    <div className="flex items-center justify-between">
      <Link
        href={UserProfileController.show(username)}
        className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-dark-4"
      >
        {/* Avatar placeholder */}
        <Avatar className="size-8 ring-1 ring-white/20 group-hover:ring-blue-500 sm:size-11">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>

        <div className="leading-tight">
          <p className="text-sm font-medium text-white group-hover:text-blue-500">
            {name}
          </p>
          <p className="text-xs text-white/50">@{username}</p>
        </div>
      </Link>

      <ShieldCheck size={16} className="text-blue-400" />
    </div>
  );
}

function Step({
  label,
  status,
}: {
  label: string;
  status: 'open' | 'pending';
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${
          status === 'open' ? 'bg-green-400' : 'bg-white/30'
        }`}
      />
      <span className="text-white/70">{label}</span>
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

  const max = tournament.max_participants;
  const current = tournament.current_participants ?? 0;

  const slotsLeft = typeof max === 'number' ? Math.max(max - current, 0) : null;

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
                <p className="text-xs text-blue-400 uppercase">Prize Pool</p>
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
                      <Users size={16} />
                    ) : (
                      <User size={16} />
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
                  icon={<Ticket size={16} />}
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
              <div className="grid gap-10 md:grid-cols-3">
                {/* MAIN */}
                <div className="space-y-10 md:col-span-2">
                  <section>
                    <h3 className="mb-3 text-xs font-semibold tracking-widest text-white uppercase">
                      About
                    </h3>
                    <p className="text-sm leading-relaxed text-white/65">
                      {tournament.description
                        ? tournament.description
                        : tournament.category.description}
                    </p>
                  </section>
                  <section>
                    <h3 className="mb-4 text-xs font-semibold tracking-widest text-white uppercase">
                      Registration
                    </h3>

                    <div className="flex items-center gap-6 text-sm">
                      <Step label="Registration" status="open" />
                      <ArrowBigRight />
                      <Step label="Confirmation" status="pending" />
                      <ArrowBigRight />
                      <Step label="Seeding" status="pending" />
                    </div>
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
                  {/* Players */}
                  <InfoCard title="Participants">
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
                  </InfoCard>

                  {/* Admin */}
                  <InfoCard title="Organized By">
                    <div className="space-y-3">
                      <AdminItem
                        name={tournament.user.name}
                        username={tournament.user.username}
                        avatar={tournament.user.avatar?.path || ''}
                      />
                    </div>
                  </InfoCard>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomAppLayout>
  );
}
