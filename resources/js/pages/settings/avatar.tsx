/**
 * React & Inertia
 */
import { Form, Head, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

/**
 * Layouts
 */
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

/**
 * Components UI
 */
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Components Display
 */
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Transition } from '@headlessui/react';

/**
 * Actions & Routes
 */
import AvatarController from '@/actions/App/Http/Controllers/Settings/AvatarController';
import { edit } from '@/routes/avatar';

/**
 * Assets
 */
import { IconCloud, IconTrash, IconUpload } from '@tabler/icons-react';

/**
 * Types
 */
import { type BreadcrumbItem, type SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Avatar Settings',
    href: edit().url,
  },
];

export default function Avatar() {
  const { auth } = usePage<SharedData>().props;

  // Preview state for avatar
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  //Preview state for background
  const [previewBackground, setPreviewBackground] = useState<string | null>(
    null,
  );
  const backgroundInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Avatar settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Avatar & Background information"
            description="Update your avatar and background image"
          />

          <Form
            {...AvatarController.update.form()}
            method="post"
            encType="multipart/form-data"
            options={{ preserveScroll: true }}
            className="space-y-6"
          >
            {({ processing, recentlySuccessful, errors }) => (
              <>
                {/* Avatar */}
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">Profile Avatar</Label>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6">
                    {previewAvatar || auth.user.avatar ? (
                      <>
                        <img
                          src={
                            previewAvatar ||
                            `/storage/${auth.user.avatar?.path}`
                          }
                          className="size-50 rounded-full border object-cover"
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2 hover:bg-red-600"
                          onClick={() => {
                            setPreviewAvatar(null);
                            if (avatarInputRef.current) {
                              avatarInputRef.current.value = '';
                            }
                          }}
                        >
                          <IconTrash size={16} />
                          Remove
                        </Button>
                      </>
                    ) : (
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <IconCloud size={32} />
                          </EmptyMedia>
                          <EmptyTitle>No avatar uploaded</EmptyTitle>
                          <EmptyDescription>
                            Upload avatar for your profile.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Label
                            htmlFor="avatar"
                            className="flex cursor-pointer items-center gap-2 text-sm hover:underline"
                          >
                            <IconUpload size={16} />
                            Choose File
                          </Label>
                        </EmptyContent>
                      </Empty>
                    )}

                    <Input
                      ref={avatarInputRef}
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreviewAvatar(URL.createObjectURL(file));
                        }
                      }}
                    />

                    <InputError className="mt-2" message={errors.avatar} />
                  </div>
                </div>

                {/* Background */}
                <div className="grid gap-2">
                  <Label className="text-sm font-medium">
                    Profile Background
                  </Label>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-6">
                    {previewBackground || auth.user.background ? (
                      <>
                        <img
                          src={
                            previewBackground ||
                            `/storage/${auth.user.background?.path}`
                          }
                          className="aspect-video h-48 w-full rounded-md border object-cover"
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-2 hover:bg-red-600"
                          onClick={() => {
                            setPreviewBackground(null);
                            if (backgroundInputRef.current) {
                              backgroundInputRef.current.value = '';
                            }
                          }}
                        >
                          <IconTrash size={16} />
                          Remove
                        </Button>
                      </>
                    ) : (
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <IconCloud size={32} />
                          </EmptyMedia>
                          <EmptyTitle>No background uploaded</EmptyTitle>
                          <EmptyDescription>
                            Upload background for your profile.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Label
                            htmlFor="background"
                            className="flex cursor-pointer items-center gap-2 text-sm hover:underline"
                          >
                            <IconUpload size={16} />
                            Choose File
                          </Label>
                        </EmptyContent>
                      </Empty>
                    )}

                    <Input
                      ref={backgroundInputRef}
                      id="background"
                      name="background"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreviewBackground(URL.createObjectURL(file));
                        }
                      }}
                    />

                    <InputError className="mt-2" message={errors.background} />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    disabled={processing}
                    data-test="update-profile-button"
                  >
                    Save
                  </Button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-white">
                      Update Avatar Successfully!
                    </p>
                  </Transition>
                </div>
              </>
            )}
          </Form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
