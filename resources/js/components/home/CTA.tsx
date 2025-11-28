/**
 * Node Modules
 */
import { motion } from 'motion/react';

/**
 * Framer Motion Variants
 */
import * as variants from '@/lib/motionVariants';

/**
 * Constants
 */
import { ctaData } from '@/constants';

/**
 * Components UI
 */
import { Button } from '../ui/button';

/**
 * Assets
 */
import { ctaBanner } from '@/assets';

const CTA = () => {
  return (
    <section className="section">
      <div className="container">
        <motion.div
          variants={variants.fadeInUp}
          initial="start"
          whileInView="end"
          viewport={{ once: true }}
          className="grid grid-cols-1 overflow-hidden rounded-xl border-t border-primary-foreground/30 bg-primary lg:grid-cols-[1fr_0.7fr] lg:items-center"
        >
          <div className="p-8 md:p-16 xl:p-20">
            <motion.h2
              variants={variants.fadeIn}
              initial="start"
              whileInView="end"
              viewport={{ once: true }}
              className="mb-6 text-[26px] leading-tight font-semibold capitalize sm:text-[34px] md:text-[40px] lg:mb-10 lg:text-[46px]"
            >
              {ctaData.text}
            </motion.h2>
            <motion.div
              variants={variants.fadeIn}
              initial="start"
              whileInView="end"
              viewport={{ once: true }}
              className="flex items-center gap-3 lg:gap-4"
            >
              <Button className="bg-foreground text-background hover:bg-foreground/95">
                Free Trial
              </Button>
              <Button
                variant={'outline'}
                className="border-current !bg-transparent"
              >
                Pricing & Plans
              </Button>
            </motion.div>
          </div>

          <motion.figure
            variants={variants.fadeInLeft}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            className="-order-1 ps-8 pt-14 sm:ps-12 md:ps-14 lg:order-none lg:p-0"
          >
            <img
              src={ctaBanner}
              alt=""
              className="h-full w-full object-contain object-right"
            />
          </motion.figure>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
