import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { PostComment } from '@/types/posts';

import { Link } from '@inertiajs/react';

interface PostCommentCardProps {
  comments: PostComment[];
}

const PostCommentCard = ({ comments }: PostCommentCardProps) => {
  const getInitials = useInitials();
  return (
    <div className="mt-6 flex w-full flex-col items-center gap-4">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="flex w-full max-w-3xl items-start gap-4 rounded-2xl border border-border bg-background/80 p-4 backdrop-blur-md transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Avatar */}
            <Link href={`/user/${comment.user.username}`}>
              <Avatar className="h-12 w-12 ring-2 ring-sky-500 transition-transform hover:scale-105">
                <AvatarImage
                  src={comment.user?.avatar?.path ?? '/default-avatar.png'}
                  alt={comment.user?.name}
                />
                <AvatarFallback>
                  {getInitials(comment.user?.name ?? '')}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* Comment Body */}
            <div className="flex flex-1 flex-col">
              <div className="mb-1 flex flex-wrap items-center justify-between">
                <div className="flex flex-col">
                  <Link href={`/user/${comment.user.username}`}>
                    <p className="text-[15px] font-semibold text-foreground transition-colors hover:text-sky-500">
                      {comment.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{comment.user.username}
                    </p>
                  </Link>
                </div>
                <span className="text-xs text-muted-foreground">
                  {comment.created_at}
                </span>
              </div>

              <div className="mt-2 text-[15px] leading-relaxed whitespace-pre-line text-light-1">
                <p dangerouslySetInnerHTML={{ __html: comment.comment }}></p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          No comments yet.
        </p>
      )}
    </div>
  );
};

export default PostCommentCard;
