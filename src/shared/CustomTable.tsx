/* eslint-disable react-hooks/incompatible-library */
"use client";

import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { Dispatch, Fragment, SetStateAction } from "react";

export interface CustomTableProps<T> {
  data: T[];
  columns: Array<ColumnDef<T>>;
  isLoading: boolean;
  showPagination?: boolean;
  rowCount?: number;
  pagination?: PaginationState;
  setPagination?: Dispatch<SetStateAction<PaginationState>>;
}

const CustomTable = <T,>({
  data,
  columns,
  isLoading,
  showPagination = true,
  rowCount,
  pagination,
  setPagination,
}: CustomTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    rowCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  });

  if (isLoading) {
    return (
      <div className="flex h-75 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!table.getRowModel()?.rows?.length) {
    return (
      <div className="flex h-50 items-center justify-center text-sm text-muted-foreground">
        No results found.
      </div>
    );
  }

  return (
    <Fragment>
      <div className="overflow-x-auto border rounded-lg!">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b bg-surface-subtle">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs px-5 py-4 font-semibold text-grey-text"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-b text-sm transition-colors  hover:bg-surface-subtle"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-6 px-5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Page {(table.getState().pagination?.pageIndex ?? 0) + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default CustomTable;
