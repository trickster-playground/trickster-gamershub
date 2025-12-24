'use client';

import Tournaments from '@/actions/App/Http/Controllers/Tournaments';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useInitials } from '@/hooks/use-initials';
import { formatRupiah } from '@/lib/format/currency';
import { dateRange } from '@/lib/format/date';
import { TournamentPost } from '@/types/tournaments';
import { Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import { Infinity } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  tournaments: TournamentPost[];
}

export default function FeaturedTournamentSection({ tournaments }: Props) {
  if (!tournaments?.length) return null;

  const getInitials = useInitials();
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setActiveIndex(api.selectedScrollSnap());

    onSelect();
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const active = tournaments[activeIndex];

  return (
    <div className="mx-auto grid max-w-[1820px] grid-cols-1 gap-6 p-4 lg:grid-cols-12">
      {/* ===== LEFT : FEATURED CAROUSEL ===== */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 py-4 lg:col-span-8">
        <SectionTitle title="Featured Tournament" />

        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="mx-3 overflow-hidden rounded-3xl sm:mx-4"
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
        >
          <CarouselContent>
            {tournaments.map((tournament) => {
              const banner =
                tournament.attachments?.find((a) => a.type === 'banner')
                  ?.path ?? 'https://images4.alphacoders.com/136/1363796.jpeg';

              return (
                <CarouselItem key={tournament.slug}>
                  <Link
                    key={tournament.slug}
                    href={Tournaments.TournamentController.show(
                      tournament.slug,
                    )}
                  >
                    <div
                      className="group relative h-[320px] cursor-pointer overflow-hidden rounded-3xl bg-cover bg-center transition-transform duration-700 hover:scale-[1.02] sm:h-[380px] lg:h-[420px]"
                      style={{ backgroundImage: `url('${banner}')` }}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition duration-700 group-hover:opacity-100" />

                      {/* Organizer */}
                      <div className="absolute top-3 left-3 z-10 rounded-xl bg-black/40 px-2.5 py-2 ring-1 ring-white/10 backdrop-blur-md sm:top-4 sm:left-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-9 ring-1 ring-white/20 sm:size-11">
                            <AvatarImage
                              src={tournament.user.avatar?.path}
                              alt={tournament.user.name}
                            />
                            <AvatarFallback>
                              {getInitials(tournament.user.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="hidden leading-tight sm:block">
                            <p className="text-sm font-semibold text-white">
                              {tournament.user.name}
                            </p>
                            <p className="text-xs text-white/60">
                              @{tournament.user.username}
                            </p>
                          </div>
                        </div>
                      </div>

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
                      <div className="relative z-10 flex h-full flex-col justify-end p-4 text-white sm:p-6 lg:p-8">
                        <span className="mb-2 w-fit rounded-full bg-blue-600/90 px-3 py-1 text-[10px] font-bold tracking-wide shadow-lg sm:text-xs">
                          NEW
                        </span>

                        <h3 className="max-w-full text-xl leading-tight font-extrabold drop-shadow-lg sm:max-w-[85%] sm:text-2xl lg:text-3xl">
                          {tournament.title}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] text-white/80 sm:mb-5 sm:gap-2 sm:text-xs lg:mb-0">
                          <span className="rounded-full bg-white/10 px-3 py-1">
                            {tournament.location === 'online'
                              ? 'Online'
                              : 'Offline'}
                          </span>

                          <span className="rounded-full bg-white/10 px-3 py-1 capitalize">
                            {tournament.mode}
                          </span>

                          <span className="rounded-full bg-white/10 px-3 py-1 capitalize">
                            {tournament.format}
                          </span>

                          <span className="rounded-full bg-blue-500/20 px-3 py-1 font-semibold text-blue-300">
                            {tournament.max_participants ?? 'Unlimited'} Slots
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-5">
            {tournaments.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,1)] sm:w-7'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </Carousel>
      </div>

      {/* ===== RIGHT : INFO PANEL (SYNCED) ===== */}
      <div className="mx-auto flex w-full flex-col gap-4 py-4 lg:col-span-4">
        <SectionTitle title="Tournament Information" />

        <div className="relative mx-4 flex h-full flex-col overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-black text-white backdrop-blur-sm">
          <Glow />

          {/* Header */}
          <div className="relative z-10 border-b border-white/10 p-5">
            <p className="text-xs font-bold tracking-widest text-blue-400 uppercase">
              Latest Tournament
            </p>
            <h3 className="mt-1 text-lg font-extrabold uppercase">
              {active.title}
            </h3>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-2 gap-3 p-4">
            <Stat
              label="Prize Pool"
              value={
                active.prize_pool ? (
                  formatRupiah(active.prize_pool)
                ) : (
                  <div className="text-xl">Dynamic prize pool</div>
                )
              }
              highlight
            />
            <Stat
              label="Registered Participants"
              value={
                active.max_participants ? (
                  `${active.current_participants} / ${active.max_participants}`
                ) : (
                  <span className="flex items-center gap-1">
                    {active.current_participants} /
                    <Infinity className="size-8" />
                  </span>
                )
              }
              highlight
            />
            <Stat
              label="Registration Date"
              value={dateRange(
                active.registration_start,
                active.registration_end,
              )}
            />
            <Stat
              label="Tournament Date"
              value={dateRange(active.start_date, active.end_date)}
            />
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between p-5">
            <StatusBadge status={active.status} />

            <Link
              href={Tournaments.TournamentController.show(active.slug)}
              className="text-sm font-bold uppercase transition hover:text-blue-400"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="relative mb-6 ml-4 flex items-center gap-4">
      <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
      <h2 className="text-2xl font-bold tracking-wider text-white">{title}</h2>
    </div>
  );
}

function Glow() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_20%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorDot = status === 'ongoing' ? 'bg-red-500' : 'bg-blue-400 ';
  const colorText = status === 'ongoing' ? 'text-red-500 ' : 'text-blue-400 ';

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 animate-pulse rounded-full ${colorDot}`} />
      <span className={`text-sm font-bold uppercase ${colorText}`}>
        {status}
      </span>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-blue-500/40 hover:bg-blue-500/5">
      <p className="text-xs font-bold text-white/50">{label}</p>
      <p
        className={`mt-1 font-extrabold ${
          highlight ? 'text-2xl text-blue-400' : 'text-sm text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
