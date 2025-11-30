import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { SocialLink, type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, router, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: edit().url,
  },
];

export default function Profile({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
}) {
  const { auth } = usePage<SharedData>().props;

  const socialPlatforms = ['instagram', 'facebook', 'linkedin', 'website'];

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    Array.isArray(auth.user.social_links) ? auth.user.social_links : [],
  );

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    const link = socialLinks[index];

    if (link.id) {
      deleteSocialLink(link.id);
    } else {
      const newLinks = [...socialLinks];
      newLinks.splice(index, 1);
      setSocialLinks(newLinks);
    }
  };

  const deleteSocialLink = (id: number) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;

    router.delete(ProfileController.destroySocialLink.url({ id }), {
      preserveScroll: true,
      onSuccess: () => {
        setSocialLinks((prev) => prev.filter((link) => link.id !== id));
      },
      onError: (err) => {
        console.error('Gagal hapus link:', err);
      },
    });
  };

  const handleSocialLinkChange = (
    index: number,
    key: keyof SocialLink,
    value: string,
  ) => {
    const updated = [...socialLinks];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    setSocialLinks(updated);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Profile information"
            description="Update your name, username, email, and biography"
          />

          <Form
            {...ProfileController.update.form()}
            options={{
              preserveScroll: true,
            }}
            className="space-y-6"
          >
            {({ processing, recentlySuccessful, errors }) => (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>

                    <Input
                      id="name"
                      className="mt-1 block w-full"
                      defaultValue={auth.user.name}
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Full name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Username</Label>

                    <Input
                      id="username"
                      className="mt-1 block w-full"
                      defaultValue={auth.user.username}
                      name="username"
                      required
                      autoComplete="username"
                      placeholder="Username"
                    />

                    <InputError className="mt-2" message={errors.username} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>

                  <Input
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    defaultValue={auth.user.email}
                    name="email"
                    required
                    autoComplete="username"
                    placeholder="Email address"
                  />

                  <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && auth.user.email_verified_at === null && (
                  <div>
                    <p className="-mt-4 text-sm text-muted-foreground">
                      Your email address is unverified.{' '}
                      <Link
                        href={send()}
                        as="button"
                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                      >
                        Click here to resend the verification email.
                      </Link>
                    </p>

                    {status === 'verification-link-sent' && (
                      <div className="mt-2 text-sm font-medium text-green-600">
                        A new verification link has been sent to your email
                        address.
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="name">Biography</Label>

                  <Textarea
                    id="bio"
                    className="mt-1 block w-full"
                    defaultValue={auth.user.bio}
                    name="bio"
                    required
                    autoComplete="bio"
                    placeholder="Bio"
                  />

                  <InputError className="mt-2" message={errors.bio} />
                </div>

                {/* Social Links */}
                <div className="grid gap-2">
                  <Label>Social Links</Label>

                  {socialLinks.map((link, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 items-center gap-2"
                    >
                      {/* PLATFORM */}
                      <input
                        type="hidden"
                        name={`socialLinks[${index}][platform]`}
                        value={link.platform}
                      />

                      {/* URL */}
                      <input
                        type="hidden"
                        name={`socialLinks[${index}][url]`}
                        value={link.url}
                      />

                      <div className="col-span-4">
                        <Select
                          value={link.platform}
                          onValueChange={(value) =>
                            handleSocialLinkChange(index, 'platform', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Platform" />
                          </SelectTrigger>
                          <SelectContent>
                            {socialPlatforms
                              .filter(
                                (platform) =>
                                  !socialLinks.some(
                                    (link, i) =>
                                      link.platform === platform && i !== index,
                                  ),
                              )
                              .map((platform) => (
                                <SelectItem key={platform} value={platform}>
                                  {platform.charAt(0).toUpperCase() +
                                    platform.slice(1)}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-6">
                        <Input
                          type="url"
                          placeholder="https://yourlink.com"
                          value={link.url}
                          onChange={(e) =>
                            handleSocialLinkChange(index, 'url', e.target.value)
                          }
                        />
                      </div>

                      <div className="col-span-2">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => handleRemoveSocialLink(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={handleAddSocialLink}
                    disabled={socialLinks.length >= socialPlatforms.length}
                    className=''
                    variant={'outline'}
                  >
                    + Add Social Link
                  </Button>
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
                      Update Profile Successfully!
                    </p>
                  </Transition>
                </div>
              </>
            )}
          </Form>
        </div>

        <DeleteUser />
      </SettingsLayout>
    </AppLayout>
  );
}
