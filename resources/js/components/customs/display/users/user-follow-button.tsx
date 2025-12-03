import UserRelationController from '@/actions/App/Http/Controllers/Users/UserRelationController';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
}

const UserFollowButton = ({ userId, isFollowing }: FollowButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  const handleToggle = () => {
    setLoading(true);

    if (following) {
      // Unfollow
      router.delete(UserRelationController.unfollow(userId).url, {
        onSuccess: () => {
          setFollowing(false);
          setLoading(false);
        },
      });
    } else {
      // Follow
      router.post(
        UserRelationController.follow(userId).url,
        {},
        {
          onSuccess: () => {
            setFollowing(true);
            setLoading(false);
          },
        },
      );
    }
  };

  return (
    <Button
      disabled={loading}
      onClick={handleToggle}
      className={`h-12 cursor-pointer items-center gap-2 rounded-lg transition-all ${following ? 'red-comic-button' : 'comic-button'}`}
    >
      {loading ? '...' : following ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default UserFollowButton;
