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
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';

export const tournamentPostColumns: ColumnDef<TournamentPost>[] = [
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

  // Title
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
            >
              <span>Title</span>
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
  //   {
  //     id: 'actions',
  //     cell: ({ row }) => {
  //       const item = row.original;

  //       // Handle Delete Tournament Category
  //       const handleDeleteTournamentCategory = (slug: string) => {
  //         const { url, method } = TournamentCategoryController.destroy(slug);

  //         router.visit(url, {
  //           method,
  //           onSuccess: () => {
  //             console.log('Tournament category deleted');
  //           },
  //         });
  //       };
  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <MoreHorizontal />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //             <DropdownMenuItem
  //               onClick={() =>
  //                 navigator.clipboard.writeText(item.slug.toString())
  //               }
  //             >
  //               Copy Slug
  //             </DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             {/* Edit */}
  //             <DropdownMenuItem asChild>
  //               <Link href={`/administrator/category/${item.slug}/edit`}>
  //                 Edit
  //               </Link>
  //             </DropdownMenuItem>
  //             {/* Delete */}
  //             <DropdownMenuItem
  //               onClick={() => {
  //                 if (confirm(`Delete category "${item.name}"?`)) {
  //                   handleDeleteTournamentCategory(item.slug);
  //                 }
  //               }}
  //             >
  //               Delete
  //             </DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   },
];
