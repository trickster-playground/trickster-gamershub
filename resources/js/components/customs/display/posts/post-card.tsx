/**
 * Node Modules
 */
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * Helpers
 */
import { useInitials } from '@/hooks/use-initials';
import { absoluteDate } from '@/lib/format-date';

/**
 * Components
 */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import PostSettings from './post-settings';
import PostStats from './post-stats';

/**
 * Types
 */
import { SharedData } from '@/types';
import { Post } from '@/types/posts';

/**
 * Actions
 */
import PostController from '@/actions/App/Http/Controllers/Posts/PostController';
import UserFollowButton from '../users/user-follow-button';

interface PostCardProps {
  post: Post;
  onLikeToggle?: (postId: number, liked: boolean) => void;
  onSaveToggle?: (postId: number, saved: boolean) => void;
  onFollowToggle?: (userId: number, state: boolean) => void;
}

const PostCard = ({
  post,
  onLikeToggle,
  onSaveToggle,
  onFollowToggle,
}: PostCardProps) => {
  // Authenticated User
  const { auth } = usePage<SharedData>().props;

  // Initials Hook
  const getInitials = useInitials();

  // Split Tags
  const splitTags = post.tags
    ? post.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '')
    : [];

  // Carousel State
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const hasMultipleImages = post.attachments && post.attachments.length > 1;

  useEffect(() => {
    if (!api) return;

    const updateCurrent = () => setCurrent(api.selectedScrollSnap() + 1);

    setCount(api.scrollSnapList().length);
    updateCurrent();
    api.on('select', updateCurrent);

    return () => {
      api.off('select', updateCurrent);
    };
  }, [api]);

  // Handle Delete Post
  const handleDeletePost = (slug: string) => {
    const { url, method } = PostController.destroy(slug);

    router.visit(url, {
      method,
      onSuccess: () => {
        console.log('Post deleted');
      },
    });
  };

  return (
    <div className="post-card mx-auto flex gap-4">
      {/* Avatar + Divider */}
      <div className="flex flex-col items-center">
        <Link href={`/user/${post.user.username}`}>
          <Avatar className="border-2 border-white hover:border-blue-500">
            <AvatarImage
              src={`${post.user?.avatar?.path || 'https://github.com/shadcn.png'}`}
              alt={post.user?.name}
            />
            <AvatarFallback>
              {getInitials(post.user?.name ?? '')}
            </AvatarFallback>
          </Avatar>
        </Link>

        {/* Vertical Divider */}
        <div className="mt-2 h-full w-px bg-white" />
      </div>

      {/* Card Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex w-full items-center gap-3">
            <div className="flex flex-col">
              <Link href={`/user/${post.user.username}`}>
                <p className="base-medium lg:body-bold text-light-1 hover:text-blue-400">
                  {post.user.name}
                </p>
              </Link>

              <div className="flex items-center justify-start gap-1 text-neutral-300">
                <p className="text-xs">
                  {absoluteDate(new Date(post.created_at))}
                </p>
                <p className="flex items-center gap-1 text-xs first-letter:underline">
                  <span>at</span>{' '}
                  {post.location
                    ? post.location
                        .split(' ')
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1),
                        )
                        .join(' ')
                    : 'Somewhere'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-center px-3">
            {auth.user.id === post.user.id ? (
              <PostSettings
                slug={post.slug}
                onDelete={() => handleDeletePost(post.slug)}
              />
            ) : (
              <div>
                <UserFollowButton
                  userId={post.user.id}
                  isFollowing={post.user.isFollowing ?? false}
                  onToggle={(state) => {
                    if (onFollowToggle) onFollowToggle(post.user.id, state);
                  }}
                  className='h-8 !text-sm'
                />
              </div>
            )}
          </div>
        </div>

        <div className="small-medium lg:base-medium space-y-3 py-4">
          {/* Caption */}
          {post.caption && (
            <div className="text-justify">
              <Link href={`/posts/${post.user.username}/${post.slug}`}>
                <p
                  className="text-justify"
                  dangerouslySetInnerHTML={{ __html: post.caption }}
                />
              </Link>
            </div>
          )}

          {/* Tags */}
          {splitTags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {splitTags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/tags/${tag}`}
                    className="text-sm text-light-4 hover:text-blue-400"
                  >
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {post.attachments?.length > 0 && (
          <Carousel className="mx-auto mb-4 w-full max-w-2xl" setApi={setApi}>
            <CarouselContent>
              {post.attachments.map((attachment, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <img
                      src={attachment.path || ''}
                      className="post-card_img aspect-square rounded-lg"
                      alt={`Attachment ${index + 1 || attachment.file_name}`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {hasMultipleImages && (
              <>
                <CarouselPrevious className="btn-prev" />
                <CarouselNext className="btn-next" />
                <div className="relative -mt-10 mb-10 text-center text-sm text-muted-foreground">
                  Slide {current} of {count}
                </div>
              </>
            )}
          </Carousel>
        )}

        <PostStats
          post={post}
          onLikeToggle={onLikeToggle}
          onSaveToggle={onSaveToggle}
        />
      </div>
    </div>
  );
};

export default PostCard;
