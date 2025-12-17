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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
/**
 * Types
 */
import { SharedData, type BreadcrumbItem } from '@/types';
import { TournamentCategory } from '@/types/tournaments';

/**
 * Assets
 */
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tournaments',
    href: tournaments().url,
  },
];

export default function TournamentPage() {
  const { auth, flash } = usePage<SharedData>().props;

  const { tournamentCategories } = usePage<{
    tournamentCategories: TournamentCategory[];
  }>().props;

  return (
    <CustomAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tournaments" />

      <div className="mx-auto grid max-w-[1820px] grid-cols-1 gap-6 p-4 lg:grid-cols-12">
        {/* ================= LEFT COLUMN (8) ================= */}
        <div className="flex flex-col pt-5 gap-4 lg:col-span-8">
          {/* Game Categories */}
          <div className="mx-auto w-full max-w-7xl">
            <div className="relative mb-6 ml-4 flex items-center gap-4">
              <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
              <h2 className="text-2xl font-bold tracking-wider text-white">
                Game Categories
              </h2>
            </div>

            <div className="mx-auto flex items-center justify-center">
              <Carousel
                opts={{ loop: true }}
                className="relative w-fit lg:max-w-5xl"
              >
                <CarouselContent className="-ml-4">
                  {tournamentCategories.map((category) => (
                    <CarouselItem
                      key={category.id}
                      className="basis-1/3 pl-4 xs:basis-1/5 sm:basis-1/6 md:basis-1/8 lg:basis-1/10"
                    >
                      <div className="group flex cursor-pointer flex-col items-center gap-2">
                        <div
                          tabIndex={0}
                          className="relative flex w-fit items-center justify-center overflow-hidden rounded-2xl bg-dark-1 transition-transform duration-300 group-hover:scale-105 focus-visible:scale-105"
                        >
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="aspect-square h-30 w-30 object-contain"
                          />

                          {/* Smart overlay */}
                          <div className="pointer-events-none absolute inset-0 flex items-end justify-center rounded-xl bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                            <span className="mx-2 mb-3 translate-y-2 text-xs font-semibold text-white transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                              {category.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="ml-9 md:ml-8 xl:ml-0" />
                <CarouselNext className="mr-9 md:mr-8 xl:mr-0" />
              </Carousel>
            </div>
          </div>

          {/* Live Match */}
          <div className="mx-auto w-full max-w-7xl py-4">
            <div className="relative mb-6 ml-4 flex items-center gap-4">
              <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
              <h2 className="text-2xl font-bold tracking-wider text-white">
                Live Match
              </h2>
            </div>

            <div
              className="relative mx-4 h-[559px] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images2.alphacoders.com/474/thumb-1920-474206.jpg')",
              }}
            >
              {/* Background Overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* LIVE Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                LIVE
              </div>

              {/* Viewer Count */}
              <div className="absolute top-4 right-4 z-10 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                👁 12.4K Watching
              </div>

              {/* Center Content */}
              <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 text-white">
                {/* Match Title */}
                <h1 className="text-2xl font-bold tracking-widest text-white uppercase">
                  The International 2025
                </h1>
                <p className="text-sm tracking-wider text-white/80 uppercase">
                  Upper Bracket R1 • BO 3
                </p>

                {/* Teams */}
                <div className="flex items-center gap-24">
                  {/* Left Team */}
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src="https://cdn.prod.website-files.com/637f8005cf82256ba6e57888/6659089be982b2f42abae527_VintageEG-p-500.png"
                      alt="Evil Geniuses"
                      className="h-24 w-24 rounded-full"
                    />
                    <span className="font-semibold">Evil Geniuses</span>
                  </div>

                  {/* Score */}
                  <div className="text-7xl font-extrabold tracking-wide">
                    0 : 0
                  </div>

                  {/* Right Team */}
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src="https://cdn.prod.website-files.com/64bf6e8cda9043babe7ca006/65f44cd1a36d0e7ade30289b_Crest-on-dark.svg"
                      alt="Team Liquid"
                      className="h-24 w-24 rounded-full"
                    />
                    <span className="font-semibold">Team Liquid</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant={'outline'}
                  className="group z-20 mt-4 flex items-center gap-2 rounded-lg bg-black/50 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-blue-600"
                >
                  <span className="text-blue-600 group-hover:text-white">
                    ●
                  </span>
                  Watch Live
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR (4) ================= */}

        <div className="h-full pt-5 lg:col-span-4">
          <div className="relative mb-6 flex items-center gap-4">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            <h2 className="text-2xl font-bold tracking-wider text-white">
              Live Match
            </h2>
          </div>

          <div className="flex flex-col gap-5">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-black p-4 transition hover:border-blue-500/40"
              >
                {/* blue Accent */}
                <div className="absolute top-0 left-0 h-full w-1 bg-blue-600" />

                {/* Match Info */}
                <div className="mb-4 text-center">
                  <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
                    Upper Bracket • BO3
                  </p>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between">
                  {/* Team Left */}
                  <div className="flex items-center gap-3">
                    <img
                      src="https://cdn.prod.website-files.com/637f8005cf82256ba6e57888/6659089be982b2f42abae527_VintageEG-p-500.png"
                      alt="Evil Geniuses"
                      className="size-10 rounded-full border border-white/10"
                    />
                    <span className="text-sm font-extrabold text-white uppercase">
                      Evil Geniuses
                    </span>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-white/50">VS</span>
                    <span className="text-xl font-extrabold text-white">
                      0 : 0
                    </span>
                  </div>

                  {/* Team Right */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-white uppercase">
                      Team Liquid
                    </span>
                    <img
                      src="https://cdn.prod.website-files.com/64bf6e8cda9043babe7ca006/65f44cd1a36d0e7ade30289b_Crest-on-dark.svg"
                      alt="Team Liquid"
                      className="size-10 rounded-full border border-white/10"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                  <span>Starting Soon</span>
                  <span className="font-semibold text-blue-500">
                    Live Today
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= TOURNAMENT SECTION ================= */}
      <div className="mx-auto grid max-w-[1820px] grid-cols-1 gap-6 p-4 lg:grid-cols-12">
        {/* ===== Latest Tournament ===== */}
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 py-4 lg:col-span-8">
          <div className="relative mb-6 ml-4 flex items-center gap-4">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            <h2 className="text-2xl font-bold tracking-wider text-white">
              Latest Tournament
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

        {/* ===== Right Info (Blue Esports Luxury) ===== */}
        <div className="mx-auto flex w-full flex-col gap-4 py-4 lg:col-span-4">
          <div className="relative mb-6 ml-4 flex items-center gap-4">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            <h2 className="text-2xl font-bold tracking-wider text-white">
              All Tournament
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
          <div className="relative mb-6  flex items-center gap-4">
            <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
            <h2 className="text-2xl font-bold tracking-wider text-white">
              All Tournament
            </h2>
          </div>

          <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <div
                key={i}
                className="group relative h-[320px] overflow-hidden rounded-3xl mx-auto w-full"
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
    </CustomAppLayout>
  );
}
