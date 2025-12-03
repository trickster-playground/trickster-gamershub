import { Post } from '@/types/posts';
import PostCard from '../posts/post-card';

interface ProfilePostsSavesProps {
  savedPosts: Post[];
  onLikeToggle: (postId: number, liked: boolean) => void;
  onSaveToggle: (postId: number, saved: boolean) => void;
}

const ProfilePostsSaves = ({
  savedPosts,
  onSaveToggle,
  onLikeToggle,
}: ProfilePostsSavesProps) => {
  return savedPosts.length > 0 ? (
    savedPosts.map((post) => (
      <div key={post.id} className="my-6 flex w-full justify-center">
        <PostCard
          post={post}
          onLikeToggle={onLikeToggle}
          onSaveToggle={onSaveToggle}
        />
      </div>
    ))
  ) : (
    <div className="flex h-96 w-full min-w-80 items-center justify-center">
      <h1 className="text-2xl font-semibold">No saved posts available</h1>
    </div>
  );
};

export default ProfilePostsSaves;
