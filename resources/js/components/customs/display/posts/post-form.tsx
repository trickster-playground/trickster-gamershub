'use client';

/**
 * Node Modules
 */
import { router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

/**
 * Routes
 */
import postRoutes from '@/routes/post';

/**
 * Components
 */
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <form onSubmit={handleSubmit} className="flex w-full max-w-4xl space-y-6">
      <div className="w-full space-y-6">
        {/* Caption */}
        <div className="grid w-full gap-2">
          <Label
            htmlFor="caption"
            className="text-lg font-bold tracking-widest"
          >
            Add Caption
          </Label>

          <Tiptap
            value={data.caption}
            onChange={(value) => setData('caption', value)}
          />
          {errors.caption && (
            <InputError className="mt-2" message={errors.caption} />
          )}
        </div>

        {/* File Upload */}
        <div className="grid w-full gap-2">
          <Label
            htmlFor="uploads"
            className="text-lg font-bold tracking-widest"
          >
            Add Images
          </Label>
          <PostUpload onChange={handleFilesChange} value={initialFiles} />
          {errors.newFiles && (
            <div className="text-red-500">{errors.newFiles}</div>
          )}
        </div>

        {/* Location */}
        <div className="grid w-full gap-2">
          <Label
            htmlFor="location"
            className="text-lg font-bold tracking-widest"
          >
            Add Location
          </Label>

          <Input
            id="location"
            name="location"
            type="text"
            className="mt-1 block h-12 w-full"
            value={data.location}
            placeholder="Type the location here..."
            autoComplete="location"
            onChange={(e) => setData('location', e.target.value)}
          />
          {errors.location && (
            <InputError className="mt-2" message={errors.location} />
          )}
        </div>

        {/* Tags */}
        <div className="grid w-full gap-2">
          <Label htmlFor="tags" className="text-lg font-bold tracking-widest">
            Add tags: (separated by comma ",")
          </Label>

          <Input
            id="tags"
            name="tags"
            type="text"
            className="mt-1 block h-12 w-full"
            placeholder="Ex: gaming, trickster, fun"
            autoComplete="tags"
            value={data.tags}
            onChange={(e) => setData('tags', e.target.value)}
          />

          {errors.tags && <InputError className="mt-2" message={errors.tags} />}
        </div>

        {/* Submit */}

        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={processing}
            className="comic-button w-full"
          >
            {action} Post
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
