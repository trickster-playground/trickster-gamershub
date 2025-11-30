import PostController from '@/actions/App/Http/Controllers/Posts/PostController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import Tiptap from './tiptap';

const PostForm = () => {
  const [caption, setCaption] = useState('');

  return (
    <div className="w-full max-w-4xl">
      <Form
        {...PostController.store.form()}
        options={{
          preserveScroll: true,
        }}
        className="space-y-6"
      >
        {({ processing, recentlySuccessful, errors }) => (
          <>
            <div className="w-full space-y-6">
              <div className="grid w-full gap-2">
                <Label
                  htmlFor="caption"
                  className="text-lg font-bold tracking-widest"
                >
                  Add Caption
                </Label>

                <Tiptap
                  value={caption}
                  onChange={(value) => setCaption(value)}
                  className='mt-1 block h-18 w-full'
                />

                <Input
                  id="caption"
                  type="hidden"
                  className="mt-1 block h-12 w-full"
                  defaultValue={``}
                  value={caption}
                  name="caption"
                />

                <InputError className="mt-2" message={errors.caption} />
              </div>

              <div className="grid w-full gap-2">
                <Label
                  htmlFor="location"
                  className="text-lg font-bold tracking-widest"
                >
                  Add Location
                </Label>

                <Input
                  id="location"
                  className="mt-1 block h-12 w-full"
                  defaultValue={``}
                  name="location"
                  required
                  autoComplete="location"
                  placeholder="Type the location here..."
                />

                <InputError className="mt-2" message={errors.location} />
              </div>

              <div className="grid w-full gap-2">
                <Label
                  htmlFor="tags"
                  className="text-lg font-bold tracking-widest"
                >
                  Add tags: (separated by comma ",")
                </Label>

                <Input
                  id="tags"
                  className="mt-1 block h-12 w-full"
                  defaultValue={``}
                  name="tags"
                  required
                  autoComplete="tags"
                  placeholder="Ex: gaming, trickster, fun"
                />

                <InputError className="mt-2" message={errors.tags} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                disabled={processing}
                data-test="update-profile-button"
                className="comic-button w-full"
              >
                Create Post
              </Button>

              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-white">Post Created Successfully.</p>
              </Transition>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default PostForm;
