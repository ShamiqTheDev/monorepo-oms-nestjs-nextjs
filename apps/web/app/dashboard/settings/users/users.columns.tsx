"use client";

import { DB } from "@atdb/types";
import { Trash } from "@atdb/icons";
import { styled, Box, css, HStack } from "@atdb/design-system";
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
} from "@atdb/ui";
import { ColumnDef } from "@tanstack/react-table";
import { Selectable } from "kysely";
import { useSession } from "next-auth/react";
import { deleteUser } from "./users.action";
import { toTitleCase } from "../../../utils";

const columns = (): ColumnDef<Selectable<DB.User>>[] => [
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
    id: "name",
    enableHiding: false,
    enableSorting: false,
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    id: "user",
    enableHiding: false,
    header: "User",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <HStack>
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}'s Avatar`} />
            <AvatarFallback>{user.firstName[0].concat(user.lastName[0])}</AvatarFallback>
          </Avatar>
          <Box>
            <styled.div color={"gray.900"} fontWeight={600}>
              {user.firstName} {user.lastName}
            </styled.div>
            <styled.div color={"gray.700"}>{user.email}</styled.div>
          </Box>
        </HStack>
      );
    },
  },
  {
    accessorKey: "role",
    enableHiding: false,
    header: "Role",
    cell: ({ row }) => {
      return toTitleCase(row.original.role);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const { data } = useSession();
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id.toString())}>Copy user ID</DropdownMenuItem>
              {Object.values(DB.Role).indexOf(data?.user.role) < Object.values(DB.Role).indexOf(user.role) && (
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
                    Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this user and remove their data from the server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant={"destructive"} onClick={() => deleteUser(user.id)}>
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
