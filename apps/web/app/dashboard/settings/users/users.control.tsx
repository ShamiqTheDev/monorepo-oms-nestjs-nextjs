import { Flex, styled, css, HStack } from "@atdb/design-system";
import { Add, SearchNormal, UserCirlceAdd } from "@atdb/icons";
import { Input, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@atdb/ui";
import { Table } from "@tanstack/react-table";
import { ChangeEvent } from "react";
import { InviteForm } from "./invite/invite.form";
import React from "react";

interface UsersDataTableControlProps<TData> {
  table: Table<TData>;
}

export function UsersDataTableControl<TData>({ table }: UsersDataTableControlProps<TData>) {
  const [open, setOpen] = React.useState(false);

  return (
    <Flex align="center" py="4" gap="2">
      <styled.div height={"4xl"} mb={"xl"} width={"full"} display={"flex"} justifyContent={"space-between"}>
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
            placeholder="Filter users"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) => table.getColumn("name")?.setFilterValue(event.target.value)}
          />
        </Input.Root>
        <HStack>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              bgGradient={"to-br"}
              gradientFrom={"primary.300"}
              gradientTo={"primary.600"}
              px={"lg"}
              py={"sm"}
              color={"primary.25"}
              border={"solid 1px token(colors.primary.600)"}
              borderRadius={"5px"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={"md"}
              fontWeight={"500"}
              transition={"ease-in 100ms background-color"}
              fontSize={"sm"}
              boxShadow={"0px 0px 2px -1px #0E1B2F, 0px 1px 1px 0px rgba(23, 68, 110, 0.15);"}
              _hover={{
                gradientFrom: "primary.200",
                gradientTo: "primary.500",
              }}
            >
              <Add size={"20px"} />
              Invite
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle display="flex" alignItems={"center"} gap="md">
                  <UserCirlceAdd />
                  Invite User
                </DialogTitle>
                <DialogDescription>Invite a new user to the system.</DialogDescription>
              </DialogHeader>
              <InviteForm setDialogOpen={setOpen} />
            </DialogContent>
          </Dialog>
        </HStack>
      </styled.div>
    </Flex>
  );
}
