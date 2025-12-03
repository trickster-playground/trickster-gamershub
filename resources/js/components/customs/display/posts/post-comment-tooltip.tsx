'use client';

/**
 * Components
 */
import { AnimatedTooltip } from './animated-tooltip';

/**
 * Types
 */
import { PostComment } from '@/types/posts';

interface PostCommentTooltipProps {
  comments?: PostComment[];
  creator: number;
}

export function PostCommentTooltip({
  comments = [],
  creator,
}: PostCommentTooltipProps) {
  // get unique users from comments
  const uniqueUsersMap = new Map<number, any>();

  for (const comment of comments) {
    const user = comment.user;
    if (user && !uniqueUsersMap.has(user.id)) {
      uniqueUsersMap.set(user.id, user);
    }
  }

  const uniqueUsers = Array.from(uniqueUsersMap.values());

  const creatorInComments = uniqueUsers.find((user) => user.id === creator);
  const nonCreatorUsers = uniqueUsers.filter((user) => user.id !== creator);

  let tooltipItems = [];

  if (nonCreatorUsers.length >= 3) {
    // If there are 3+ non-creator users → show only 3 non-creator users
    tooltipItems = nonCreatorUsers.slice(0, 3);
  } else {
    // If non-creator users < 3 → show all, and add creator if exists
    tooltipItems = [...nonCreatorUsers];
    if (creatorInComments) {
      tooltipItems.push(creatorInComments);
    }
  }

  return (
    <div className="ml-1 flex w-full flex-row">
      {tooltipItems.length > 0 ? (
        <AnimatedTooltip items={tooltipItems} />
      ) : (
        <span className="text-xs text-muted-foreground">
          Belum ada komentar dari pengguna
        </span>
      )}
    </div>
  );
}
