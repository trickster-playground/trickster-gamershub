import { Post } from '@/types/posts';
import PostCard from '../posts/post-card';

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
    <div className="flex h-96 w-full min-w-80 items-center justify-center">
      <h1 className="text-2xl font-semibold">No liked posts available</h1>
    </div>
  );
};

export default ProfilePostsLikes;
