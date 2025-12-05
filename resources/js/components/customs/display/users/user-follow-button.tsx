import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface FollowButtonProps {
  userId: number;
  isFollowing: boolean;
  onToggle: (newState: boolean) => void;
  className?: string;
}

const UserFollowButton = ({
  userId,
  isFollowing,
  onToggle,
  className,
}: FollowButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setLoading(true);
    const optimisticValue = !isFollowing;

    // Optimistic UI
    onToggle(optimisticValue);

    if (isFollowing) {
      router.delete(`/users/${userId}/unfollow`, {
        onSuccess: () => setLoading(false),
        onError: () => {
          onToggle(isFollowing); // revert
          setLoading(false);
        },
      });
    } else {
      router.post(
        `/users/${userId}/follow`,
        {},
        {
          onSuccess: () => setLoading(false),
          onError: () => {
            onToggle(isFollowing); // revert
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
      className={cn(
        'flex h-10 items-center gap-2 rounded-lg transition-all',
        isFollowing ? 'red-comic-button' : 'comic-button',
        loading && 'cursor-not-allowed opacity-80',
        className,
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        'Unfollow'
      ) : (
        'Follow'
      )}
    </Button>
  );
};

export default UserFollowButton;
