import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Post } from '@/types/posts';
import { IconBookmark } from '@tabler/icons-react';
import { RefreshCcwIcon } from 'lucide-react';
import PostCard from '../posts/post-card';

interface ProfilePostsSavesProps {
  savedPosts: Post[];
  onLikeToggle: (postId: number, liked: boolean) => void;
  onSaveToggle: (postId: number, saved: boolean) => void;
  onFollowToggle?: (userId: number, state: boolean) => void;
}

const ProfilePostsSaves = ({
  savedPosts,
  onSaveToggle,
  onLikeToggle,
  onFollowToggle,
}: ProfilePostsSavesProps) => {
  return savedPosts.length > 0 ? (
    savedPosts.map((post) => (
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
          <IconBookmark />
        </EmptyMedia>
        <EmptyTitle>No Saved Posts</EmptyTitle>
        <EmptyDescription>
          You&apos;re all caught up. New saved posts will appear here.
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

export default ProfilePostsSaves;
