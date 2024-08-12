"use client";

import { styled, css, Box } from "@atdb/design-system";
import { Button, Checkbox } from "@atdb/ui";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import NextLink from "next/link";
import { DB } from "@atdb/types";
import { Selectable } from "kysely";
import { format } from "date-fns";

const Link = styled(NextLink);

const columns: ColumnDef<Selectable<DB.Patient>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "refId",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button className={css({ p: "0" })} variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          ID
          <ArrowUpDown className={css({ w: "1rem", h: "1rem" })} />
        </Button>
      );
    },
    cell({ row }) {
      return (
        <Link
          color={"instructive.300"}
          _hover={{
            color: "instructive.400",
            textDecoration: "underline",
          }}
          prefetch={false}
          href={`/dashboard/orders?patient_ref=${row.getValue("refId")}`}
        >
          #{row.getValue("refId")}
        </Link>
      );
    },
  },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "birthdate",
    header: "DOB",
    cell({ row }) {
      return (
        <Box fontWeight="medium">
          {format(new Date(row.getValue("birthdate")), "MMM, do yyyy")}
        </Box>
      );
    },
  },
];

export default columns;
