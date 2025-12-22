/**
 * Node Modules
 */
import { ColumnDef } from '@tanstack/react-table';

/**
 * Components
 */
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
import { TournamentPost } from '@/types/tournaments';

/**
 * Assets
 */
import { Link, router } from '@inertiajs/react';
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
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<TournamentPost['status']>();
      return (
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${statusColor[status]}`} />
          <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
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
      <div className="text-sm leading-snug">
        <div>
          <span className="font-medium">Reg:</span>{' '}
          {row.original.registration_start} – {row.original.registration_end}
        </div>
        <div className="text-muted-foreground">
          <span className="font-medium">Event:</span> {row.original.start_date}{' '}
          – {row.original.end_date}
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
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },

  // =========================
  // Actions
  // =========================
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/administrator/tournaments/${item.slug}/edit`}>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                if (!confirm(`Delete tournament "${item.title}"?`)) return;

                router.delete(`/administrator/tournaments/${item.slug}`, {
                  onSuccess: () => {
                    comicToast.success('Tournament deleted');
                  },
                  onError: () => {
                    comicToast.error('Failed to delete tournament');
                  },
                });
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
