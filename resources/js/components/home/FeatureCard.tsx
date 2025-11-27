/**
 * Node Modules
 */
import { frame, motion, useMotionValue } from 'motion/react';
import { JSX, MouseEvent, useCallback, useRef, useState } from 'react';

/**
 * Types
 */
type FeatureCardProps = {
  classes?: string;
  children: JSX.Element;
};

/**
 * Framer Motion Variants
 */
import * as variants from '@/lib/motionVariants';

const FeatureCard = ({ classes, children }: FeatureCardProps) => {
  const glowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [showGlow, setShowGlow] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();

    frame.read(() => {
      x.set(event.clientX - Number(rect?.left));
      y.set(event.clientY - Number(rect?.top));
    });
  }, [x, y]);

  return (
    <motion.div
      variants={variants.staggerContainer}
      initial="start"
      whileInView="end"
      viewport={{ once: true }}
      className={`relative cursor-pointer overflow-hidden rounded-[14px] p-[1px] ring-zinc-800/50 ring-inset ${classes}`}
    >
      <div
        className="relative isolate overflow-hidden rounded-xl bg-card backdrop-blur-md"
        ref={cardRef}
        onMouseOver={() => setShowGlow(true)}
        onMouseOut={() => setShowGlow(false)}
        onMouseMove={handleMouseMove}
      >
        {children}
      </div>

      {/* Border Effect */}
      <motion.div
        className="absolute -top-[150px] -left-[150px] -right-[250px] -z-10 w-[300px] h-[300px] rounded-full bg-primary blur-[30px]"
        ref={glowRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: Number(showGlow) }}
        style={{ x, y }}
      ></motion.div>
    </motion.div>
  );
};

export default FeatureCard;
