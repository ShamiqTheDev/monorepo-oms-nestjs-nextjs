import { styled, HStack, css } from "@atdb/design-system";
import { SearchNormal } from "@atdb/icons";
import { Input, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@atdb/ui";
import { Table } from "@tanstack/react-table";
import { ChangeEvent } from "react";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { toTitleCase } from "../../utils";

interface PatientsControlProps {
  table: Table<Selectable<DB.Patient>>;
}

export function PatientsControl({ table }: PatientsControlProps) {
  return (
    <styled.div height={"4xl"} mb={"xl"} width={"full"} display={"flex"} justifyContent={"space-between"}>
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
            placeholder="Filter by name..."
            defaultValue={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) => table.getColumn("name")?.setFilterValue(event.target.value)}
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
    </styled.div>
  );
}

export default PatientsControl;
