"use client";

import { DataTable, useDataTable } from "@atdb/ui";
import columns from "./categories.columns";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { Box } from "@atdb/design-system";
import { CategoriesDataTableControl } from "./categories.control";
import { useMemo } from "react";
import { isSubCategory } from "./categories.utils";

interface CategoriesDataTableProps {
  data: (Selectable<DB.SubCategory> | Selectable<DB.Category>)[];
}

export function CategoriesDataTable({ data }: CategoriesDataTableProps) {
  const table = useDataTable({
    columns: columns(),
    data,
  });

  // ??? @GhaithAlHallak8
  const categories = useMemo(
    () =>
      table
        .getPreSelectedRowModel()
        .flatRows.filter((row) => !isSubCategory(row.original))
        .map((category) => category.original),
    [table]
  );

  return (
    <Box w="full">
      <CategoriesDataTableControl table={table} />
      <DataTable table={table} />
    </Box>
  );
}
