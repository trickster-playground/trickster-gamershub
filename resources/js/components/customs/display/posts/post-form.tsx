'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import postRoutes from '@/routes/post';
import { router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { PostUpload } from './post-upload';
import Tiptap from './tiptap';

interface FileType extends Partial<File> {
  id: number;
  path?: string;
  file_name?: string;
  size: number;
  type: string;
  updated_at?: string;
  modified?: number;
}

interface DeletedFile {
  file: FileType;
}

interface PostsFormProps {
  post: {
    caption: string | null;
    attachments: FileType[] | null;
    location: string | null;
    tags: string | null;
    slug: string;
  };
  action: 'Create' | 'Update';
}

interface FormDataType {
  caption: string;
  location: string;
  tags: string;
  slug: string;
  newFiles: File[];
  deleted: number[];
  [key: string]: string | File[] | number[];
}

const PostForm = ({ post, action }: PostsFormProps) => {
  const [initialFiles, setInitialFiles] = useState<FileType[]>(
    post?.attachments || [],
  );

  const {
    data,
    setData,
    post: submit,
    processing,
    reset,
    errors,
  } = useForm<FormDataType>({
    caption: post?.caption || '',
    location: post?.location || '',
    tags: post?.tags || '',
    slug: post?.slug || '',
    newFiles: [],
    deleted: [],
  });

  const handleFilesChange = ({
    files,
    deletedFile,
  }: {
    files: (
      | File
      | { path?: string; file_name?: string; updated_at?: number }
    )[];
    deletedFile: any;
  }) => {
    const updatedFiles = files;

    let updatedDeleted = [...data.deleted];

    if (
      deletedFile &&
      'file' in deletedFile &&
      deletedFile.file &&
      'id' in deletedFile.file &&
      typeof deletedFile.file.id === 'number'
    ) {
      updatedDeleted.push(deletedFile.file.id);
    }

    const newUploadedFiles = updatedFiles.filter(
      (file): file is File => file instanceof File,
    );

    setData({
      ...data,
      newFiles: newUploadedFiles,
      deleted: updatedDeleted,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('caption', data.caption);
    formData.append('location', data.location);
    formData.append('tags', data.tags);
    formData.append('deleted', JSON.stringify(data.deleted));

    data.newFiles.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    if (action === 'Create') {
      router.post(postRoutes.store().url, formData, {
        forceFormData: true,
        onSuccess: () => {
          reset();
        },
        onError: (error) => {
          console.log('Error:', error);
        },
      });
    } else if (action === 'Update') {
      formData.append('_method', 'PATCH');
      router.post(('post.update', data.slug), formData, {
        forceFormData: true,
        onSuccess: () => console.log('Updated successfully'),
        onError: (error) => console.log('Error:', error),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-5xl flex-col space-y-4"
    >
      {/* Caption */}
      <div className="flex flex-col gap-4">
        <label className="text-lg font-bold">Add caption:</label>
        <Tiptap
          value={data.caption}
          onChange={(value) => setData('caption', value)}
        />
        {errors.caption && <div className="text-red-500">{errors.caption}</div>}
      </div>

      {/* File Upload */}
      <div className="flex flex-col">
        <label className="text-lg font-bold">Add photos:</label>
        <PostUpload onChange={handleFilesChange} initialFiles={initialFiles} />
        {errors.newFiles && (
          <div className="text-red-500">{errors.newFiles}</div>
        )}
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold">Add location:</label>
        <Input
          type="text"
          className="h-12 rounded-xl border-none bg-dark-4 ring-offset-light-3 placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1"
          value={data.location}
          onChange={(e) => setData('location', e.target.value)}
        />
        {errors.location && (
          <div className="text-red-500">{errors.location}</div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold">
          Add tags: (separated by comma ",")
        </label>
        <Input
          type="text"
          className="h-12 rounded-xl border-none bg-dark-4 ring-offset-light-3 placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1"
          placeholder="Mobile Legends, PUBG, League of Legends"
          value={data.tags}
          onChange={(e) => setData('tags', e.target.value)}
        />
        {errors.tags && <div className="text-red-500">{errors.tags}</div>}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={processing} className="">
        {action} Post
      </Button>
    </form>
  );
};

export default PostForm;
