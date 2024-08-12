"use client";

import { DataTable, useDataTable } from "@atdb/ui";
import columns from "./columns";
import { Box, Flex } from "@atdb/design-system";
import { Order } from "./type";
import { useRouter, useSearchParams } from "next/navigation";
import OrdersControl from "./control";
import { useEffect, useState } from "react";

interface OrdersDataTableProps {
  data: Order[];
}

export function OrdersDataTable({ data }: OrdersDataTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const table = useDataTable({ columns, data, globalFilterFn: "includesString", globalFilter, onGlobalFilterChange: setGlobalFilter, sortingState: [{ id: 'updatedAt', desc: true }] });
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const patientRef = searchParams.get("patient_ref");
    if (patientRef) table.getColumn("patientRef")?.setFilterValue(patientRef);
  }, []);

  return (
    <Box w="full">
      <Flex align="center" py="4" gap="2">
        <OrdersControl table={table} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      </Flex>
      <DataTable table={table} rowOnClick={(row) => router.push(`/dashboard/orders/${row.getValue("id")}`)} />
    </Box>
  );
}
