/**
 * Node Modules
 */
import { Head, usePage } from '@inertiajs/react';

/**
 * Routes
 */
import { dashboard } from '@/routes';

/**
 * Layouts
 */
import CustomAppLayout from '@/layouts/customs/custom-app-layout';

/**
 *  Components
 */
import { ProfileCard } from '@/components/customs/display/users/profile-card';

/**
 * Types
 */
import PostCard from '@/components/customs/display/posts/post-card';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Post } from '@/types/posts';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
];

interface DashboardProps {
  posts: Post[];
}

export default function Dashboard({ posts }: DashboardProps) {
  const { auth, flash } = usePage<SharedData>().props;

  // Posts state
  const [postsState, setPosts] = useState(posts);

  return (
    <CustomAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      {/* Left Content */}
      <div className="order-1 col-span-12 flex h-full w-full flex-col gap-4 overflow-x-auto rounded-xl p-4 md:order-1 md:col-span-1 lg:order-1 lg:col-span-3">
        <ProfileCard
          name={`${auth.user?.name || 'John Doe'}`}
          username={`${auth.user?.username || 'Johndoe.'}`}
          avatar={`/storage/${auth.user?.avatar?.path || 'https://github.com/shadcn.png'}`}
          background={`/storage/${auth.user?.background?.path || 'https://github.com/shadcn.png'}`}
        />
      </div>

      {/* Main Content */}
      <div className="order-3 col-span-12 flex h-full w-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:order-3 md:col-span-2 lg:order-2 lg:col-span-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onFollowToggle={(userId, state) => {
              // ✅ update postsState
              setPosts((prev) =>
                prev.map((p) =>
                  p.user.id === userId
                    ? { ...p, user: { ...p.user, isFollowing: state } }
                    : p,
                ),
              );
            }}
          />
        ))}
      </div>

      {/* Right Content */}
      <div className="order-2 col-span-12 flex h-full w-full flex-col gap-4 overflow-x-auto rounded-xl p-4 text-sm md:order-2 md:col-span-1 lg:order-3 lg:col-span-3">
        {/* <TournamentCalendar /> */}
      </div>
    </CustomAppLayout>
  );
}
