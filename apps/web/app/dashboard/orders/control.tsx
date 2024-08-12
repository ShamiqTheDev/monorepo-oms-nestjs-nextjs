import { styled, HStack, css, cx, icon } from "@atdb/design-system";
import NextLink from "next/link";
import { Add, ExportSquare, SearchNormal } from "@atdb/icons";
import {
  Input,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@atdb/ui";
import { OnChangeFn, Table } from "@tanstack/react-table";
import { ChangeEvent } from "react";
import { MoreVertical } from "lucide-react";
import Papa from "papaparse";
import { Order } from "./type";
import { toTitleCase } from "../../utils";

async function saveFile<T>(data: T[]) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

  const a = document.createElement("a");
  a.download = "orders_export.csv";
  a.href = URL.createObjectURL(blob);
  a.addEventListener("click", (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
  });
  a.click();
}

const Link = styled(NextLink);

interface OrdersControlProps {
  table: Table<Order>;
  globalFilter: string;
  setGlobalFilter: OnChangeFn<any>;

}

export function OrdersControl({ table, globalFilter, setGlobalFilter }: OrdersControlProps) {
  const handleExportCSV = async () => {
    const rows = table.getSelectedRowModel().flatRows.length > 0 ? table.getSelectedRowModel().flatRows : table.getRowModel().flatRows;
    const data = rows.map((row) => ({
      id: row.original.id,
      omsPatientId: row.original.patient.id,
      patientRef: row.original.patient.refId,
      patientOwnerId: row.original.patient.ownerId,
      patientName: row.original.patient.name,
      specialist: `${row.original.specialist.firstName} ${row.original.specialist.lastName}`,
      location: row.original.location.name,
      category: row.original.subCategory.name,
      assignee: `${row.original.assignee.firstName} ${row.original.assignee.lastName}`,
      illuminatedPhotos: row.original.illuminatedPhotos?.join(", "),
      status: row.original.status.label,
      priority: row.original.priority,
      createdAt: row.original.createdAt,
    }));

    saveFile(data);
  };

  return (
    <styled.div
      flexDir={"column"}
      mb={"6xl"}
      gap={"md"}
      md={{
        gap: "0",
        flexDir: "row",
        mb: "xl",
      }}
      height={"4xl"}
      width={"full"}
      display={"flex"}
      justifyContent={"space-between"}
    >
      <styled.div height={"100%"} display="flex" gap={"5xl"}>
        <Input.Root
          width="18rem"
          height="100%"
          display="flex"
          alignItems="center"
          px="xl"
          gap="md"
          borderRadius="5px"
          border="1px solid token(colors.gray.200)"
          boxShadow="0px 0px 2px -1px token(colors.gray.900), 0px 1px 1px 0px rgba(14, 27, 47, 0.15)"
          className={css({ bg: "token(colors.gray.25) !important" })}
        >
          <Input.Icon>
            <SearchNormal size={14} className={css({ color: "gray.700" })} />
          </Input.Icon>
          <Input.Control
            height={"3xl"}
            flexGrow={1}
            placeholder="Filter by patients..."
            defaultValue={globalFilter || ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setGlobalFilter(event.target.value)}
          />
        </Input.Root>
        <HStack gap="xl">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" ml="auto">
                <styled.svg 
                color={"gray.700"} 
                width="14px" 
                height="15px" 
                viewBox="0 0 14 15" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                  <path
                    d="M8.35341 11.6242C8.35341 11.98 8.12006 12.4467 7.82256 12.6275L7.00008 13.1583C6.23591 13.6308 5.17424 13.1 5.17424 12.155V9.03415C5.17424 8.61998 4.94091 8.08915 4.70174 7.79749L2.46173 5.44081C2.16423 5.14331 1.93091 4.61832 1.93091 4.26249V2.90915C1.93091 2.20332 2.46175 1.67249 3.10925 1.67249H10.8909C11.5384 1.67249 12.0692 2.20331 12.0692 2.85081V4.14581C12.0692 4.61831 11.7717 5.20748 11.4801 5.49915"
                    stroke="#0E1B2F"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.37424 10.1367C10.4052 10.1367 11.2409 9.30093 11.2409 8.26999C11.2409 7.23906 10.4052 6.40332 9.37424 6.40332C8.34331 6.40332 7.50757 7.23906 7.50757 8.26999C7.50757 9.30093 8.34331 10.1367 9.37424 10.1367Z"
                    stroke="#0E1B2F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M11.5909 10.4867L11.0076 9.90332" 
                    stroke="#0E1B2F" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </styled.svg>
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuItem key={column.id} onClick={() => column.toggleSorting()}>
                      {toTitleCase(column.id)}
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </HStack>
      </styled.div>
      <HStack justifyContent={"end"} md={{ justifyContent: "initial" }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreVertical className={cx(icon({ left: "auto", dimmed: true }), css({ w: "xl", h: "auto" }))} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent w="56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => table.resetRowSelection()}>Deselect All</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleExportCSV}>
                <ExportSquare className={css({ mr: "1", h: "0.875rem", w: "0.875rem" })} />
                Export Orders
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button>
          <Link href={"/dashboard/orders/new"} display={"flex"} justifyContent={"center"} alignItems={"center"} gap={"md"}>
            <Add size={"20px"} />
            New Order
          </Link>
        </Button>
      </HStack>
    </styled.div>
  );
}

export default OrdersControl;
