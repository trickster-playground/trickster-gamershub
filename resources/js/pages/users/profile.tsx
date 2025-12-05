/**
 * Node Modules
 */
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

/**
 * Layouts
 */
import AppLayout from '@/layouts/app-layout';

/**
 * Components
 */
import ModalImage from '@/components/customs/display/users/modal-image';
import ModalUsers from '@/components/customs/display/users/modal-users';
import ProfilePosts from '@/components/customs/display/users/profile-posts';
import ProfilePostsLikes from '@/components/customs/display/users/profile-posts-likes';
import ProfilePostsSaves from '@/components/customs/display/users/profile-posts-saves';
import ProfileStats from '@/components/customs/display/users/profile-stats';
import UserFollowButton from '@/components/customs/display/users/user-follow-button';
import { FloatingDock } from '@/components/ui/acternity/floating-dock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/**
 * Types
 */
import { BreadcrumbItem, User } from '@/types';
import { Post } from '@/types/posts';

/**
 * Library
 */
import { socialIconMap } from '@/lib/socialIcon';

/**
 * Routes
 */
import { edit } from '@/routes/profile';

/**
 * Assets
 */
import {
  IconBookmark,
  IconEdit,
  IconHeart,
  IconLayoutGrid,
} from '@tabler/icons-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User Profile ',
    href: '/user/profile',
  },
];

interface ProfileProps {
  user: User;
  userProfile: User;
  currentUser: boolean;
}

const profile = ({ user, userProfile, currentUser }: ProfileProps) => {
  // Posts state
  const [posts, setPosts] = useState(userProfile.posts ?? []);
  const [likedPosts, setLikedPosts] = useState(userProfile.likedPosts ?? []);
  const [savedPosts, setSavedPosts] = useState(userProfile.savedPosts ?? []);

  // Handle like toggle
  const handleLikeToggle = (postId: number, liked: boolean) => {
    setPosts((prevPosts) => {
      const updated = prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              has_liked: liked,
              likes_count: post.likes_count + (liked ? 1 : -1),
            }
          : post,
      );

      // Get the latest version of this post after update
      const updatedPost = updated.find((p) => p.id === postId);

      setLikedPosts((prev) => {
        const exists = prev.find((p) => p.id === postId);

        if (liked) {
          // add if not exists
          if (!exists && updatedPost) return [...prev, updatedPost];
        } else {
          // delete if not liked
          if (exists) return prev.filter((p) => p.id !== postId);
        }

        return prev;
      });

      return updated;
    });
  };

  // Handle save toggle
  const handleSaveToggle = (postId: number, saved: boolean) => {
    setPosts((prevPosts) => {
      const updated = prevPosts.map((post) =>
        post.id === postId ? { ...post, has_saved: saved } : post,
      );

      const updatedPost = updated.find((p) => p.id === postId);

      setSavedPosts((prev) => {
        const exists = prev.find((p) => p.id === postId);

        if (saved) {
          if (!exists && updatedPost) return [...prev, updatedPost];
        } else {
          if (exists) return prev.filter((p) => p.id !== postId);
        }

        return prev;
      });

      return updated;
    });
  };

  // Follow state
  const [isFollowing, setIsFollowing] = useState(userProfile.isFollowing);

  // Handle follow
  const handleFollowToggle = (userId: number, state: boolean) => {
    setIsFollowing(state); // Update follow state profile user

    // Update all posts by this user in all tabs
    const updateUserFollow = (posts: Post[]) =>
      posts.map((p) =>
        p.user.id === userId
          ? { ...p, user: { ...p.user, isFollowing: state } }
          : p,
      );

    setPosts((prev) => updateUserFollow(prev));
    setLikedPosts((prev) => updateUserFollow(prev));
    setSavedPosts((prev) => updateUserFollow(prev));
  };

  // Social Links
  const links =
    userProfile.socialLinks?.map((item) => ({
      title: item.platform,
      href: item.url,
      icon: socialIconMap[item.platform] ?? socialIconMap['website'],
    })) ?? [];

  // Modal image state
  const [openImage, setOpenImage] = useState<string | null>(null);

  // Modal followers & following state
  const [openModal, setOpenModal] = useState<null | 'followers' | 'followings'>(
    null,
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Profile ${userProfile.name}`} />
      <div className="mx-auto w-full max-w-5xl px-2 py-2">
        <img
          src={
            userProfile?.background?.path ||
            'https://images.unsplash.com/photo-1553492206-f609eddc33dd?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }
          alt={`${userProfile?.name || 'User'} background`}
          onClick={() => setOpenImage(userProfile?.background?.path ?? null)}
          className="h-[400px] w-full cursor-pointer rounded-md object-cover"
        />

        <ModalImage
          isOpen={openImage !== null}
          src={openImage}
          alt="Preview"
          onClose={() => setOpenImage(null)}
        />

        <div className="flex flex-col items-center gap-6 rounded-b-md bg-dark-1 p-6 shadow-md xl:flex-row xl:items-start">
          <img
            src={userProfile?.avatar?.path || 'https://github.com/shadcn.png'}
            alt={`${userProfile?.name || 'User'} avatar`}
            onClick={() => setOpenImage(userProfile?.avatar?.path ?? null)}
            className="h-32 w-32 rounded-full border-2 border-blue-500 object-cover hover:scale-110 hover:cursor-pointer lg:h-50 lg:w-50"
          />

          <div className="flex flex-1 flex-col gap-2 pt-2 text-center xl:text-left">
            <div>
              <h1 className="text-2xl font-bold capitalize md:text-3xl">
                {userProfile?.name}
              </h1>
              <p className="text-sm text-gray-500 md:text-base">
                @{userProfile?.username}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-2 xl:justify-start">
              <ProfileStats
                value={userProfile.posts?.length || 0}
                label="Posts"
              />
              <ProfileStats
                value={userProfile.followersCount || 0}
                label="Followers"
                onClick={() => setOpenModal('followers')}
              />
              <ProfileStats
                value={userProfile.followingsCount || 0}
                label="Following"
                onClick={() => setOpenModal('followings')}
              />

              <ModalUsers
                isOpen={openModal !== null}
                title={openModal === 'followers' ? 'Followers' : 'Following'}
                users={
                  openModal === 'followers'
                    ? userProfile.followers
                    : userProfile.followings
                }
                onClose={() => setOpenModal(null)}
              />
            </div>
            <p
              className="small-medium md:base-medium mt-4 max-w-screen-sm xl:text-justify"
              dangerouslySetInnerHTML={{ __html: userProfile.bio ?? '' }}
            ></p>
            <div className="mt-2 flex flex-col justify-center gap-4 xl:flex-row xl:justify-between">
              <div>
                {links.length > 0 && (
                  <FloatingDock items={links} desktopClassName="w-fit" />
                )}
              </div>
              {currentUser ? (
                <div className={``}>
                  <Link
                    href={edit()}
                    as="button"
                    className={`group comic-button !inline-flex h-12 cursor-pointer items-center gap-2 rounded-lg transition-all`}
                  >
                    <IconEdit className="size-5" />
                    <p className="!text-md flex font-semibold whitespace-nowrap">
                      Edit Profile
                    </p>
                  </Link>
                </div>
              ) : (
                <div className="mx-auto flex max-w-md lg:mx-0">
                  <UserFollowButton
                    className="h-12"
                    userId={userProfile.id}
                    isFollowing={isFollowing ?? false}
                    onToggle={(state) =>
                      handleFollowToggle(userProfile.id, state)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <Tabs defaultValue="posts" className="h-full w-full">
          <TabsList className="flex h-auto w-full justify-around rounded-none border-b border-dark-4 bg-dark-2">
            <TabsTrigger
              value="posts"
              className="group flex cursor-pointer flex-col items-center justify-center border-b-2 border-transparent px-4 py-3 text-gray-400 transition-all duration-200 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
            >
              <IconLayoutGrid className="mb-1 size-5 text-gray-400 group-data-[state=active]:text-blue-500" />
              <span className="text-xs font-medium sm:text-sm">Posts</span>
            </TabsTrigger>

            <TabsTrigger
              value="likes"
              className="group flex cursor-pointer flex-col items-center justify-center border-b-2 border-transparent px-4 py-3 text-gray-400 transition-all duration-200 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
            >
              <IconHeart className="mb-1 size-5 text-gray-400 group-data-[state=active]:text-blue-500" />
              <span className="text-xs font-medium sm:text-sm">Likes</span>
            </TabsTrigger>

            <TabsTrigger
              value="saved"
              className="group flex cursor-pointer flex-col items-center justify-center border-b-2 border-transparent px-4 py-3 text-gray-400 transition-all duration-200 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
            >
              <IconBookmark className="mb-1 size-5 text-gray-400 group-data-[state=active]:text-blue-500" />
              <span className="text-xs font-medium sm:text-sm">Saved</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <ProfilePosts
              posts={posts}
              onLikeToggle={handleLikeToggle}
              onSaveToggle={handleSaveToggle}
              onFollowToggle={handleFollowToggle}
            />
          </TabsContent>

          <TabsContent value="likes">
            <ProfilePostsLikes
              likedPosts={likedPosts}
              onLikeToggle={handleLikeToggle}
              onSaveToggle={handleSaveToggle}
              onFollowToggle={handleFollowToggle}
            />
          </TabsContent>

          <TabsContent value="saved">
            <ProfilePostsSaves
              savedPosts={savedPosts}
              onLikeToggle={handleLikeToggle}
              onSaveToggle={handleSaveToggle}
              onFollowToggle={handleFollowToggle}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default profile;
