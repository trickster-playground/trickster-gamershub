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
import { Network } from 'lucide-react';

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

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-12 max-w-[1820px] mx-auto">
        {/* ================= LEFT COLUMN (8) ================= */}
        <div className="flex flex-col gap-4 lg:col-span-8">
          {/* Game Categories */}
          <div className="p-4">
            <h2 className="group mb-4 ml-10 flex w-fit items-center gap-2 text-2xl font-bold text-white">
              <Network
                size={25}
                className="cursor-pointer group-hover:animate-spin"
              />
              Game Categories
            </h2>

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
          <div className="mx-auto w-full max-w-6xl rounded-xl py-4">
            <h2 className="mb-3 ml-4 text-2xl font-bold text-white">
              Live Match 🔥
            </h2>

            <div className="mx-4 flex h-96 items-center justify-center rounded-xl bg-red text-white">
              Live match content
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR (4) ================= */}

        <div className="h-full pt-5 lg:col-span-4">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-white">
              Upcoming Match
            </h2>

            <div className="flex flex-col gap-5">
              <div className="h-25 rounded-lg bg-red" />
              <div className="h-25 rounded-lg bg-red" />
              <div className="h-25 rounded-lg bg-red" />
              <div className="h-25 rounded-lg bg-red" />
              <div className="h-25 rounded-lg bg-red" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TOURNAMENT SECTION ================= */}
      <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-12 max-w-[1820px] mx-auto">
        {/* ===== Latest Tournament ===== */}
        <div className="flex flex-col gap-4 lg:col-span-8 max-w-6xl w-full mx-auto py-4">
          <h2 className="text-2xl font-bold text-white mb-3 ml-4">Latest Tournament 🔥</h2>

          <div className="flex h-96 items-center justify-center rounded-xl bg-red text-white mx-4">
            Latest Tournament content
          </div>
        </div>

        {/* ===== Right Info / Filter ===== */}
        <div className="flex flex-col gap-4 lg:col-span-4 py-4">
          <h2 className="text-2xl font-bold text-white mb-3">Tournament Info</h2>

          <div className="h-40 rounded-xl bg-red" />
          <div className="h-40 rounded-xl bg-red" />
        </div>

        {/* ===== All Tournaments ===== */}
        <div className="lg:col-span-12 py-4 mx-auto w-full">
          <h2 className="mb-4 text-2xl font-bold text-white ml-11 py-4">All Tournaments</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mx-11">
            <div className="h-48 w-full rounded-xl bg-red" />
            <div className="h-48 w-full rounded-xl bg-red" />
            <div className="h-48 w-full rounded-xl bg-red" />
            <div className="h-48 w-full rounded-xl bg-red" />
            <div className="h-48 w-full rounded-xl bg-red" />
          </div>
        </div>
      </div>
    </CustomAppLayout>
  );
}
