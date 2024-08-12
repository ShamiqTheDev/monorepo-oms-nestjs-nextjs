"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFnOption,
  OnChangeFn,
  Row,
  SortingState,
  Table as TTable,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Box, Flex } from "@atdb/design-system";
import { Button } from "../button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";

interface UseDataTableParams<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnsVisibility?: VisibilityState;
  sortingState?: SortingState;
  globalFilterFn?: FilterFnOption<any>;
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<any>;
}

interface DataTableProps<TData> {
  table: TTable<TData>;
}

export function useDataTable<TData, TValue>({ columnsVisibility = {}, sortingState = [], columns, data, globalFilterFn, globalFilter, onGlobalFilterChange }: UseDataTableParams<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>(sortingState);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(columnsVisibility);
  const [rowSelection, setRowSelection] = React.useState({});

  return useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    },
    globalFilterFn,
    onGlobalFilterChange
  });
}

// ?? @GhaithAlHallak8
export function DataTable<TData>({ table, rowOnClick }: DataTableProps<TData> & { rowOnClick?: (row: Row<TData>) => void }) {
  return (
    <>
      <Box rounded="md" border="base">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} textAlign="center" >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} textAlign="center" >{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} h="24" textAlign="center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <Flex align="center" justify="flex-end" gap="2" py="4">
        <Box flex="1" textStyle="sm" color="muted.foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </Box>
        <Flex align="center" gap="2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
