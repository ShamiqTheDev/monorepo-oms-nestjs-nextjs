"use client";

import { VStack, HStack, css, cx, icon } from "@atdb/design-system";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Dropzone,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
} from "@atdb/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTransition } from "react";
import { orderQuickActionsSchema, OrderQuickActionsSchema } from "./quick-actions.schema";
import { useToast } from "@atdb/client-providers";
import { useSession } from "next-auth/react";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { ChevronsUpDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { editOrder } from "../../dashboard/orders/[id]/edit/action";
import { updateOrder } from "../../dashboard/orders/server-utils";

interface OrderQuickActionsFormProps {
  order: Selectable<DB.Order>;
  users: Selectable<DB.User>[];
  orderStatuses: Selectable<DB.AppSettings>["orderStatuses"];
}

export function OrderQuickActionsForm({ order, users, orderStatuses }: OrderQuickActionsFormProps) {
  const [_, startTransition] = useTransition();
  const { toast } = useToast();
  const { data } = useSession();
  const router = useRouter();
  const form = useForm<OrderQuickActionsSchema>({
    resolver: zodResolver(orderQuickActionsSchema),
    defaultValues: {
      statusId: order.statusId,
      assigneeId: order.assigneeId,
      illuminatedPhotos: [],
    },
  });

  if (!data) return null;

  const onSubmit: SubmitHandler<OrderQuickActionsSchema> = (data) => {
    startTransition(async () => {
      const body = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        // No Metadata fields will ever by changed on the quck actions page
        if (key === "illuminatedPhotos") (value as Blob[])?.forEach((photo) => body.append("illuminatedPhotos", photo));
        // @ts-expect-error
        else body.append(key, value);
      });

      const isSuccess = await editOrder(order, body);

      toast({
        variant: isSuccess ? "constructive" : "destructive",
        title: isSuccess ? "Order is saved" : "Failed to save order",
        description: isSuccess ? "Order has been saved" : "Failed to save order",
      });
    });
  };

  const onError = (x) => {
    console.log({ x });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className={css({ spaceY: "8", fontSize: "sm" })}>
        <VStack justifyContent="space-between">
          <HStack justifyContent="space-between" w="full">
            {DB.ADMINISTRATIVE_ROLES.includes(data?.user.role as (typeof DB.ADMINISTRATIVE_ROLES)[number]) && (
              <>
                <FormField
                  name="statusId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem display="flex" flexDir="column" w="full">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Popover.Root>
                          <Popover.Trigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                justifyContent="space-between"
                                color={!field.value ? "muted.foreground" : undefined}
                              >
                                {field.value ? orderStatuses.find((orderStatus) => orderStatus.id === field.value)?.label : "Select status"}
                                <ChevronsUpDown className={cx(icon({ left: "auto", dimmed: true }), css({ w: "xl", h: "auto" }))} />
                              </Button>
                            </FormControl>
                          </Popover.Trigger>
                          <Popover.Content className={css({ p: 0, w: "20rem" })}>
                            <Command>
                              <CommandInput placeholder="Search statuses..." />
                              <CommandEmpty>No status found.</CommandEmpty>
                              <CommandGroup>
                                {orderStatuses.map((orderStatus) => (
                                  <Popover.Close w='full' display='block'>
                                    <CommandItem
                                      value={orderStatus.id}
                                      key={orderStatus.id}
                                      onSelect={() => {
                                        form.setValue("statusId", orderStatus.id);
                                      }}>
                                      <Check className={css({ w: "xl", h: "auto" })} opacity={orderStatus.id === field.value ? "1" : "0"} />
                                      {orderStatus.label}
                                    </CommandItem>
                                  </Popover.Close>
                                ))}
                              </CommandGroup>
                            </Command>
                          </Popover.Content>
                        </Popover.Root>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="assigneeId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem display="flex" flexDir="column" w="full">
                      <FormLabel>Assignee</FormLabel>
                      <Popover.Root>
                        <Popover.Trigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              justifyContent="space-between"
                              color={!field.value ? "muted.foreground" : undefined}>
                              {field.value ? users.find((user) => user.id === field.value)?.firstName : "Select assignee"}
                              <ChevronsUpDown className={cx(icon({ left: "auto", dimmed: true }), css({ w: "xl", h: "auto" }))} />
                            </Button>
                          </FormControl>
                        </Popover.Trigger>
                        <Popover.Content className={css({ p: 0, w: "20rem" })}>
                          <Command>
                            <CommandInput placeholder="Search users..." />
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup>
                              {users.filter((user) => user.role !== DB.Role.Customer).map((user) => (
                                <Popover.Close w='full' display='block'>
                                  <CommandItem
                                    value={`${user.firstName} ${user.lastName}`}
                                    key={user.id}
                                    onSelect={() => {
                                      form.setValue("assigneeId", user.id);
                                    }}>
                                    <Check className={css({ w: "xl", h: "auto" })} opacity={user.id === field.value ? "1" : "0"} />
                                    {user.firstName} {user.lastName}
                                  </CommandItem>
                                </Popover.Close>
                              ))}
                            </CommandGroup>
                          </Command>
                        </Popover.Content>
                      </Popover.Root>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </HStack>
          <FormField
            name="illuminatedPhotos"
            control={form.control}
            render={({ field }) => (
              <FormItem className={css({ gridColumn: "span 2" })}>
                <FormLabel>Attachment(s)</FormLabel>
                <FormControl>
                  <Dropzone {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            w="full"
            variant={order.closed ? "outline" : "destructive"}
            onClick={async () => {
              const updating = toast({
                title: "Updating order...",
                description: "Order is being updated, please wait",
                variant: "instructive",
              });
              const isSuccess = await updateOrder(order.id, {closed: order.closed}, {closed: !order.closed})
              if (isSuccess) router.refresh();
              updating.dismiss();
              toast({
                title: isSuccess ? "Order Updated" : "Order Update Failed",
                description: isSuccess ? "Order has been updated successfully " : "Order update failed due to a system error",
                variant: isSuccess ? "constructive" : "destructive",
              });
            }}
          >
            {order.closed ? "Reopen" : "Close"}
          </Button>
        </VStack>
        <Button
          type="submit"
          bg={"primary.500"}
          w="full"
          _hover={{ bg: "primary.600" }}
          border={"solid 1px token(colors.primary.600)"}
          boxShadow={"0px 0px 2px -1px #0E1B2F, 0px 1px 1px 0px rgba(23, 68, 110, 0.15);"}
        >
          Save
        </Button>
      </form>
    </Form>
  );
}
