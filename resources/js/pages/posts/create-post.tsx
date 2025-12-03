/**
 * Node Modules
 */
import { Head, Link } from '@inertiajs/react';
/**
 * Components
 */
import PostForm from '@/components/customs/display/posts/post-form';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

/**
 * Assets
 */
import { StepBack } from 'lucide-react';

/**
 * Types
 */
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Create Post',
    href: '/posts/create',
  },
];

const CreatePost = () => {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Post" />

      {/* Main Content */}
      <div className="flex flex-1">
        <div className="common-container">
          <div className="flex w-full max-w-5xl justify-between">
            <div className={'flex items-center gap-3'}>
              <img
                src="/assets/icons/add-post.svg"
                width={36}
                height={36}
                alt="add"
              />
              <h2 className="h3-bold md:h2-bold w-full text-left">
                Create Post
              </h2>
            </div>
            <div className={'flex items-center gap-3'}>
              <Link href={`/dashboard`}>
                <Button className="comic-button hover:cursor-pointer">
                  <StepBack className="size-[1.2rem]" />
                  Kembali
                </Button>
              </Link>
            </div>
          </div>

          {/* Form Component */}
          <PostForm
            action="Create"
            post={{
              caption: '',
              attachments: [],
              location: '',
              tags: '',
              slug: '',
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default CreatePost;
