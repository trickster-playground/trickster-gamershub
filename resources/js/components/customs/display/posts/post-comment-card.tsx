import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';
import { SharedData } from '@/types';
import { PostComment } from '@/types/posts';

import PostCommentController from '@/actions/App/Http/Controllers/Posts/PostCommentController';
import { Link, router, usePage } from '@inertiajs/react';
import PostCommentSettings from './post-comment-setting';

interface PostCommentCardProps {
  comments: PostComment[];
  onEdit: (id: number, content: string) => void;
}

const PostCommentCard = ({ comments, onEdit }: PostCommentCardProps) => {
  // Authenticated User
  const { auth } = usePage<SharedData>().props;

  // Initials Hook
  const getInitials = useInitials();

  // Handle Delete Comment
  const handleDeleteComment = (id: number) => {
    const { url, method } = PostCommentController.destroy(id);

    router.visit(url, {
      method,
      onSuccess: () => {
        console.log('Comment deleted');
      },
    });
  };
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
                <div className="flex flex-col items-end justify-end gap-2">
                  {auth.user.id === comment.user.id ? (
                    <div>
                      <PostCommentSettings
                        commentId={comment.id}
                        commentContent={comment.comment}
                        onDelete={() => handleDeleteComment(comment.id)}
                        onEdit={() => onEdit(comment.id, comment.comment)}
                      />
                    </div>
                  ) : (
                    <div>
                      <Button
                        type="button"
                        className={`comic-button cursor-pointer !text-sm`}
                      >
                        Follow
                      </Button>
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {comment.created_at}
                  </span>
                </div>
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
