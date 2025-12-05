'use client';

/**
 * Node Modules
 */
import { useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
/**
 * Components
 */
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import Tiptap from './tiptap';

/**
 * Controller
 */
import PostCommentController from '@/actions/App/Http/Controllers/Posts/PostCommentController';

interface PostCommentFormProps {
  postId: number;
  onRegisterEdit: (fn: (id: number, content: string) => void) => void;
}

const PostCommentForm = ({ postId, onRegisterEdit }: PostCommentFormProps) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const { data, setData, post, patch, processing, reset, errors, clearErrors } =
    useForm({
      comment: '',
      post_id: postId,
    });

  // From comment card
  const startEditing = (id: number, content: string) => {
    setIsEditing(true);
    setEditingCommentId(id);
    setData('comment', content);
    setOpen(true);
  };

  // register function to parent component
  useEffect(() => {
    onRegisterEdit(startEditing);
  }, []);

  // Handel create or update
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEditing && editingCommentId) {
      // Update comment
      patch(PostCommentController.update(editingCommentId).url, {
        onSuccess: () => {
          reset();
          setOpen(false);
          setIsEditing(false);
          setEditingCommentId(null);
        },
      });
    } else {
      // Create comment
      post(PostCommentController.store().url, {
        preserveScroll: true,
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      });
    }
  };

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            reset();
            clearErrors();
            setIsEditing(false);
            setEditingCommentId(null);
          }
        }}
      >
        <DrawerTrigger asChild>
          <button className="comic-button sticky bottom-1 mx-auto flex w-full max-w-4xl cursor-pointer justify-center text-center">
            Leave a comment...
          </button>
        </DrawerTrigger>

        <DrawerContent className="border-dark-3 bg-dark-3">
          <div className="mx-auto w-full max-w-3xl p-4">
            <DrawerHeader>
              <DrawerTitle className="text-light-1">
                {isEditing ? 'Update comment' : 'Write a comment'}
              </DrawerTitle>
              <DrawerDescription className="text-light-3">
                {isEditing
                  ? 'Modify your comment.'
                  : 'Share your thoughts about this post.'}
              </DrawerDescription>
            </DrawerHeader>

            <form onSubmit={handleSubmit}>
              <div className="mt-2">
                <Tiptap
                  value={data.comment}
                  onChange={(value) => setData('comment', value)}
                />
              </div>

              <InputError message={errors.comment} className="mt-2" />

              <DrawerFooter className="flex flex-row-reverse gap-3">
                <button
                  type="submit"
                  disabled={processing}
                  className="comic-button cursor-pointer"
                >
                  {isEditing ? 'Update' : 'Comment'}
                </button>

                <DrawerClose asChild>
                  <Button
                    type="button"
                    className="red-comic-button cursor-pointer"
                    onClick={() => {
                      reset();
                      clearErrors();
                      setIsEditing(false);
                      setEditingCommentId(null);
                    }}
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PostCommentForm;
