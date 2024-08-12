"use client";

import { DataTable, useDataTable } from "@atdb/ui";
import columns from "./users.columns";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { Box } from "@atdb/design-system";
import { UsersDataTableControl } from "./users.control";

interface UsersDataTableProps {
  data: Selectable<DB.User>[];
}

export function UsersDataTable({ data }: UsersDataTableProps) {
  const table = useDataTable({
    columns: columns(),
    data,
    columnsVisibility: {
      name: false,
    },
  });
  return (
    <Box w="full">
      <UsersDataTableControl table={table} />
      <DataTable table={table} />
    </Box>
  );
}
