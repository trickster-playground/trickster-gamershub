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
import { reviewData } from '@/constants';

/**
 * Components UI
 */
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

/**
 * Assets
 */
import { Quote } from 'lucide-react';

const Review = () => {
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
            {reviewData.sectionSubtitle}
          </motion.p>

          <motion.h2
            variants={variants.fadeInUp}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            className="section-title"
          >
            {reviewData.sectionTitle}
          </motion.h2>
        </div>

        <motion.div
          variants={variants.staggerContainer}
          initial="start"
          whileInView="end"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {reviewData.reviewCard.map(
            ({ title, text, reviewAuthor, date }, index) => (
              <motion.div variants={variants.fadeInUp} key={index}>
                <Card className="relative h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {text}
                    </p>
                  </CardContent>
                  <CardFooter className="block">
                    <p className="">{reviewAuthor}</p>
                    <p className="text-xs text-muted-foreground">{date}</p>
                  </CardFooter>
                  <div className="absolute right-3 bottom-0 opacity-[0.2]">
                    <Quote size={80} color="#54aeff" />
                  </div>
                </Card>
              </motion.div>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Review;
