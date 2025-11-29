import { ProfileCard } from '@/components/customs/display/users/profile-card';
import CustomAppLayout from '@/layouts/customs/custom-app-layout';
import { dashboard } from '@/routes';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
];

export default function Dashboard() {
  const { auth, flash } = usePage<SharedData>().props;
  return (
    <CustomAppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      {/* Left Content */}
      <div className="order-1 col-span-12 flex h-full w-full flex-col gap-4 overflow-x-auto rounded-xl p-4 md:order-1 md:col-span-1 lg:order-1 lg:col-span-3">
        <ProfileCard
          name={`${auth.user?.name || 'Leanne Graham'}`}
          username={`${auth.user?.username || 'Nothing in life is to be feared, it is only to be understood.'}`}
          avatar={`${auth.user?.avatar || 'https://github.com/shadcn.png'}`}
          background={`${auth.user?.background || 'https://github.com/shadcn.png'}`}
        />
      </div>

      {/* Main Content */}
      <div className="order-3 col-span-12 flex h-full w-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:order-3 md:col-span-2 lg:order-2 lg:col-span-6">
        {/* {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))} */}
      </div>

      {/* Right Content */}
      <div className="order-2 col-span-12 flex h-full w-full flex-col gap-4 overflow-x-auto rounded-xl p-4 text-sm md:order-2 md:col-span-1 lg:order-3 lg:col-span-3">
        {/* <TournamentCalendar /> */}
      </div>
    </CustomAppLayout>
  );
}
