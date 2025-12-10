'use client';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/**
 * Assets
 */
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

interface Props {
  selectedCount: number;
  filteredCount: number;
  pageState: PaginationState;
  pageCount: number;

  onPageSizeChange: (size: number) => void;
  onFirstPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;

  canPrev: boolean;
  canNext: boolean;
}

export default function DataTablePagination({
  selectedCount,
  filteredCount,
  pageState,
  pageCount,

  onPageSizeChange,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,

  canPrev,
  canNext,
}: Props) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {selectedCount} of {filteredCount} row(s) selected.
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>

          <Select
            value={`${pageState.pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageState.pageSize} />
            </SelectTrigger>

            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page indicator */}
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pageState.pageIndex + 1} of {pageCount}
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={onFirstPage}
            disabled={!canPrev}
          >
            <ChevronsLeft />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={onPrevPage}
            disabled={!canPrev}
          >
            <ChevronLeft />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={onNextPage}
            disabled={!canNext}
          >
            <ChevronRight />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={onLastPage}
            disabled={!canNext}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
