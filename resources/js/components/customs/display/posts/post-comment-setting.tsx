/**
 * Node Modules
 */
import { ReactNode } from 'react';
/**
 * Components
 */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Assets
 */
import { IconEdit, IconSettings, IconTrash } from '@tabler/icons-react';

interface PostCommentSettingsProps {
  commentId: number;
  onDelete?: () => void; // optional if needed delete action
  children?: ReactNode; // if need to inject custom trigger
  commentContent: string;
  onEdit: (id: number, content: string) => void;
}

const PostCommentSettings = ({
  commentId,
  onDelete,
  children,
  commentContent,
  onEdit,
}: PostCommentSettingsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children ?? (
          <IconSettings className="cursor-pointer text-blue-400 hover:text-blue-500" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <button
            className="group flex w-full cursor-pointer items-center justify-between"
            onClick={() => onEdit(commentId, commentContent)}
          >
            <p className="group-hover:text-blue-500">Update</p>
            <IconEdit
              className="size-5 text-blue-400 group-hover:text-blue-500"
              stroke="2"
            />
          </button>
        </DropdownMenuItem>

        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger className="group flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-zinc-800 hover:text-red-500 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              Delete
              <IconTrash
                className="size-5 text-red-400 group-hover:text-red-500"
                stroke={2}
              />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your post and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostCommentSettings;
