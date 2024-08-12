import { styled, HStack, css, Flex } from "@atdb/design-system";
import { Add, SearchNormal, Category, Category2 } from "@atdb/icons";
import {
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@atdb/ui";
import { Table } from "@tanstack/react-table";
import { ChangeEvent, useState } from "react";
import { SubCategoriesForm } from "./sub-categories/sub-categories.form";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { CategoriesForm } from "./categories.form";

interface CategoriesDataTableControlProps {
  table: Table<Selectable<DB.Category>>;
}

export function CategoriesDataTableControl({ table }: CategoriesDataTableControlProps) {
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openSubCategoryDialog, setOpenSubCategoryDialog] = useState(false);

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
            placeholder="Filter categories"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event: ChangeEvent<HTMLInputElement>) => table.getColumn("name")?.setFilterValue(event.target.value)}
          />
        </Input.Root>
        <HStack>
          <Dialog open={openSubCategoryDialog} onOpenChange={setOpenSubCategoryDialog}>
            <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
              <DropdownMenu>
                <DropdownMenuTrigger
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
                  Create new..
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setOpenCategoryDialog(true)}>
                      <Category size={18} />
                      <span>Category</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenSubCategoryDialog(true)}>
                      <Category2 size={18} />
                      <span>Sub Category</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle display="flex" alignItems={"center"} gap="md">
                    <Category />
                    Create Category
                  </DialogTitle>
                  <DialogDescription>Create a new category.</DialogDescription>
                </DialogHeader>
                <CategoriesForm setDialogOpen={setOpenCategoryDialog} />
              </DialogContent>
            </Dialog>
            <DialogContent>
              <DialogHeader position={"sticky"} top={0}>
                <DialogTitle display="flex" alignItems={"center"} gap="md">
                  <Category2 />
                  Create Sub Category
                </DialogTitle>
                <DialogDescription>Create a new sub-category.</DialogDescription>
              </DialogHeader>
              <SubCategoriesForm table={table} setDialogOpen={setOpenSubCategoryDialog} />
            </DialogContent>
          </Dialog>
        </HStack>
      </styled.div>
    </Flex>
  );
}
