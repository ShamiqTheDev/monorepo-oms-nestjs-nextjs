"use client";

import { Flex, css, cx, icon, muted, styled } from "@atdb/design-system";
import { Order } from "../type";
import { updateOrderAssignee } from "./action";
import { useToast } from "@atdb/client-providers";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Label,
  Popover,
  Switch,
  Textarea,
  Form,
  plugins,
} from "@atdb/ui";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useTransition } from "react";
import { DB } from "@atdb/types";
import { useRouter } from "next/navigation";
import { Selectable } from "kysely";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Category } from "@atdb/icons";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Plate, PlateContent } from "@udecode/plate-common";
import { getKeyByValue } from "../utils";
import { downloadFile, PRIORITY_COLORS } from "../client-utils";
import { updateOrder } from "../server-utils";

interface OrderDetailsProps {
  order: Order;
  users: Selectable<DB.User>[];
  appSettings: Selectable<DB.AppSettings>;
}
export default function OrderDetails({ order, users, appSettings }: OrderDetailsProps) {
  const [assigneeId, setAssigneeId] = useState<string>(order.assigneeId);
  const [status, setStatus] = useState<Selectable<DB.OrderStatus>>(order.status);
  const [priority, setPriority] = useState<string>(order.priority);
  const [onHold, setOnHold] = useState<boolean>(order.onHold);
  const [holdReasonPopupOpen, setholdReasonPopupOpen] = useState<boolean>(false);
  
  const { toast } = useToast();
  const router = useRouter();
  const [_, startTransition] = useTransition();
  const { data } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const update = async (updater: () => Promise<boolean>, setter: () => void, unSetter: () => void) => {
    if (isLoading) return;
    setIsLoading(true);
    setter();

    const updating = toast({
      title: "Updating order...",
      description: "Order is being updated, please wait",
      variant: "instructive",
    });

    const isSuccess = await updater();
    updating.dismiss();

    if (isSuccess) {
      router.refresh();
    } else {
      unSetter();
    }

    toast({
      title: isSuccess ? "Order Updated" : "Order Update Failed",
      description: isSuccess ? "Order has been updated successfully " : "Order update failed due to a system error",
      variant: isSuccess ? "constructive" : "destructive",
    });
    setIsLoading(false);
  }

  const holdReasonForm = useForm({
    defaultValues: {
      holdReason: "",
    },
  });

  return (
    <styled.div display={"flex"} flexDir={"column"} gap={"2xl"}>
      <styled.div display={"flex"} flexDirection={"column"} gap={"2xl"}>
        <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
          <styled.h4 fontWeight={600} textStyle={"textStyles.headings.h4"} fontSize={"lg"} color={"primary.700"}>
            Delivery Date
          </styled.h4>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xl"}>
            <styled.p font-weight={700} color={"primary.700}"} font-size={"1.35rem"}>
              {format(new Date(order.deliveryDate), "dd/MM/yyyy")}
            </styled.p>
          </styled.div>
        </styled.div>
        <styled.h4 fontWeight={500} textStyle={"textStyles.headings.h4"} fontSize={"lg"} color={"primary.700"}>
          Patient Details
        </styled.h4>
        <styled.div display={"flex"} flexDirection={"column"} gap={"xl"}>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
              Patient Name
            </styled.p>
            <styled.p>{order.patient.name}</styled.p>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
              {order.patient.ownerId? "Patient Reference ID": "Simplex Code"}
            </styled.p>
            <styled.p>{order.patient.refId}</styled.p>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
              Patient Birthday
            </styled.p>
            <styled.p>{format(new Date(order.patient.birthdate), "dd/MM/yyyy")}</styled.p>
          </styled.div>
        </styled.div>
      </styled.div>
      <styled.div display={"flex"} flexDirection={"column"} gap={"2xl"}>
        <styled.h4 fontWeight={500} textStyle={"textStyles.headings.h4"} fontSize={"lg"} color={"primary.700"}>
          Order Details
        </styled.h4>
        <styled.div display={"flex"} flexDirection={"column"} gap={"xl"}>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
              Order Status
            </styled.p>
            <Popover.Root>
              <Popover.Trigger asChild>
                <Button
                  variant="ghost"
                  w="11xl"
                  bg={`${status.color}.9`}
                  color="instructive.foreground"
                  css={{
                    _hover: {
                      bg: `${status.color}.10`,
                      color: "instructive.foreground",  
                    },
                    "@media print": {
                      bg: "none",
                      color: "gray.900",
                    },
                  }}
                  role="combobox"
                  justifyContent="space-between"
                >
                  {status.label}
                  <ChevronsUpDown
                    className={cx(
                      icon({ left: "auto", dimmed: true }),
                      css({ w: "xl", h: "auto" }),
                      css({
                        "@media print": {
                          display: "none",
                        },
                      })
                    )}
                  />
                </Button>
              </Popover.Trigger>
              <Popover.Content className={css({ p: 0, w: "20rem" })}>
                <Command>
                  <CommandInput placeholder="Search status..." />
                  <CommandEmpty>No status found.</CommandEmpty>
                  <CommandGroup>
                    {appSettings.orderStatuses.map((orderStatusOption) => (
                      <Popover.Close w='full' display='block'>
                        <CommandItem
                          value={orderStatusOption.id}
                          key={orderStatusOption.id}
                          onSelect={async () => {
                            if (!DB.ADMINISTRATIVE_ROLES.includes(data?.user?.role as (typeof DB.ADMINISTRATIVE_ROLES)[number])) {
                              return;
                            }
                            await update(
                              () => updateOrder(order.id, { statusId: status.id }, { statusId: orderStatusOption.id }),
                              () => setStatus(orderStatusOption),
                              () => setStatus(status)
                            );
                          }}>
                          <Check className={css({ w: "xl", h: "auto" })} opacity={status.id === orderStatusOption.id ? "1" : "0"} />
                          {orderStatusOption.label}
                        </CommandItem>
                      </Popover.Close>
                    ))}
                  </CommandGroup>
                </Command>
              </Popover.Content>
            </Popover.Root>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xl"}>
            <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
              <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
                Order Priority
              </styled.p>
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Button
                    w="11xl"
                    variant="ghost"
                    bg={PRIORITY_COLORS[order.priority]}
                    color={`${PRIORITY_COLORS[priority]}.foreground`}
                    border={`1px solid token(colors.${PRIORITY_COLORS[priority]}).foreground`}
                    css={{
                      _hover: {
                        bg: `${PRIORITY_COLORS[priority]}.200`,
                        color: `${PRIORITY_COLORS[priority]}.100`,
                      },
                      "@media print": {
                        bg: "none",
                        color: "gray.900",
                      },
                    }}
                    role="combobox"
                    justifyContent="space-between"
                  >
                    {getKeyByValue(DB.Priority, priority).replaceAll("_", " ")}
                    <ChevronsUpDown
                      className={cx(
                        icon({ left: "auto", dimmed: true }),
                        css({ w: "xl", h: "auto" }),
                        css({
                          "@media print": {
                            display: "none",
                          },
                        })
                      )}
                    />
                  </Button>
                </Popover.Trigger>
                <Popover.Content className={css({ p: 0, w: "20rem" })}>
                  <Command>
                    <CommandInput placeholder="Search priorities..." />
                    <CommandEmpty>No priorities found.</CommandEmpty>
                    <CommandGroup>
                      {Object.entries(DB.Priority).map(([name, val]) => (
                        <Popover.Close w='full' display='block'>
                            <CommandItem
                            value={val}
                            key={name}
                            onSelect={async () => {
                              await update(
                                () => updateOrder(order.id, { priority: priority as DB.Priority }, { priority: val }),
                                () => setPriority(val),
                                () => setPriority(priority)
                              );
                            }}>
                            <Check className={css({ w: "xl", h: "auto" })} opacity={priority === val ? "1" : "0"} />
                            {name.replaceAll("_", " ")}
                          </CommandItem>
                        </Popover.Close>
                      ))}
                    </CommandGroup>
                  </Command>
                </Popover.Content>
              </Popover.Root>
            </styled.div>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xl"}>
            <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
              <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
                Order Assignee
              </styled.p>
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Button
                    w="11xl"
                    variant="outline"
                    role="combobox"
                    justifyContent="space-between"
                    css={{
                      "@media print": {
                        bg: "none",
                        color: "gray.900",
                        border: "none",
                      },
                    }}
                    color={!assigneeId ? "muted.foreground" : undefined}
                  >
                    {assigneeId ? users.find((user) => user.id === assigneeId)?.firstName : "Select assignee"}
                    <ChevronsUpDown
                      className={cx(
                        icon({ left: "auto", dimmed: true }),
                        css({ w: "xl", h: "auto" }),
                        css({
                          "@media print": {
                            display: "none",
                          },
                        })
                      )}
                    />
                  </Button>
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
                            onSelect={async () => {
                              if (!DB.ADMINISTRATIVE_ROLES.includes(data?.user?.role as (typeof DB.ADMINISTRATIVE_ROLES)[number])) {
                                return;
                                }
                                
                              await update(
                                () => updateOrderAssignee(order.id, assigneeId!, user.id),
                                () => setAssigneeId(user.id),
                                () => setAssigneeId(assigneeId)
                              );
                            }}>
                            <Check className={css({ w: "xl", h: "auto" })} opacity={user.id === assigneeId ? "1" : "0"} />
                            {user.firstName} {user.lastName}
                          </CommandItem>
                        </Popover.Close>
                      ))}
                    </CommandGroup>
                  </Command>
                </Popover.Content>
              </Popover.Root>
            </styled.div>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <Flex alignItems="center" gap="2">
              <Label htmlFor="order-onhold">On Hold?</Label>
              <Dialog open={holdReasonPopupOpen} onOpenChange={setholdReasonPopupOpen}>
                <Switch
                  id="order-onhold"
                  checked={onHold}
                  onCheckedChange={async () => {
                    if (!onHold) return setholdReasonPopupOpen(true);
                    
                    await update(
                      () => updateOrder(order.id, { onHold, holdReason: order.holdReason }, { onHold: !onHold, holdReason: "" }),
                      () => setOnHold((onHold) => !onHold),
                      () => setOnHold((onHold) => !onHold)
                    );
                  }}
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle display="flex" alignItems={"center"} gap="md">
                      <Category />
                      Hold Reason
                    </DialogTitle>
                    <Form {...holdReasonForm}>
                      <form
                        onSubmit={holdReasonForm.handleSubmit((data) => {
                          startTransition(async () => {
                            await update(
                              () => updateOrder(order.id, { onHold: false }, { onHold: true, holdReason: data.holdReason }),
                              () => {
                                holdReasonForm.reset();
                                setholdReasonPopupOpen(false);
                                setOnHold((onHold) => !onHold);
                              },
                              () => {
                                holdReasonForm.reset();
                                setholdReasonPopupOpen(false);
                                setOnHold((onHold) => !onHold);
                              }
                            );
                          });
                        })}
                        className={css({ spaceY: "8", fontSize: "sm" })}>
                        <FormField
                          name="holdReason"
                          control={holdReasonForm.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea w="full" type="textfield" placeholder="Enter your reason here." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Save</Button>
                      </form>
                    </Form>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </Flex>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
              Specialist
            </styled.p>
            <styled.p>
              {order.specialist.firstName} {order.specialist.lastName}
            </styled.p>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
              Location
            </styled.p>
            <styled.p>{order.location.name}</styled.p>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
              Category
            </styled.p>
            <styled.p>{order.category.name}</styled.p>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
              Sub Category
            </styled.p>
            <styled.p>{order.subCategory.name}</styled.p>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
              Specific Details
            </styled.p>
            <styled.p>
              <Plate readOnly initialValue={order.specificDetails} plugins={plugins}>
                <PlateContent readOnly disabled className={css({ focusRingWidth: "0" })} />
              </Plate>
            </styled.p>
          </styled.div>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xs"}>
            <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
              Images Attached?
            </styled.p>
            <styled.p>{String(order.imagesAttached)}</styled.p>
          </styled.div>
          {"illuminatedPhotos" in order && order.illuminatedPhotos && order.illuminatedPhotos.length > 0 && (
            <styled.div
              css={{
                "@media print": {
                  display: "none",
                },
              }}
              display={"flex"}
              flexDirection={"column"}
              gap={"xs"}
            >
              <styled.p fontWeight={200} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
                Attachment(s)
              </styled.p>
              <Popover.Root>
                <Popover.Trigger asChild>
                  <Button w="fit-content" variant={"secondary"}>
                    View Attachment(s)
                  </Button>
                </Popover.Trigger>
                <Popover.Content className={css({ w: "30rem", h: "40erm", px: "3xl", py: "2xl", overflowY: "auto" })}>
                  <div className={css({ display: "grid", gap: "4" })}>
                    <div className={css({ spaceY: "2" })}>
                      <h4 className={css({ textStyle: "textStyles.headings.h4", fontWeight: "semibold", leading: "none" })}>Gallary</h4>
                      <p className={muted()}>View all attachments.</p>
                    </div>
                    <div className={css({ display: "grid", gridTemplateColumns: "3", gap: "2" })}>
                      {order.illuminatedPhotos.map((url, i) => (
                        <Button key={i} position={"relative"} w="10rem" h="8rem" variant={"ghost"} onClick={() => downloadFile(order.id, url)}>
                          {url.split("@").pop()!.split("/")[0] === "image" ||
                          ["png", "jpg", "jpeg"].includes(url.split("@")[0].split(".").at(-1) as string) ? (
                            <Image src={url} alt="Attached Image" fill style={{ objectFit: "cover" }} />
                          ) : (
                            `Download ${url.split("@")[0].split("/").at(-1)?.slice(-25)}`
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Popover.Content>
              </Popover.Root>
            </styled.div>
          )}
        </styled.div>
      </styled.div>
      {"metadata" in order && order.metadata?.fields.length === 0 ? null : (
        <styled.div
          css={{
            "@media print": {
              display: "none",
            },
          }}
          display={"flex"}
          flexDirection={"column"}
          gap={"2xl"}
        >
          <styled.h4 fontWeight={500} textStyle={"textStyles.headings.h4"} fontSize={"lg"} color={"primary.700"}>
            Additional Details
          </styled.h4>
          <styled.div display={"flex"} flexDirection={"column"} gap={"xl"}>
            {order.metadata?.fields.map(
              ({ name, value }, i) =>
                value !== "" && (
                  <styled.div display={"flex"} flexDirection={"column"} gap={"xs"} key={i}>
                    <styled.p fontWeight={700} color={"gray.500"} textTransform={"uppercase"} fontSize={"sm"}>
                      {name}
                    </styled.p>
                    <styled.p>{String(value)}</styled.p>
                  </styled.div>
                )
            )}
          </styled.div>
        </styled.div>
      )}
    </styled.div>
  );
}
