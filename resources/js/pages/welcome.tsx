/**
 * Components Section
 */
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';

/**
 * Inertia React
 */
import { Head, usePage } from '@inertiajs/react';

/**
 * Hooks
 */
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Types
 */
import { type SharedData } from '@/types';

/**
 * Node Modules
 */
import { ReactLenis } from 'lenis/react';

export default function Welcome({
  canRegister = true,
}: {
  canRegister?: boolean;
}) {
  const { auth } = usePage<SharedData>().props;
  const isMobile = useIsMobile();

  return (
    <>
      <Head title="Welcome">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=mona-sans:400,500,600"
          rel="stylesheet"
        />
      </Head>
      <ReactLenis root>
        <div className="relative isolate overflow-hidden">
          <Header />
          <main>
            <Hero />
          </main>
        </div>
      </ReactLenis>
    </>
  );
}
