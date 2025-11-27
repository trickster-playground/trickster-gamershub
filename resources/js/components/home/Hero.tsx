/**
 * Components
 */
import ReactPlayer from 'react-player';
import { AspectRatio } from '../ui/aspect-ratio';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

/**
 * Assets
 */
import { heroBanner } from '@/assets';
import { CirclePlay } from 'lucide-react';

/**
 * Constants
 */
import { heroData } from '@/constants';

/**
 * Node Modules
 */
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  Variants,
} from 'motion/react';
import { useRef } from 'react';

/**
 * Framer Motion Variants
 */
const heroVariant: Variants = {
  start: {},
  end: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const heroChildVariant: Variants = {
  start: {
    y: 30,
    opacity: 0,
    filter: 'blur(5px)',
  },
  end: {
    y: 0,
    opacity: 1,
    filter: 'blur(0)',
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
};

const Hero = () => {
  const heroBannerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroBannerRef,
    offset: ['start 1080px', '50% start'],
  });

  const scrollYTransform = useTransform(scrollYProgress, [0, 1], [0.85, 1.15]);

  const scale = useSpring(scrollYTransform, {
    stiffness: 300,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section className="py-10 md:py-16">
      <motion.div
        variants={heroVariant}
        initial="start"
        animate="end"
        className="container text-center"
      >
        <div className="mx-auto max-w-screen-md">
          <motion.p
            variants={heroChildVariant}
            className="mx-auto mb-6 max-w-max rounded-full border-t border-b border-white/50 bg-primary px-3 py-1 text-sm tracking-wider text-secondary-foreground uppercase backdrop-blur-3xl md:mb-10"
          >
            {heroData.sectionSubtitle}
          </motion.p>

          <motion.h1
            variants={heroChildVariant}
            className="mb-4 text-4xl !leading-tight font-semibold md:mb-5 md:text-5xl lg:text-6xl"
          >
            {heroData.sectionTitle}
            <span className="relative isolate ms-4">
              {heroData.decoTitle}
              <span className="absolute top-2 -right-4 bottom-0.5 -left-6 -z-10 ms-3 rounded-full border-t border-primary/20 bg-primary px-8 shadow-[inset_0px_0px_30px_0px] shadow-primary/20 md:top-3 md:bottom-1 lg:top-4 lg:bottom-2"></span>
            </span>
          </motion.h1>

          <motion.p
            variants={heroChildVariant}
            className="text-foreground/70 md:text-xl"
          >
            {heroData.sectionText}
          </motion.p>

          <motion.div
            variants={heroChildVariant}
            className="mt-6 flex justify-center gap-2 md:mt-10"
          >
            <Button className="cursor-pointer">Start Free Trial</Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="cursor-pointer" variant={'ghost'}>
                  <CirclePlay /> Watch Demo
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-[640px] overflow-hidden p-0 xl:max-w-[1000px]">
                <AspectRatio ratio={16 / 9}>
                  <ReactPlayer
                    src="https://www.youtube.com/watch?v=LXb3EKWsInQ"
                    style={{
                      minWidth: '100%',
                      maxWidth: '100%',
                      minHeight: '100%',
                      maxHeight: '100%',
                    }}
                  />
                </AspectRatio>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        <div className="relative isolate mx-auto mt-12 max-w-screen-xl rounded-xl md:mt-16">
          <motion.figure
            className="overflow-hidden rounded-xl border border-slate-800 bg-background/60 shadow-2xl backdrop-blur-3xl"
            initial={{
              y: 120,
              opacity: 0,
              filter: 'blur(5px)',
            }}
            animate={{
              y: 0,
              opacity: 1,
              filter: 'blur(0)',
            }}
            transition={{
              duration: 1.5,
              delay: 0.5,
              ease: 'backInOut',
            }}
            ref={heroBannerRef}
            style={{ scale }}
          >
            <img
              src={heroBanner}
              width={1468}
              height={815}
              alt="GamersHub Dashboard"
            />
          </motion.figure>

          {/* Blurry Glow Effect */}
          <motion.div
            className="absolute inset-5 -z-10 bg-primary blur-[50px]"
            initial={{
              scale: 0.8,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: 'backInOut',
            }}
          ></motion.div>
          <motion.div
            className="absolute inset-0 -z-10 scale-x-125 scale-y-75 rounded-full bg-primary blur-[200px]"
            initial={{
              scale: 0.4,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 2,
              delay: 1.5,
              ease: 'backOut',
            }}
          ></motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
