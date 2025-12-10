/**
 * Node Modules
 */
import { Form, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';

/**
 * Components
 */
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/**
 * Actions Controller
 */
import TournamentCategoryController from '@/actions/App/Http/Controllers/Admin/Tournaments/TournamentCategoryController';

/**
 * Assets
 */
import { IconTrash, IconUpload } from '@tabler/icons-react';

export default function FormCategory() {
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);
  const iconInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 py-4">
      <div className="flex items-center justify-between">
        <HeadingSmall
          title="Create Tournament Category"
          description="Add a new tournament category for games or events."
        />

        <div>
          <Link href={`/administrator/category`}>
            <Button className="red-comic-button">Back</Button>
          </Link>
        </div>
      </div>

      <Form
        {...TournamentCategoryController.store.form()}
        method="post"
        encType="multipart/form-data"
        options={{ preserveScroll: true }}
        className="space-y-6"
      >
        {({ processing, errors }) => (
          <>
            {/* Name */}
            <div className="grid gap-4">
              <Label className="text-md font-medium">Category Name</Label>
              <Input
                name="name"
                placeholder="e.g. Mobile Legends"
                className="h-14"
              />
              <InputError message={errors.name} />
            </div>

            {/* Icon Upload */}
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
                        if (iconInputRef.current) {
                          iconInputRef.current.value = '';
                        }
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
                  if (file) setPreviewIcon(URL.createObjectURL(file));
                }}
              />

              <InputError message={errors.icon} />
            </div>

            {/* Description */}
            <div className="grid gap-4">
              <Label className="text-md font-medium">
                Category Description
              </Label>
              <Textarea
                name="description"
                placeholder="Short description about the category..."
                rows={3}
              />
              <InputError message={errors.description} />
            </div>

            {/* Color */}
            <div className="grid gap-4">
              <Label className="text-md font-medium">Category Color</Label>
              <Input name="color" type="color" className="h-15 w-30 p-1" />
              <InputError message={errors.color} />
            </div>

            {/* Save */}
            <div className="flex justify-center gap-4">
              <Button
                className="comic-button h-12 w-full"
                disabled={processing}
              >
                Save Category
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
