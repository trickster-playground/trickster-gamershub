/**
 * Node Modules
 */
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Types
 */
import { TournamentPost } from '@/types/tournaments';

/**
 * Assets
 */
import { createdAt, dateRange } from '@/lib/format/date';
import { Link, router } from '@inertiajs/react';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Eye,
  EyeOff,
  MoreHorizontal,
  Star,
} from 'lucide-react';
import { comicToast } from '../../ui/toasts/comic-toast';

const TOURNAMENT_STATUSES = [
  'draft',
  'upcoming',
  'ongoing',
  'finished',
  'cancelled',
] as const;

const SortableHeader = ({ column, title }: { column: any; title: string }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
      >
        <span>{title}</span>
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
        <ArrowUp /> Asc
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
        <ArrowDown /> Desc
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
        <EyeOff /> Hide
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const statusColor: Record<string, string> = {
  draft: 'bg-gray-500',
  upcoming: 'bg-blue-600',
  ongoing: 'bg-green-600',
  finished: 'bg-zinc-600',
  cancelled: 'bg-red-600',
};

export const tournamentPostColumns: ColumnDef<TournamentPost>[] = [
  // =========================
  // Select (desktop only)
  // =========================
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

  // =========================
  // Tournament (Title + Slug)
  // =========================
  {
    id: 'tournament',
    accessorKey: 'title',
    header: ({ column }) => (
      <SortableHeader column={column} title="Tournament" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="leading-tight font-medium">{row.original.title}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.slug}
        </span>
      </div>
    ),
  },

  // =========================
  // Status
  // =========================
  {
    accessorKey: 'status',
    filterFn: 'equalsString',

    header: ({ column }) => {
      const sort = column.getIsSorted();

      return (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
              >
                <span>Status</span>

                {sort === 'desc' && <ArrowDown />}
                {sort === 'asc' && <ArrowUp />}
                {!sort && <ChevronsUpDown />}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-fit">
              {/* Sorting */}
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Asc
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDown className="mr-2 h-4 w-4" />
                Desc
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Filter */}
              {TOURNAMENT_STATUSES.map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  checked={column.getFilterValue() === status}
                  onCheckedChange={(checked) =>
                    column.setFilterValue(checked ? status : undefined)
                  }
                  className="flex w-full items-center gap-2 p-2"
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${statusColor[status]}`}
                  />
                  <span className="text-sm capitalize">
                    {status.replace('_', ' ')}
                  </span>
                </DropdownMenuCheckboxItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => column.setFilterValue(undefined)}
              >
                Clear filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },

    cell: ({ getValue }) => {
      const value = getValue<TournamentPost['status']>();

      return (
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${statusColor[value]}`} />
          <span className="capitalize">{value.replace('_', ' ')}</span>
        </div>
      );
    },
  },

  // =========================
  // Schedule (desktop)
  // =========================
  {
    id: 'schedule',
    header: 'Schedule',
    cell: ({ row }) => (
      <div className="relative pl-6 text-sm">
        {/* vertical line */}
        <div className="absolute top-2 left-2 h-full w-px bg-border" />

        {/* Regist */}
        <div className="relative mb-3">
          <span className="absolute top-1.5 -left-6 h-2.5 w-2.5 rounded-full bg-blue-500" />
          <div className="text-xs text-muted-foreground">Registration</div>
          <div className="font-medium">
            {dateRange(
              row.original.registration_start,
              row.original.registration_end,
            )}
          </div>
        </div>

        {/* Event */}
        <div className="relative">
          <span className="absolute top-1.5 -left-6 h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <div className="text-xs text-muted-foreground">Event</div>
          <div className="font-medium">
            {dateRange(row.original.start_date, row.original.end_date)}
          </div>
        </div>
      </div>
    ),
  },

  // =========================
  // Capacity
  // =========================
  {
    id: 'capacity',
    header: 'Capacity',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.max_participants
          ? `0 / ${row.original.max_participants}`
          : '∞'}
      </span>
    ),
  },

  // =========================
  // Visibility
  // =========================
  {
    id: 'visibility',
    header: 'Visibility',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.is_published ? (
          <Eye className="h-4 w-4 text-green-600" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}

        {row.original.is_featured && (
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        )}
      </div>
    ),
  },

  // =========================
  // Created
  // =========================
  {
    accessorKey: 'created_at',
    header: ({ column }) => <SortableHeader column={column} title="Created" />,
    cell: ({ getValue }) => {
      const { absolute, relative } = createdAt(getValue() as string);

      return (
        <div className="text-sm">
          <div className="font-medium">{absolute}</div>
        </div>
      );
    },
  },

  // =========================
  // Actions
  // =========================
  {
    id: 'actions',
    enableHiding: false,
    header: () => <div>Actions</div>,
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
                href={`/administrator/tournaments/${item.slug}/edit`}
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
                    Delete tournament post?
                  </AlertDialogTitle>

                  <AlertDialogDescription className="text-sm text-muted-foreground">
                    This action cannot be undone. The tournament post{' '}
                    <span className="font-medium text-foreground">
                      “{item.title}”
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
                      router.delete(`/administrator/tournaments/${item.slug}`, {
                        onSuccess: () =>
                          comicToast.success('Tournament post deleted'),
                        onError: () =>
                          comicToast.error('Failed to delete tournament post'),
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
