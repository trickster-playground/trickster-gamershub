'use client';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { dateRange } from '@/lib/format/date';
import { TournamentPost } from '@/types/tournaments';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useState } from 'react';

interface Props {
  tournaments: TournamentPost[];
}

export default function FeaturedTournamentSection({ tournaments }: Props) {
  if (!tournaments?.length) return null;

  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    setActiveIndex(api.selectedScrollSnap());

    api.on('select', () => {
      setActiveIndex(api.selectedScrollSnap());
    });
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
          className="mx-4 rounded-2xl overflow-hidden"
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
                  <div
                    className="relative h-[410px] overflow-hidden rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url('${banner}')` }}
                  >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
                      <span className="mb-2 w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">
                        FEATURED
                      </span>

                      <h3 className="text-2xl font-bold">{tournament.title}</h3>

                      <div className="mt-1 flex gap-2 text-sm text-white/80 capitalize">
                        <span>{tournament.category?.name}</span>
                        <span>•</span>
                        <span>{tournament.location || 'Online Event'}</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Dots */}
          <div className="absolute right-4 bottom-4 z-20 flex gap-2">
            {tournaments.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === activeIndex
                    ? 'scale-110 bg-blue-500'
                    : 'bg-white/40 hover:bg-white/70'
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
              value={active.prize_pool ? `$${active.prize_pool}` : '-'}
              highlight
            />
            <Stat
              label="Max Participants"
              value={active.max_participants ?? '-'}
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

            <a
              href={`/tournaments/${active.slug}`}
              className="text-sm font-bold uppercase transition hover:text-blue-400"
            >
              View Details →
            </a>
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
  value: string | number;
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
