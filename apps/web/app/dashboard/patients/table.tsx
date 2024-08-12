"use client";

import { DataTable, useDataTable } from "@atdb/ui";
import columns from "./columns";
import { Box, Flex } from "@atdb/design-system";
import PatientsControl from "./control";
import { DB } from "@atdb/types";
import { Selectable } from "kysely";

interface PatientsDataTableProps {
  data: Selectable<DB.Patient>[];
}

export function PatientsDataTable({ data }: PatientsDataTableProps) {
  const table = useDataTable({ columns, data });

  return (
    <Box w="full">
      <Flex align="center" py="4" gap="2">
        <PatientsControl table={table} />
      </Flex>
      <DataTable table={table} />
    </Box>
  );
}
