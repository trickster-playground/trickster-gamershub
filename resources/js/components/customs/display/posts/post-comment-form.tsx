import PostCommentController from '@/actions/App/Http/Controllers/Posts/PostCommentController';
import InputError from '@/components/input-error';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import Tiptap from './tiptap';

interface PostCommentFormProps {
  postId: number;
}

const PostCommentForm = ({ postId }: PostCommentFormProps) => {
  const { data, setData, post, processing, reset, errors } = useForm({
    comment: '',
    post_id: postId,
  });

  const handlePostComment = (e: FormEvent) => {
    e.preventDefault();

    post(PostCommentController.store().url, {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (err) => console.log(err),
    });
  };

  return (
    <div className="sticky bottom-2 mt-4 w-full">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 rounded-[20px] bg-dark-4 px-8">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <h1 className="font-semibold">Leave a comment ...</h1>
            </AccordionTrigger>
            <AccordionContent className="px-2">
              <form onSubmit={handlePostComment}>
                <Tiptap
                  value={data.comment}
                  onChange={(value) => setData('comment', value)}
                />
                <div className="mt-2 flex flex-col items-center justify-center gap-2">
                  <InputError message={errors.comment} className="mt-2" />
                  <button
                    type="submit"
                    className="comic-button"
                    disabled={processing}
                  >
                    Comment
                  </button>
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default PostCommentForm;
