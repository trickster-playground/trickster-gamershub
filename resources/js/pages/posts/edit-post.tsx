import PostForm from '@/components/customs/display/posts/post-form';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Post } from '@/types/posts';
import { Head, Link } from '@inertiajs/react';
import { StepBack } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Edit Post',
    href: '/posts/edit',
  },
];

interface PostEditProps {
  post: Post;
}

const EditPost = ({ post }: PostEditProps) => {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Post" />

      {/* Main Content */}
      <div className="flex flex-1">
        <div className="common-container">
          <div className="flex w-full max-w-5xl justify-between">
            <div className={'flex items-center gap-3'}>
              <img
                src="/assets/icons/edit.svg"
                className="invert-white"
                width={36}
                height={36}
                alt="Edit Post"
              />
              <h2 className="h3-bold md:h2-bold w-full text-left">Edit Post</h2>
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
            action="Update"
            post={{
              caption: post?.caption || '',
              attachments: post?.attachments || [],
              location: post?.location || '',
              tags: post?.tags || '',
              slug: post?.slug || '',
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EditPost;
