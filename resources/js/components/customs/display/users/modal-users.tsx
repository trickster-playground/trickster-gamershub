/**
 * Node Modules
 */
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';

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
import UserFollowButton from './user-follow-button';

/**
 * Assets
 */
import { IconUserPlus } from '@tabler/icons-react';
import { RefreshCcwIcon, X } from 'lucide-react';

/**
 * Types
 */
import { absoluteDate } from '@/lib/format-date';
import { SharedData, User } from '@/types';

interface ModalUsersProps {
  isOpen: boolean;
  title: string;
  users?: User[];
  onClose: () => void;
  onFollowToggle?: (userId: number, state: boolean) => void;
}

const ModalUsers = ({
  isOpen,
  title,
  users,
  onClose,
  onFollowToggle,
}: ModalUsersProps) => {
  const { auth } = usePage<SharedData>().props;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-b from-dark-1/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            className="w-full max-w-lg rounded-xl bg-dark-2 p-4 shadow-lg"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-dark-4 pb-3">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="cursor-pointer rounded p-2 text-light-2 hover:bg-dark-3"
              >
                <X size={18} />
              </button>
            </div>

            {/* Users List */}
            <div className="max-h-[80vh] space-y-3 overflow-y-auto pr-1">
              {users?.length === 0 && (
                <Empty className="h-full bg-dark-2">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <IconUserPlus />
                    </EmptyMedia>
                    <EmptyTitle>No {title}</EmptyTitle>
                    <EmptyDescription>
                      You&apos;re all caught up. New {title} users will appear
                      here.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button variant="outline" size="sm">
                      <RefreshCcwIcon />
                      Refresh
                    </Button>
                  </EmptyContent>
                </Empty>
              )}

              {(users ?? []).map((user) => (
                <Link
                  href={`/user/${user.username}`}
                  key={user.id}
                  className="flex items-center justify-between gap-3 rounded-md p-2 hover:bg-dark-3"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        user.avatar?.path
                          ? `${user.avatar.path}`
                          : '/default-avatar.png'
                      }
                      className="h-18 w-18 rounded-full object-cover"
                    />

                    {/* Name */}
                    <div className="flex flex-col">
                      <span className="font-medium text-white capitalize">
                        {user.name}
                      </span>
                      <span className="text-sm text-light-3">
                        @{user.username}
                      </span>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <div className="flex flex-col items-center gap-2">
                    {auth.user?.id !== user.id && (
                      <UserFollowButton
                        userId={user.id}
                        isFollowing={user.isFollowing ?? false}
                        onToggle={(state) => {
                          if (onFollowToggle) onFollowToggle(user.id, state);
                        }}
                        className="h-8 !text-sm"
                      />
                    )}
                    <span className="text-xs">
                      {absoluteDate(new Date(user.created_at))}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalUsers;
