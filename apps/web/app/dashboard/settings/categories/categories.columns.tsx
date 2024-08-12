"use client";

import { DB } from "@atdb/types";
import { Trash } from "@atdb/icons";
import { css } from "@atdb/design-system";
import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@atdb/ui";
import { ColumnDef } from "@tanstack/react-table";
import { Selectable } from "kysely";
import { ArrowUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { isSubCategory } from "./categories.utils";
import { deleteSubCategory } from "./sub-categories/sub-categories.action";
import { deleteCategory } from "./categories.action";
import { useRouter } from "next/navigation";
import { useToast } from "@atdb/client-providers";
// import { deleteUser } from "./users.action";


const columns = (): ColumnDef<Selectable<DB.SubCategory> | Selectable<DB.Category>>[] => [
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
    accessorKey: "id",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button className={css({ p: "0" })} variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          ID
          <ArrowUpDown className={css({ w: "1rem", h: "1rem" })} />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    enableHiding: false,
  },
  {
    id: "type",
    header: "Type",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;
      return <span>{isSubCategory(category) ? "Sub Category" : "Category"}</span>;
    },
  },
  {
    id: "parentCategory",
    header: "Parent",

    enableHiding: false,
    cell: ({ row, table }) => {
      const category = row.original;
      return (
        <span>
          {isSubCategory(category)
            ? table.getPreSelectedRowModel().flatRows.find((row) => row.original.id === category.categoryId)?.original.name
            : ""}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;
      const { data } = useSession();
      const router = useRouter();
      const { toast } = useToast();
      if (!data) return null;

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
              <DropdownMenuItem asChild onClick={() => navigator.clipboard.writeText(category.id.toString())}>
                Copy category ID
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
                  Delete Category
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this category and remove its data from the server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant={"destructive"}
                onClick={async () => {
                  const isConfirmed = isSubCategory(category) ? await deleteSubCategory(category.id) : await deleteCategory(category.id);
                  if (isConfirmed) router.refresh();

                  toast({
                    title: isConfirmed ? "Category Deleted" : "Failed to delete category",
                    description: isConfirmed ? "Category has been deleted successfully " : "Category deletion failed due to a system error",
                    variant: isConfirmed ? "constructive" : "destructive",
                  });
                }}
              >
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
