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
import { Card, CardContent } from '@/components/ui/card';
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

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tournaments',
    href: tournaments().url,
  },
];

export default function TournamentPage() {
  const { auth, flash } = usePage<SharedData>().props;

  return (
    <CustomAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tournaments" />

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-12">
        <div className="order-2 col-span-12 flex h-full w-full flex-col gap-4 overflow-x-auto rounded-xl border border-red p-4 md:order-1 md:col-span-1 lg:order-1 lg:col-span-8">
          <div className="flex w-full items-center justify-center px-18">
            <Carousel
              opts={{
                loop: true,
              }}
              className="relative w-full px-18"
            >
              <CarouselContent className='-ml-4'>
                {Array.from({ length: 10 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/5"
                  >
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square size-10 items-center justify-center p-6">
                          <span className="text-3xl font-semibold">
                            {index + 1}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
        <div className="order-1 col-span-12 flex h-full w-full flex-col gap-4 overflow-x-auto rounded-xl border border-red p-4 md:order-1 md:col-span-1 lg:order-1 lg:col-span-4">
          test
        </div>
      </div>
    </CustomAppLayout>
  );
}
