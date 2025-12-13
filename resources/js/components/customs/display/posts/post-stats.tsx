/**
 * Node modules
 */
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

/**
 * Components
 */
import { PostCommentTooltip } from './post-comment-tooltip';

/**
 * Assets
 */
import { IconMessagePlus } from '@tabler/icons-react';

/**
 * Types
 */
import { Post } from '@/types/posts';
import { comicToast } from '../ui/toasts/comic-toast';

interface PostStatsProps {
  post: Post;
  onLikeToggle?: (postId: number, liked: boolean) => void;
  onSaveToggle?: (postId: number, saved: boolean) => void;
}

const PostStats = ({ post, onLikeToggle, onSaveToggle }: PostStatsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(post.has_liked);
  const [isSaved, setIsSaved] = useState(post.has_saved);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);

  const handleLikePost = () => {
    if (isLoading) return;

    const optimisticLiked = !isLiked;

    // Optimistic UI
    setIsLoading(true);
    setLikesCount((prev) =>
      optimisticLiked ? prev + 1 : Math.max(prev - 1, 0),
    );
    setIsLiked(optimisticLiked);
    onLikeToggle?.(post.id, optimisticLiked);

    comicToast
      .promise(
        () =>
          axios.post(`/post/${post.id}/like`).catch((error) => {
            // rollback
            setLikesCount((prev) =>
              optimisticLiked ? Math.max(prev - 1, 0) : prev + 1,
            );
            setIsLiked(!optimisticLiked);
            onLikeToggle?.(post.id, !optimisticLiked);
            throw error;
          }),
        {
          loading: optimisticLiked ? 'Liking post...' : 'Unliking post...',
          success: () => (optimisticLiked ? 'Post liked' : 'Post unliked'),
          error: 'Failed to update like',
        },
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSavePost = async () => {
    if (isLoading) return;

    const optimisticSaved = !isSaved;

    // Optimistic UI
    setIsLoading(true);
    setIsSaved(optimisticSaved);
    onSaveToggle?.(post.id, optimisticSaved);

    try {
      await comicToast.promise(() => axios.post(`/post/${post.id}/save`), {
        loading: optimisticSaved ? 'Saving post...' : 'Unsaving post...',
        success: () =>
          optimisticSaved ? 'Post saved' : 'Post removed from saved',
        error: 'Failed to update saved post',
      });
    } catch (error) {
      // Rollback UI
      setIsSaved(!optimisticSaved);
      onSaveToggle?.(post.id, !optimisticSaved);
      console.error('Error saving post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="z-20 flex items-center justify-between px-3">
      <div className="flex items-center gap-3">
        <img
          src={`/assets/icons/${isLiked ? 'liked' : 'like'}.svg`}
          alt="like"
          width={28}
          height={28}
          onClick={handleLikePost}
          className={`cursor-pointer transition-all duration-300 ease-in-out ${isLiked ? 'size-7' : 'size-6'} ${isLoading ? 'opacity-50' : ''}`}
        />
        <p className="text-md font-semibold">{likesCount}</p>

        <Link href={`/posts/${post.user.username}/${post.slug}`}>
          <IconMessagePlus
            className="stroke-[1.5] text-sky-500 transition-colors duration-300 hover:cursor-pointer hover:text-sky-600"
            width={28}
            height={28}
          />
        </Link>
        <p className="text-md font-semibold">{commentsCount}</p>
        <PostCommentTooltip comments={post.comments} creator={post.user.id} />
      </div>

      <div className="flex items-center">
        <img
          src={`/assets/icons/${isSaved ? 'saved' : 'save'}.svg`}
          alt="save"
          width={25}
          height={25}
          onClick={handleSavePost}
          className={`cursor-pointer transition-opacity duration-300 ${
            isLoading ? 'opacity-50' : ''
          }`}
        />
      </div>
    </div>
  );
};

export default PostStats;
