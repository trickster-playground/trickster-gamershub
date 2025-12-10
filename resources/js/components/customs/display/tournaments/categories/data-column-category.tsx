/**
 * Node Modules
 */
import { Link } from '@inertiajs/react';
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
  DropdownMenuLabel,
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
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  EyeOff,
  MoreHorizontal,
} from 'lucide-react';

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
    cell: ({ row }) => {
      const item = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(item.slug.toString())
              }
            >
              Copy Slug
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* Edit */}
            <DropdownMenuItem asChild>
              <Link href={`/administrator/category/${item.slug}/edit`}>
                Edit
              </Link>
            </DropdownMenuItem>
            {/* Delete */}
            {/* <DropdownMenuItem
              onClick={() => {
                if (confirm(`Delete category "${item.name}"?`)) {
                  router.delete(route('admin.category.destroy', item.slug), {
                    preserveScroll: true,
                  });
                }
              }}
            >
              Delete
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
