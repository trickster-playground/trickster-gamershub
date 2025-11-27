/**
 * Node Modules
 */
import { motion } from 'motion/react';
import ReactPlayer from 'react-player';

/**
 * Framer Motion Variants
 */
import * as variants from '@/lib/motionVariants';

/**
 * Constants
 */
import { overviewData } from '@/constants';

/**
 * Assets
 */
import { overviewBanner } from '@/assets';
import { Play } from 'lucide-react';

/**
 * Components UI
 */
import { AspectRatio } from '../ui/aspect-ratio';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

const Overview = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            className="section-subtitle"
          >
            {overviewData.sectionSubtitle}
          </motion.p>

          <motion.h2
            variants={variants.fadeInUp}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            className="section-title"
          >
            {overviewData.sectionTitle}
          </motion.h2>

          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            className="section-text"
          >
            {overviewData.sectionText}
          </motion.p>
        </div>

        <div>
          <motion.div
            variants={variants.fadeInScale}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            className="relative mx-auto max-w-4xl shadow-xl"
          >
            <figure>
              <img
                src={overviewBanner}
                alt="Overview Banner"
                width={900}
                height={601}
              />
            </figure>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 cursor-pointer"
                >
                  <div className="sr-only">Play Video</div>
                  <Play fill="#fff" size={50} />
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

          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-5 md:mt-16 xl:grid-cols-[3fr_2.5fr] xl:items-center">
            <motion.p
              variants={variants.fadeInRight}
              initial="start"
              whileInView="end"
              viewport={{ once: true }}
              className="section-title text-center lg:mx-auto lg:max-w-[30ch] xl:text-left"
            >
              {overviewData.listTitle}
            </motion.p>

            <motion.div
              variants={variants.fadeInLeft}
              initial="start"
              whileInView="end"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-5 md:gap-10 xl:gap-8"
            >
              {overviewData.list.map(({ title, text }, index) => (
                <motion.div
                  variants={variants.fadeInLeft}
                  key={index}
                  className="text-center"
                >
                  <h3 className="text-3xl">{title}</h3>
                  <p className="text-muted-foreground">{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
