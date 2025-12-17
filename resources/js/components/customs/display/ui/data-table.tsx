/**
 * Node Modules
 */
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DataTableColumnToggler from '../ui/data-table-column-toggler';
import DataTablePagination from '../ui/data-table-pagination';

/**
 * Assets
 */
import { Link } from '@inertiajs/react';
import { IconMoodSadDizzy } from '@tabler/icons-react';
import { RefreshCcwIcon } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  url?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  url,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full px-8">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <Input
            placeholder="Filter name..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          {/* Toggler Components */}
          <DataTableColumnToggler
            columns={table.getAllColumns()}
            onToggle={(columnId, value) =>
              table.getColumn(columnId)?.toggleVisibility(value)
            }
          />
        </div>
        <div className="flex items-center">
          <Link href={url}>
            <Button>Add {title}</Button>
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        {/* Table */}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Empty className="h-full bg-gradient-to-b from-dark-1/50 from-30% to-background">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <IconMoodSadDizzy />
                      </EmptyMedia>
                      <EmptyTitle>No {title}</EmptyTitle>
                      <EmptyDescription>
                        You&apos;re all caught up. New {title} will appear here.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button variant="outline" size="sm">
                        <RefreshCcwIcon />
                        Refresh
                      </Button>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Components */}
      <div className="mt-3">
        <DataTablePagination
          selectedCount={table.getFilteredSelectedRowModel().rows.length}
          filteredCount={table.getFilteredRowModel().rows.length}
          pageState={table.getState().pagination}
          pageCount={table.getPageCount()}
          onPageSizeChange={(size) => table.setPageSize(size)}
          onFirstPage={() => table.setPageIndex(0)}
          onPrevPage={() => table.previousPage()}
          onNextPage={() => table.nextPage()}
          onLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
          canPrev={table.getCanPreviousPage()}
          canNext={table.getCanNextPage()}
        />
      </div>
    </div>
  );
}
