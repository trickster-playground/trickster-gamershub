/**
 * Components Home
 */
import Blog from '@/components/home/Blog';
import Brand from '@/components/home/Brand';
import Feature from '@/components/home/Feature';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import Overview from '@/components/home/Overview';
import Process from '@/components/home/Process';
import Review from '@/components/home/Review';

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
      <Head title="GamersHub">
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
            <Brand />
            <Feature />
            <Process />
            <Overview />
            <Review />
            <Blog />
          </main>
        </div>
      </ReactLenis>
    </>
  );
}
