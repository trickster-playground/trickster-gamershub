/**
 * Components
 */
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import PostCard from '../posts/post-card';

/**
 * Assets
 */
import { IconLayoutGrid } from '@tabler/icons-react';
import { RefreshCcwIcon } from 'lucide-react';

/**
 * Types
 */
import { Post } from '@/types/posts';

interface ProfilePostsProps {
  posts: Post[];
  onLikeToggle: (postId: number, liked: boolean) => void;
  onSaveToggle: (postId: number, saved: boolean) => void;
  onFollowToggle?: (userId: number, state: boolean) => void;
}

const ProfilePosts = ({
  posts,
  onLikeToggle,
  onSaveToggle,
  onFollowToggle,
}: ProfilePostsProps) => {
  return posts.length > 0 ? (
    posts.map((post) => (
      <div key={post.id} className="my-6 flex w-full justify-center">
        <PostCard
          post={post}
          onLikeToggle={onLikeToggle}
          onSaveToggle={onSaveToggle}
          onFollowToggle={onFollowToggle}
        />
      </div>
    ))
  ) : (
    <Empty className="h-full min-h-[838px] bg-gradient-to-b from-dark-1/50 from-30% to-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconLayoutGrid />
        </EmptyMedia>
        <EmptyTitle>No Posts</EmptyTitle>
        <EmptyDescription>
          You&apos;re all caught up. New posts will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          <RefreshCcwIcon />
          Refresh
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default ProfilePosts;
