import { Post } from '@/types/posts';
import PostCard from '../posts/post-card';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { IconHeart } from '@tabler/icons-react';
import { RefreshCcwIcon } from 'lucide-react';

interface ProfilePostsLikesProps {
  likedPosts: Post[];
  onLikeToggle: (postId: number, liked: boolean) => void;
  onSaveToggle: (postId: number, saved: boolean) => void;
}

const ProfilePostsLikes = ({
  likedPosts,
  onLikeToggle,
  onSaveToggle,
}: ProfilePostsLikesProps) => {
  return likedPosts.length > 0 ? (
    likedPosts.map((post) => (
      <div key={post.id} className="my-6 flex w-full justify-center">
        <PostCard
          post={post}
          onLikeToggle={onLikeToggle}
          onSaveToggle={onSaveToggle}
        />
      </div>
    ))
  ) : (
    <Empty className="h-full min-h-[838px] bg-gradient-to-b from-dark-1/50 from-30% to-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconHeart />
        </EmptyMedia>
        <EmptyTitle>No Liked Posts</EmptyTitle>
        <EmptyDescription>
          You&apos;re all caught up. New liked posts will appear here.
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

export default ProfilePostsLikes;
