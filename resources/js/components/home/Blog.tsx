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
import { blogData } from '@/constants';

/**
 * Components UI
 */
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

const Blog = () => {
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
            {blogData.sectionSubtitle}
          </motion.p>

          <motion.h2
            variants={variants.fadeInUp}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            className="section-title"
          >
            {blogData.sectionTitle}
          </motion.h2>

          <motion.p
            variants={variants.fadeInUp}
            initial="start"
            whileInView="end"
            viewport={{ once: true }}
            className="section-text"
          >
            {blogData.sectionText}
          </motion.p>
        </div>

        <motion.div
          variants={variants.staggerContainer}
          initial="start"
          whileInView="end"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {blogData.blogs.map(
            (
              {
                imgSrc,
                title,
                badge,
                author: { avatarSrc, authorName, publishDate, readingTime },
              },
              index,
            ) => (
              <motion.div variants={variants.fadeInUp} key={index}>
                <Card className="group cursor-pointer">
                  <CardHeader>
                    <figure className="overflow-hidden rounded-lg">
                      <img
                        src={imgSrc}
                        alt={title}
                        className="img-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </figure>
                  </CardHeader>
                  <CardContent>
                    <Badge className="mb-3">{badge}</Badge>
                    <CardTitle className="leading-normal">
                      <a
                        href="#"
                        className="transition-colors hover:text-primary"
                      >
                        {title}
                      </a>
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="gap-3">
                    <Avatar>
                      <AvatarImage src={avatarSrc} />
                      <AvatarFallback>{authorName}</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="mb-0.5 text-sm">{authorName}</p>

                      <div className="flex items-center gap-1.5">
                        <time
                          dateTime={publishDate}
                          className="text-xs text-muted-foreground"
                        >
                          {publishDate}
                        </time>

                        <span className="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                        <p className="text-xs text-muted-foreground">
                          {readingTime}
                        </p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ),
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
