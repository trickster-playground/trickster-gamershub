import { Link, router, useForm } from '@inertiajs/react';
import { FormEvent, useRef, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import tournamentCategoryRoutes from '@/routes/admin/category';

import { TournamentCategory } from '@/types/tournaments';
import { IconTrash, IconUpload } from '@tabler/icons-react';

interface FormCategoryProps {
  tournamentCategory?: TournamentCategory;
}

export default function FormCategory({
  tournamentCategory,
}: FormCategoryProps) {
  const iconInputRef = useRef<HTMLInputElement | null>(null);
  const [previewIcon, setPreviewIcon] = useState<string | null>(
    tournamentCategory?.icon ?? null,
  );

  const { data, setData, processing, errors, reset } = useForm({
    name: tournamentCategory?.name ?? '',
    description: tournamentCategory?.description ?? '',
    color: tournamentCategory?.color ?? '#000000',
    icon: null as File | null,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', String(data.name));
    formData.append('description', String(data.description));
    formData.append('color', String(data.color));
    if (data.icon) formData.append('icon', data.icon);

    if (tournamentCategory) {
      formData.append('_method', 'PATCH');
      router.post(
        tournamentCategoryRoutes.update(tournamentCategory.slug).url,
        formData,
        {
          forceFormData: true,
          onSuccess: () => console.log('Updated successfully'),
          onError: (error) => console.log('Error:', error),
        },
      );
    } else {
      router.post(tournamentCategoryRoutes.store().url, formData, {
        forceFormData: true,
        onSuccess: () => {
          reset();
        },
        onError: (error) => {
          console.log('Error:', error);
        },
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 py-4">
      <div className="flex items-center justify-between">
        <HeadingSmall
          title={
            tournamentCategory
              ? 'Edit Tournament Category'
              : 'Create Tournament Category'
          }
          description={
            tournamentCategory
              ? 'Update this tournament category.'
              : 'Add a new tournament category.'
          }
        />
        <div>
          <Link href={`/administrator/category`}>
            <Button className="red-comic-button">Back</Button>
          </Link>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6"
      >
        {/* Name */}
        <div className="grid gap-4">
          <Label className="text-md font-medium">Category Name</Label>
          <Input
            name="name"
            placeholder="e.g. Mobile Legends"
            className="h-14"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
          />
          <InputError message={errors.name} />
        </div>

        {/* Icon */}
        <div className="grid gap-4">
          <Label className="text-md font-medium">Category Icon</Label>
          <div className="flex items-center gap-8">
            {previewIcon ? (
              <img
                src={previewIcon}
                className="h-40 w-40 rounded-lg border object-cover"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-lg border text-xs text-muted-foreground">
                No Icon
              </div>
            )}

            <div className="flex flex-col gap-2">
              {!previewIcon && (
                <Label
                  htmlFor="icon"
                  className="flex cursor-pointer items-center gap-2 text-sm hover:underline"
                >
                  <IconUpload size={30} /> Upload Icon
                </Label>
              )}
              {previewIcon && (
                <button
                  type="button"
                  className="text-md flex cursor-pointer items-center gap-2 text-red-600 hover:underline"
                  onClick={() => {
                    setPreviewIcon(null);
                    setData('icon', null);
                    if (iconInputRef.current) iconInputRef.current.value = '';
                  }}
                >
                  <IconTrash size={30} /> Remove
                </button>
              )}
            </div>
          </div>

          <Input
            ref={iconInputRef}
            id="icon"
            name="icon"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setData('icon', file ?? null);
              if (file) setPreviewIcon(URL.createObjectURL(file));
            }}
          />
          <InputError message={errors.icon} />
        </div>

        {/* Description */}
        <div className="grid gap-4">
          <Label className="text-md font-medium">Category Description</Label>
          <Textarea
            name="description"
            rows={3}
            placeholder="Short description about the category..."
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
          />
          <InputError message={errors.description} />
        </div>

        {/* Color */}
        <div className="grid gap-4">
          <Label className="text-md font-medium">Category Color</Label>
          <Input
            name="color"
            type="color"
            className="h-15 w-30 p-1"
            value={data.color}
            onChange={(e) => setData('color', e.target.value)}
          />
          <InputError message={errors.color} />
        </div>

        {/* Save */}
        <div className="flex justify-center gap-4">
          <Button className="comic-button h-12 w-full" disabled={processing}>
            {tournamentCategory ? 'Update Category' : 'Save Category'}
          </Button>
        </div>
      </form>
    </div>
  );
}
