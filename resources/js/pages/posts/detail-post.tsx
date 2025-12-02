import PostController from '@/actions/App/Http/Controllers/Posts/PostController';
import PostCommentCard from '@/components/customs/display/posts/post-comment-card';
import PostCommentForm from '@/components/customs/display/posts/post-comment-form';
import PostSettings from '@/components/customs/display/posts/post-settings';
import PostStats from '@/components/customs/display/posts/post-stats';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { absoluteDate } from '@/lib/format-date';
import { BreadcrumbItem, SharedData } from '@/types';
import { Post } from '@/types/posts';

import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Detail Post',
    href: '/posts/detail',
  },
];

interface PostDetailProps {
  post: Post;
  onLikeToggle?: (postId: number, liked: boolean) => void;
  onSaveToggle?: (postId: number, saved: boolean) => void;
}

const ShowPost = ({ post, onLikeToggle, onSaveToggle }: PostDetailProps) => {
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
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Detail Post" />

      {/* Main Content */}
      <div className="flex max-h-screen flex-col space-y-3 px-4 pt-4">
        <div className="post_details-container">
          <div className="post_details-card flex-grow">
            {post.attachments && post.attachments.length > 0 ? (
              <Carousel className="mx-auto w-full xl:max-w-3xl" setApi={setApi}>
                <CarouselContent>
                  {post.attachments.map((attachment, index) => (
                    <CarouselItem key={index}>
                      <div className="p-4">
                        <img
                          src={
                            attachment.path ||
                            'assets/icons/profile-placeholder.svg'
                          }
                          className="post-card_img aspect-square rounded-md object-contain"
                          alt={`Attachment ${index + 1}`}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {hasMultipleImages && (
                  <>
                    <CarouselPrevious className="btn-prev" />
                    <CarouselNext className="btn-next" />
                    <div className="relative -mt-10 mb-3 text-center text-sm text-muted-foreground">
                      Slide {current} of {count}
                    </div>
                  </>
                )}
              </Carousel>
            ) : (
              ''
            )}
            <div className="post_details-info flex w-1/2 flex-col gap-3">
              <div className="flex w-full items-start justify-between">
                {/* LEFT: Avatar + Name + Date */}
                <div className="flex items-center gap-3">
                  <Link href={`/user/${post.user.username}`}>
                    <Avatar className="border-2 border-white hover:border-blue-500">
                      <AvatarImage
                        src={post.user?.avatar?.path ?? '/default-avatar.png'}
                        alt={post.user?.name}
                      />
                      <AvatarFallback>
                        {getInitials(post.user?.name ?? '')}
                      </AvatarFallback>
                    </Avatar>
                  </Link>

                  <div className="flex flex-col">
                    <Link href={`/user/${post.user.username}`}>
                      <p className="base-medium lg:body-bold text-light-1 hover:text-blue-500">
                        {post.user.name}
                      </p>
                    </Link>

                    <div className="flex items-center gap-1 text-light-3">
                      <p className="text-xs">
                        {absoluteDate(new Date(post.created_at))}
                      </p>
                      <p className="flex items-center gap-1 text-xs">
                        <span>at</span> {post.location || 'Somewhere'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Settings */}
                <div className="px-3">
                  <PostSettings
                    slug={post.slug}
                    onDelete={() => handleDeletePost(post.slug)}
                  />
                </div>
              </div>

              <hr className="my-2 w-full border border-dark-4/80" />

              {/* Caption + Tags */}
              <div className="small-medium lg:base-regular flex w-full flex-col">
                {post.caption && (
                  <div className="text-justify">
                    <p
                      className="text-justify"
                      dangerouslySetInnerHTML={{ __html: post.caption }}
                    />
                  </div>
                )}

                {splitTags.length > 0 && (
                  <ul className="mt-2 flex gap-1">
                    {splitTags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${tag}`}
                        className="text-sm text-light-3 hover:text-blue-400"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-auto w-full">
                <PostStats
                  post={post}
                  onLikeToggle={onLikeToggle}
                  onSaveToggle={onSaveToggle}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold">All Comments</h1>
          <PostCommentCard comments={post.comments} />
        </div>

        <PostCommentForm postId={post.id} />
      </div>
    </AppLayout>
  );
};

export default ShowPost;
