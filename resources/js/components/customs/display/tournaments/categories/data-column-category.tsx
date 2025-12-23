/**
 * Node Modules
 */
import { Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Types
 */
import { TournamentCategory } from '@/types/tournaments';

/**
 * Assets
 */
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
  MoreHorizontal,
} from 'lucide-react';
import { comicToast } from '../../ui/toasts/comic-toast';

export const tournamentCategoryColumns: ColumnDef<TournamentCategory>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'icon',
    header: 'Icon',
    cell: ({ row }) => {
      const iconPath = row.getValue('icon');

      if (!iconPath) {
        return (
          <div className="flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No Icon</span>
          </div>
        );
      }

      return (
        <img
          src={`${iconPath}`}
          alt="Icon"
          className="h-20 w-20 rounded-md border object-cover"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },

  // Name
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              <span>Name</span>
              {column.getIsSorted() === 'desc' ? (
                <ArrowDown />
              ) : column.getIsSorted() === 'asc' ? (
                <ArrowUp />
              ) : (
                <ChevronsUpDown />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown />
              Desc
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff />
              Hide
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },

  // Slug
  {
    accessorKey: 'slug',
    header: 'Slug',
  },

  // Color
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4 rounded-full border"
          style={{ backgroundColor: getValue() as string }}
        />
        <span>{getValue() as string}</span>
      </div>
    ),
  },

  // Created At
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString();
    },
  },

  // Actions
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="rounded-full border border-border bg-background shadow-sm transition-all hover:scale-105 hover:shadow-md"
            >
              <MoreHorizontal className="size-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-fit animate-in rounded-2xl border border-border/60 bg-gradient-to-br from-background to-muted/40 p-2 shadow-2xl backdrop-blur-xl fade-in slide-in-from-top-2"
          >
            {/* VIEW */}
            <DropdownMenuItem className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted">
              <span className="absolute inset-y-0 left-0 w-1 bg-green-500 opacity-0 transition group-hover:opacity-100" />
              <IconEye className="size-5 text-muted-foreground transition group-hover:text-foreground" />
              View
            </DropdownMenuItem>

            {/* EDIT */}
            <DropdownMenuItem asChild>
              <Link
                href={`/administrator/category/${item.slug}/edit`}
                className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted"
              >
                <span className="absolute inset-y-0 left-0 w-1 bg-blue-500 opacity-0 transition group-hover:opacity-100" />
                <IconEdit className="size-5 text-muted-foreground transition group-hover:text-foreground" />
                Edit
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 opacity-40" />

            {/* DELETE */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="group relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted"
                >
                  <span className="absolute inset-y-0 left-0 w-1 bg-red-500 opacity-0 transition group-hover:opacity-100" />
                  <IconTrash className="size-5 text-muted-foreground transition group-hover:text-foreground" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>

              <AlertDialogContent className="animate-in rounded-2xl border shadow-2xl backdrop-blur-xl zoom-in-95 fade-in">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-semibold">
                    Delete tournament category?
                  </AlertDialogTitle>

                  <AlertDialogDescription className="text-sm text-muted-foreground">
                    This action cannot be undone. The tournament category{' '}
                    <span className="font-medium text-foreground">
                      “{item.name}”
                    </span>{' '}
                    will be permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="rounded-xl">
                    Cancel
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={() => {
                      router.delete(`/administrator/category/${item.slug}`, {
                        onSuccess: () =>
                          comicToast.success('Tournament category deleted'),
                        onError: () =>
                          comicToast.error(
                            'Failed to delete tournament category',
                          ),
                      });
                    }}
                    className="rounded-xl bg-red-600 px-6 font-semibold hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
