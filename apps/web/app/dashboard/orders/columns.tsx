"use client";

import { Trash } from "@atdb/icons";
import { styled, Box, css, muted } from "@atdb/design-system";
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Avatar,
  AvatarFallback,
  AvatarImage,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  DropdownMenuCheckboxItem,
  Popover,
  Input,
  Command,
  CommandInput,
  CommandGroup,
  CommandEmpty,
  CommandItem,
} from "@atdb/ui";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { ArrowUpDown, Check, Filter } from "lucide-react";
import NextLink from "next/link";
import { Order } from "./type";
import { DB } from "@atdb/types";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { deleteOrder } from "./[id]/action";
import { useToast } from "@atdb/client-providers";
import { useEffect, useState } from "react";
import { fetchAppSettings } from "../../../server-utils";
import { getKeyByValue } from "./utils";
import { PRIORITY_COLORS } from "./client-utils";

const Link = styled(NextLink);

const multiSelectFilter: FilterFnOption<Order> = (row, columnId, filterValue: string[]) => {
  if (!filterValue.length) return true;
  const rowValue = row.getValue(columnId);
  return !!filterValue.find((option) => option === rowValue);
};

interface ISelectPropsBase {
  label: string;
  onSelect(value: string[]): void;
}

type ISelectProps = ISelectPropsBase & ({ fetcher(): Promise<string[]> } | { values: string[] });

const dateRangeFilter: FilterFnOption<Order> = (row, columnId, filterValue: [string, string]) => {
  if (!filterValue.length) return true;
  const rowValue = row.getValue<string>(columnId);

  const [from, to] = filterValue;
  return new Date(rowValue) >= new Date(from) && new Date(rowValue) <= new Date(to);
};

const ColumnDateRangeFilter = ({ label, onSelect }: { label: string; onSelect(value: [string, string]): void }) => {
  const [dateRange, setDateRange] = useState<[string, string]>([new Date(0).toISOString(), new Date().toISOString()]);

  const handleSelectChange = (value: [string, string]) => {
    setDateRange(value);
    onSelect(value);
  };

  return (
    <>
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="ghost" p={0}>
            {label}
            <Filter className={css({ w: "1rem", h: "1rem" })} />
          </Button>
        </Popover.Trigger>
        <Popover.Content className={css({ w: "80", p: "4" })}>
          <div className={css({ display: "grid", gap: "4" })}>
            <div className={css({ spaceY: "2", lineHeight: "1" })}>
              <h4 className={css({ fontWeight: "bold", leading: "none" })}>Range Filter</h4>
              <p className={muted()}>Set a range to the column's filter.</p>
            </div>
            <div className={css({ display: "grid", gap: "2" })}>
              <div
                className={css({
                  display: "grid",
                  gridTemplateColumns: "3",
                  alignItems: "center",
                  gap: "4",
                })}>
                <div>From</div>
                <Input.Root className={css({ bg: "none !important", borderColor: "input", rounded: "md", w: "8rem !important" })}>
                  <Input.Control
                    w="none"
                    value={dateRange[0]}
                    onChange={(e) => handleSelectChange([e.target.value, dateRange[1]])}
                    placeholder="From"
                    type="date"
                  />
                </Input.Root>
              </div>
              <div
                className={css({
                  display: "grid",
                  gridTemplateColumns: "3",
                  alignItems: "center",
                  gap: "4",
                })}>
                <div>To</div>
                <Input.Root className={css({ bg: "none !important", borderColor: "input", rounded: "md", w: "8rem !important" })}>
                  <Input.Control
                    w="none"
                    value={dateRange[1]}
                    onChange={(e) => handleSelectChange([dateRange[0], e.target.value])}
                    placeholder="To"
                    type="date"
                  />
                </Input.Root>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Root>
    </>
  );
};

const ColumnMultiSelectFilter = (props: ISelectProps) => {
  const { label, onSelect } = props;

  const [values, setValues] = useState<string[]>([]);

  useEffect(() => {
    if ("fetcher" in props) {
      const main = async () => {
        const fetchedItems = await props.fetcher();
        setValues(fetchedItems);
      };

      main();
    } else setValues(props.values);
  }, []);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const handleSelectChange = (value: string) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems((prev) => {
        const newSelectedItems = [...prev, value];
        onSelect(newSelectedItems);

        return newSelectedItems;
      });
    } else {
      const referencedArray = [...selectedItems];
      const indexOfItemToBeRemoved = referencedArray.indexOf(value);
      referencedArray.splice(indexOfItemToBeRemoved, 1);
      setSelectedItems(referencedArray);
      onSelect(referencedArray);
    }
  };

  const isOptionSelected = (value: string): boolean => {
    return selectedItems.includes(value);
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" p={0}>
            {label}
            <Filter className={css({ w: "1rem", h: "1rem" })} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {values.map((value: string, index: number) => {
            return (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                key={index}
                checked={isOptionSelected(value)}
                onCheckedChange={() => handleSelectChange(value)}>
                {value.toLowerCase().replace(/(?:^|\_)\w/g, (match) => match.replaceAll("_", " ").toUpperCase())}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const comboboxFilter = (rowValue: string, filterValue: string | string[]) => {
  if (!filterValue || !filterValue?.length) return true;
  if (typeof filterValue === "string") return rowValue.includes(filterValue);
  else return filterValue.includes(rowValue);
};

interface ComboboxFilterItem {
  id: string;
  name: string;
}

const ColumnComboboxFilter = ({
  label,
  fetcher,
  onSelect,
}: {
  label: string;
  fetcher(): Promise<ComboboxFilterItem[]>;
  onSelect(value: string[]): void;
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [items, setItems] = useState<ComboboxFilterItem[]>([]);

  useEffect(() => {
    const main = async () => {
      const fetchedItems = await fetcher();
      setItems(fetchedItems);
    };

    main();
  }, []);

  const handleSelectChange = (value: string) => {
    if (!selectedItems.includes(value)) {
      setSelectedItems((prev) => {
        const newSelectedItems = [...prev, value];
        onSelect(newSelectedItems);

        return newSelectedItems;
      });
    } else {
      const referencedArray = [...selectedItems];
      const indexOfItemToBeRemoved = referencedArray.indexOf(value);
      referencedArray.splice(indexOfItemToBeRemoved, 1);
      setSelectedItems(referencedArray);
      onSelect(referencedArray);
    }
  };

  const isOptionSelected = (value: string): "1" | "0" => {
    return selectedItems.includes(value) ? "1" : "0";
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="ghost" p={0}>
          {label}
          <Filter className={css({ w: "1rem", h: "1rem" })} />
        </Button>
      </Popover.Trigger>
      <Popover.Content className={css({ p: 0, w: "20rem" })}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No items found.</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem value={item.name} key={item.id} onSelect={() => handleSelectChange(item.id)}>
                <Check className={css({ w: "xl", h: "auto" })} opacity={isOptionSelected(item.id)} />
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
};

const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    enableGlobalFilter: false,
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
          href={`/dashboard/orders/${row.getValue("id")}`}>
          #{row.getValue("id")?.toString().padStart(4, "0")}
        </Link>
      );
    },
  },
  {
    id: "patientName",
    accessorKey: "patient.name",
    filterFn: (row, _columnId, filterValue: string | string[]) => comboboxFilter(row.original.patient.id.toString(), filterValue),
    header({ table, column }) {
      return (
        <ColumnComboboxFilter
          label="Patient Name"
          fetcher={async () => {
            const patients = table
              .getRowModel()
              .flatRows.filter((v, i, a) => a.findIndex((v2) => v2.original.patient.id === v.original.patient.id) === i)
              .map((row) => ({
                id: row.original.patient.id.toString(),
                name: row.original.patient.name,
              }));

            return patients;
          }}
          onSelect={(selectedOptions) => column.setFilterValue(selectedOptions)}
        />
      );
    },
  },
  {
    enableGlobalFilter: false,
    id: "urgent",
    accessorKey: "urgent",
    header: "Urgent",
    cell({ row }) {
      return row.getValue("urgent") ? (
        <styled.span color="destructive" fontWeight={"bold"} fontSize="2xl" textAlign="middle">
          !
        </styled.span>
      ) : (
        ""
      );
    },
  },
  {
    enableGlobalFilter: true,
    id: "patientRef",
    accessorKey: "patient.refId",
    filterFn: (row, _, filterValue: string) => row.original.patient.refId === filterValue,
    header: "Simplex Code",
    cell({ row }) {
      return (
        <Box textAlign="right" fontWeight="medium">
          {row.original.patient.ownerId ? (
            <>
              <span
                className={css({ textDecorationStyle: "wavy", textDecorationLine: "underline" })}
                title="This is not a Simplex Code, but an external client patient reference!">
                {row.original.patient.refId}
              </span>
            </>
          ) : (
            row.original.patient.refId
          )}
        </Box>
      );
    },
  },
  {
    id: "specialist",
    enableGlobalFilter: false,
    accessorFn: (row) => `${row.specialist.firstName} ${row.specialist.lastName}`,
    filterFn: (row, _columnId, filterValue: string[]) => comboboxFilter(row.original.specialistId, filterValue),
    header({ column, table }) {
      return (
        <ColumnComboboxFilter
          label="Specialist"
          fetcher={async () => {
            const users = table
              .getRowModel()
              .flatRows.filter((v, i, a) => a.findIndex((v2) => v2.original.specialist.id === v.original.specialist.id) === i)
              .map((row) => ({
                id: row.original.specialist.id,
                name: `${row.original.specialist.firstName} ${row.original.specialist.lastName}`,
              }));

            return users;
          }}
          onSelect={(selectedOptions) => column.setFilterValue(selectedOptions)}
        />
      );
    },
    cell: ({ row }) => {
      const specialist = row.original.specialist;
      return (
        <Avatar title={`${specialist.firstName} ${specialist.lastName}`}>
          <AvatarImage src={specialist.avatarUrl} alt={`${specialist.firstName} ${specialist.lastName}'s Avatar`} />
          <AvatarFallback>{specialist.firstName[0].concat(specialist.lastName[0])}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    id: "category",
    enableGlobalFilter: false,
    accessorKey: "category.name",
    filterFn: (row, _columnId, filterValue: string[]) => comboboxFilter(row.original.category.id.toString(), filterValue),
    header({ column, table }) {
      return (
        <ColumnComboboxFilter
          label="Category"
          fetcher={async () => {
            const categories = table
              .getRowModel()
              .flatRows.filter((v, i, a) => a.findIndex((v2) => v2.original.category.id === v.original.category.id) === i)
              .map((row) => ({ id: row.original.category.id.toString(), name: row.original.category.name }));

            return categories;
          }}
          onSelect={(selectedOptions) => column.setFilterValue(selectedOptions)}
        />
      );
    },
    cell({ row }) {
      const category = row.original.category;
      return <Box>{category.name}</Box>;
    },
  },
  {
    id: "subcategory",
    enableGlobalFilter: false,
    accessorKey: "subCategory.name",
    filterFn: (row, _columnId, filterValue: string[]) => comboboxFilter(row.original.subCategory.id.toString(), filterValue),
    header({ column, table }) {
      return (
        <ColumnComboboxFilter
          label="Sub Category"
          fetcher={async () => {
            const categories = table
              .getRowModel()
              .flatRows.filter((v, i, a) => a.findIndex((v2) => v2.original.subCategory.id === v.original.subCategory.id) === i)
              .map((row) => ({ id: row.original.subCategory.id.toString(), name: row.original.subCategory.name }));

            return categories;
          }}
          onSelect={(selectedOptions) => column.setFilterValue(selectedOptions)}
        />
      );
    },
    cell({ row }) {
      const subcategory = row.original.subCategory;
      return <Box>{subcategory.name}</Box>;
    },
  },
  {
    enableGlobalFilter: false,
    accessorKey: "status.label",
    filterFn: (row, _columnId, filterValue: string[]) => comboboxFilter(row.original.status.label, filterValue),
    header({ column }) {
      return (
        <ColumnMultiSelectFilter
          label="Status"
          fetcher={async () => {
            const { orderStatuses } = await fetchAppSettings();

            return orderStatuses.map((orderStatus) => orderStatus.label);
          }}
          onSelect={(selectedOptions) => column.setFilterValue(selectedOptions)}
        />
      );
    },
    cell({ row }) {
      const status = row.original.status;
      return (
        <Box
          className={css({
            bg: `${status.color}.9`,
            color: "instructive.foreground",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            fontSize: "xs",
            py: "sm",
            px: "md",
            minW: "4rem",
            rounded: "md",
          })}>
          {status.label}
        </Box>
      );
    },
  },
  {
    enableGlobalFilter: false,
    accessorKey: "priority",
    filterFn: multiSelectFilter,
    header({ column }) {
      return (
        <ColumnMultiSelectFilter
          label="Priority"
          values={Object.values(DB.Priority)}
          onSelect={(selectedOptions) => column.setFilterValue(selectedOptions)}
        />
      );
    },
    cell({ row }) {
      const priority: string = row.getValue("priority");
      return (
        <Box
          className={css({
            bg: PRIORITY_COLORS[priority],
            color: `${PRIORITY_COLORS[priority]}.foreground`,
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            fontSize: "xs",
            py: "sm",
            px: "md",
            minW: "4rem",
            rounded: "md",
          })}>
          {getKeyByValue(DB.Priority, priority)}
        </Box>
      );
    },
  },
  {
    enableGlobalFilter: false,
    accessorFn: (row) => `${row.assignee.firstName} ${row.assignee.lastName}`,
    id: "assignee",
    filterFn: (row, _columnId, filterValue: string[]) => comboboxFilter(row.original.assigneeId, filterValue),
    header({ column, table }) {
      return (
        <ColumnComboboxFilter
          label="Assignee"
          fetcher={async () => {
            const users = table
              .getRowModel()
              .flatRows.filter((v, i, a) => a.findIndex((v2) => v2.original.assignee.id === v.original.assignee.id) === i)
              .map((row) => ({
                id: row.original.assignee.id,
                name: `${row.original.assignee.firstName} ${row.original.assignee.lastName}`,
              }));

            return users;
          }}
          onSelect={(selectedOptions) => column.setFilterValue(selectedOptions)}
        />
      );
    },
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <Avatar title={`${assignee.firstName} ${assignee.lastName}`}>
          <AvatarImage src={assignee.avatarUrl} alt={`${assignee.firstName} ${assignee.lastName}'s Avatar`} />
          <AvatarFallback>{assignee.firstName[0].concat(assignee.lastName[0])}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    enableGlobalFilter: false,
    accessorKey: "deliveryDate",
    filterFn: dateRangeFilter,
    header: ({ column }) => {
      return <ColumnDateRangeFilter label="Delivery Date" onSelect={(selectedOptions) => column.setFilterValue(selectedOptions)} />;
    },
    cell({ row }) {
      return (
        <Box textAlign="right" fontWeight="medium">
          {format(new Date(row.getValue("deliveryDate")), "dd/MM/yyyy")}
        </Box>
      );
    },
  },
  {
    enableGlobalFilter: false,
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return <ColumnDateRangeFilter label="Last Update" onSelect={(selectedOptions) => column.setFilterValue(selectedOptions)} />;
    },
    cell({ row }) {
      return (
        <Box textAlign="right" fontWeight="medium">
          {format(new Date(row.getValue("updatedAt")), "dd/MM/yyyy HH:mm")}
        </Box>
      );
    },
  },
  // {
  //   enableGlobalFilter: false,
  //   accessorKey: "createdAt",
  //   header: ({ column }) => {
  //     return <ColumnDateRangeFilter label="Created At" onSelect={(selectedOptions) => column.setFilterValue(selectedOptions)} />;
  //   },
  //   cell({ row }) {
  //     return (
  //       <Box textAlign="right" fontWeight="medium">
  //         {format(new Date(row.getValue("createdAt")), "dd/MM/yyyy")}
  //       </Box>
  //     );
  //   },
  // },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { toast } = useToast();
      const router = useRouter();
      const order = row.original;

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" h="8" w="8" p="0" lineHeight={"0"}>
                <span className={css({ srOnly: true })}>Open menu</span>
                ...
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id.toString())}>Copy order ID</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link prefetch={false} href={`/dashboard/orders/${order.id}`}>View Order</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link prefetch={false} href={`/dashboard/orders/${order.id}/edit`}>Edit Order</Link>
              </DropdownMenuItem>
              <AlertDialogTrigger>
                <DropdownMenuItem className={css({ color: "negative.300" })}>
                  <Trash
                    className={css({
                      mr: "1",
                      h: "0.875rem",
                      w: "0.875rem",
                      ca: "negative.300/70",
                    })}
                  />
                  Delete Order
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this order and remove its data from the server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant={"destructive"}
                onClick={async () => {
                  const isConfirmed = await deleteOrder(order.id);
                  if (isConfirmed) router.refresh();

                  toast({
                    title: isConfirmed ? "Order Deleted" : "Failed to delete order",
                    description: isConfirmed ? "Order has been deleted successfully " : "Order deletion failed due to a system error",
                    variant: isConfirmed ? "constructive" : "destructive",
                  });
                }}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];

export default columns;
