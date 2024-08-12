"use client";

import { Box, css, muted, styled } from "@atdb/design-system";
import { OrderChange, OrderComment } from "./types";
import {
  Button,
  plugins,
  Popover,
  ScrollArea,
  CardsList,
  CardBody,
  CardBodyContent,
  CardBodyTime,
  CardItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@atdb/ui";
import { Loader2 } from "lucide-react";
import { DB } from "@atdb/types";
import { Selectable } from "kysely";
import { format, formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import OrderCommentForm from "./comment-form/comment-form";
import { Plate, PlateContent, TElement } from "@udecode/plate-common";
import { Order } from "../type";
import { downloadFile, PRIORITY_COLORS } from "../client-utils";
import { extractIdsFromTag } from "../utils";
import { Clock, MessageRemove } from "@atdb/icons";
import { useToast } from "@atdb/client-providers";
import { deleteComment } from "./action";
import { useRouter } from "next/navigation";

interface OrderSideControlProps {
  order: Order;
  users: Selectable<DB.User>[];
  appSettings: Selectable<DB.AppSettings>;
  orderComments: OrderComment[];
  orderChanges: OrderChange[];
}

interface OrderChangeProps {
  orderId: number;
  field: keyof DB.Order;
  state: { old: string; new: string };
  users: Selectable<DB.User>[];
  appSettings: Selectable<DB.AppSettings>;
}

const getOrderChangeArgs = ({ orderId, field, state, appSettings, users }: OrderChangeProps) => {
  const args = {
    title: field.includes(" ") ? field : field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
    oldVal: state.old,
    newVal: state.new,
    oldColor: "gray",
    bg: "gray",
    color: "instructive.foreground",
    display: "inline-flex",
    newColor: "instructive",
  } as {
    title: string | React.JSX.Element;
    oldVal?: string | React.JSX.Element;
    oldColor: any;
    newVal: string | React.JSX.Element;
    newColor: any;
  };
  switch (field) {
    case "specificDetails":
      args.oldVal = state.old ? (
        <Popover.Root>
          <Popover.Trigger asChild>
            <styled.button w="full">Old Specific Details</styled.button>
          </Popover.Trigger>
          <Popover.Content className={css({ w: "30rem", h: "40erm", px: "3xl", py: "2xl", overflowY: "auto" })}>
            <Plate
              readOnly
              initialValue={typeof state.old === "string" ? JSON.parse(state.old) : (state.old as unknown as TElement[])}
              plugins={plugins}
            >
              <PlateContent readOnly disabled className={css({ focusRingWidth: "0" })} />
            </Plate>
          </Popover.Content>
        </Popover.Root>
      ) : undefined;
      args.newVal = (
        <Popover.Root>
          <Popover.Trigger asChild>
            <styled.button w="full">New Specific Details</styled.button>
          </Popover.Trigger>
          <Popover.Content className={css({ w: "30rem", h: "40erm", px: "3xl", py: "2xl", overflowY: "auto" })}>
            <Plate readOnly initialValue={JSON.parse(state.new) as unknown as TElement[]} plugins={plugins}>
              <PlateContent readOnly disabled className={css({ focusRingWidth: "0" })} />
            </Plate>
          </Popover.Content>
        </Popover.Root>
      );
      break;
    case "statusId":
      args.title = "Status";
      const oldStatus = appSettings.orderStatuses.find((status) => status.id.toString() === state.old.toString());
      const newStatus = appSettings.orderStatuses.find((status) => status.id.toString() === state.new.toString());
      args.oldVal = oldStatus?.label;
      args.newVal = newStatus!.label;
      args.oldColor = `${oldStatus?.color}.9` || args.oldColor;
      args.newColor = `${newStatus!.color}.9`;
      break;
    case "assigneeId":
      args.title = "Assignee";
    case "specialistId":
      args.title = "Specialist";
      const oldUser = users.find((user) => user.id === state.old);
      const newUser = users.find((user) => user.id === state.new);
      args.oldVal = `${oldUser?.firstName} ${oldUser?.lastName}`;
      args.newVal = `${newUser?.firstName} ${newUser?.lastName}`;
      break;
    case "priority":
      args.oldColor = PRIORITY_COLORS[state.old];
      args.newColor = PRIORITY_COLORS[state.new];
      break;
    case "illuminatedPhotos":
      args.title = "Attachments";
      args.oldVal = state.old?.length ? (
        <Popover.Root>
          <Popover.Trigger asChild>
            <styled.button w="full">Old Attachment(s)</styled.button>
          </Popover.Trigger>
          <Popover.Content>
            <div className={css({ display: "grid", gap: "4" })}>
              <div className={css({ spaceY: "2" })}>
                <h4 className={css({ textStyle: "textStyles.headings.h4", fontWeight: "semibold", leading: "none" })}>Gallary</h4>
                <p className={muted()}>View all attachment.</p>
              </div>
              <div className={css({ display: "grid", gridTemplateColumns: "3", gap: "2" })}>
                {(state.old as unknown as string[]).map((url, i) => (
                  <Button key={i} position={"relative"} w="10rem" h="8rem" variant={"ghost"} onClick={() => downloadFile(orderId, url)}>
                    <Image src={url} alt="Attached Image" fill style={{ objectFit: "cover" }} />
                  </Button>
                ))}
              </div>
            </div>
          </Popover.Content>
        </Popover.Root>
      ) : undefined;
      args.newVal = (
        <Popover.Root>
          <Popover.Trigger asChild>
            <styled.button w="full">New Attachment(s)</styled.button>
          </Popover.Trigger>
          <Popover.Content className={css({ w: "30rem", h: "40erm", px: "3xl", py: "2xl", overflowY: "auto" })}>
            <div className={css({ display: "grid", gap: "4" })}>
              <div className={css({ spaceY: "2" })}>
                <h4 className={css({ textStyle: "textStyles.headings.h4", fontWeight: "semibold", leading: "none" })}>Gallary</h4>
                <p className={muted()}>View all attached images.</p>
              </div>
              <div className={css({ display: "grid", gridTemplateColumns: "3", gap: "2" })}>
                {(state.new as unknown as string[]).map((url, i) => (
                  <Button key={i} position={"relative"} w="10rem" h="8rem" variant={"ghost"} onClick={() => downloadFile(orderId, url)}>
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
      );
      break;
    case "categoryId":
      args.title = "Category";
      args.oldVal = appSettings.categories.find((category) => category.id.toString() === state.old)!.name;
      args.newVal = appSettings.categories.find((category) => category.id.toString() === state.new)!.name;
      break;
    case "subcategoryId":
      args.title = "Sub Category";
      args.oldVal = appSettings.subCategories.find((subCategory) => subCategory.id.toString() === state.old)!.name;
      args.newVal = appSettings.subCategories.find((subCategory) => subCategory.id.toString() === state.new)!.name;
      break;
    case "holdReason":
      args.title = "Hold Status";
      args.oldVal = state.old ? <span className={css({ textDecorationStyle: "wavy", textDecorationLine: "underline", color: "instructive.foreground" })} title={state.old}>On</span> : "Off";
      args.newVal = state.new ? <span className={css({ textDecorationStyle: "wavy", textDecorationLine: "underline", color: "instructive.foreground" })} title={state.new}>On</span> : "Off";
      break;
    case "locationId":
      args.title = "Location";
      args.oldVal = appSettings.locations.find((location) => location.id.toString() === state.old)!.name;
      args.newVal = appSettings.locations.find((location) => location.id.toString() === state.new)!.name;
      break;
    case "patientId":
      args.title = <span title="Or customer's patient reference number">Simplex Id</span>;
      break;
    case "deliveryDate":
      args.oldVal = format(new Date(state.old), "dd/MM/yyyy");
      args.newVal = format(new Date(state.new), "dd/MM/yyyy");
      break;
  }
  return args;
};

const OrderChangeMessage = ({ orderId, field, state, users, appSettings }: OrderChangeProps) => {
  const { title, oldVal, newVal, oldColor, newColor } = getOrderChangeArgs({ orderId, field, state, users, appSettings });
  return (
    <>
      <styled.span color="primary.700">{title}: </styled.span>
      <br />
      {oldVal && (
        <>
          <Box
            className={css({
              bg: oldColor,
              color: "instructive.foreground",
              display: "inline-flex",
              justifyContent: "center",
              alignContent: "center",
              fontSize: "xs",
              py: "xs",
              px: "sm",
              mx: "xs",
              minW: "4rem",
              rounded: "md",
            })}
          >
            {oldVal}
          </Box>{" "}
          ➜{" "}
        </>
      )}
      <Box
        className={css({
          bg: newColor,
          color: "instructive.foreground",
          display: "inline-flex",
          justifyContent: "center",
          alignContent: "center",
          fontSize: "xs",
          py: "xs",
          px: "sm",
          mx: "xs",
          minW: "4rem",
          rounded: "md",
        })}
      >
        {newVal}
      </Box>
    </>
  );
};

const UserMentionTag = styled("span", {
  base: {
    mx: "xs",
    px: "sm",
    bg: "instructive.50",
    border: "1px solid token(colors.instructive.200)",
    color: "instructive.500",
    rounded: "xs",
  },
});

const displayCommentUserTag = (users: Selectable<DB.User>[], content: string) => {
  const regex = /<@([^>]+)>/g;
  const matchedIds = extractIdsFromTag(content);
  const parts = content.split(regex);
  let components: (JSX.Element | string)[] = [];

  if (!matchedIds) return content;

  parts.map((part, index) => {
    if (matchedIds.includes(part)) {
      const user = users.find((user) => user.id === part);
      if (user) {
        return components.push(
          <UserMentionTag key={part + index}>
            @{user.firstName} {user.lastName}
          </UserMentionTag>
        );
      }

      return components.push(part);
    } else components.push(part);
  });
  return components;
};

export default function OrderSideControl({ order, users, appSettings, orderChanges, orderComments }: OrderSideControlProps) {
  const { data, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  if (status === "loading") return <Loader2 className={css({ animation: "spin" })} />;

  return (
    <styled.div display={"flex"} flexDir={"column"} gap={"2xl"}>
      <OrderCommentForm {...{ author: data?.user!, order, users }} />
      <styled.div display={"flex"} flexDirection={"column"} gap={"2xl"}>
        <CardsList asChild>
          <ScrollArea display="flex" flexDir="column" maxH="12xl" gap={"xl"}>
            {orderComments.map((comment) => (
              <CardItem key={comment.id} style={{ position: 'relative' }}>
                <CardBody>
                  <CardBodyTime>{format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm")}</CardBodyTime>
                  <CardBodyContent>
                    <styled.strong color={"primary.700"}>
                      {comment.author.firstName} {comment.author.lastName}
                    </styled.strong>
                    <styled.p overflowWrap={"anywhere"} fontWeight={300}>
                      {displayCommentUserTag(users, comment.content)}
          
                      {(comment.attachments?.length && (
                          <div>
                            <styled.b fontWeight={700}>Attachments:</styled.b>
                          </div>
                        ) &&
                        comment.attachments.map((attachment, i) => (
                          <Button key={i} w="full" position={"relative"} variant={"link"} onClick={() => downloadFile(21, attachment)}>
                            {`${decodeURIComponent(attachment.split("@")[0].split("/").at(-1)?.slice(-25)!)}`}
                          </Button>
                        ))) ||
                        ""}
                    </styled.p>
                  </CardBodyContent>
                </CardBody>
                {data?.user.id === comment.authorId ? (
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <MessageRemove
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this comment and all its attachments!  
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          variant={"destructive"} 
                          onClick={async () => {
                            const isConfirmed = await deleteComment(comment.id);
                            if (isConfirmed) router.refresh();

                            toast({
                              title: isConfirmed ? "Comment Deleted" : "Failed to delete Comment",
                              description: isConfirmed ? "Comment has been deleted successfully " : "Comment deletion failed due to a system error",
                              variant: isConfirmed ? "constructive" : "destructive",
                            });
                          }}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  ""
                )}
              </CardItem>
            ))}
          </ScrollArea>
        </CardsList>
      </styled.div>
      <styled.div display={"flex"} flexDirection={"column"} gap={"2xl"}>
        <styled.h4 borderBottom={`1px solid token(colors.gray.300)`} fontWeight={500} textStyle={"textStyles.headings.h4"}>
          Activity Log
        </styled.h4>
        <CardsList asChild>
          <ScrollArea maxH="12xl">
            {orderChanges.map((change) => (
              <CardItem key={change.id}>
                <CardBody>
                  <CardBodyTime>
                    {change.geo} {format(new Date(change.createdAt), "dd/MM/yyyy HH:mm")}
                  </CardBodyTime>
                  <CardBodyContent alignItems={"center"} lineHeight={"2.25"} overflowWrap={"anywhere"}>
                    <styled.strong color={"primary.700"}>
                      {change.initiator.firstName} {change.initiator.lastName}
                    </styled.strong>{" "}
                    has changed{" "}
                    {Object.keys(change.changedFields).length === 1 ? (
                      <OrderChangeMessage
                        {...{
                          orderId: order.id,
                          field: Object.keys(change.changedFields)[0] as keyof DB.Order,
                          state: Object.values(change.changedFields)[0],
                          users,
                          appSettings,
                        }}
                      />
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <styled.u textDecoration={"none"} borderBottom={"1px dotted token(colors.gray.300)"}>
                              order properties
                            </styled.u>
                          </TooltipTrigger>
                          <TooltipContent>
                            {Object.entries(change.changedFields).map(([field, state], index) => (
                              <styled.div lineHeight={"1.75"} key={index}>
                                <OrderChangeMessage
                                  {...{
                                    orderId: order.id,
                                    field: field as keyof DB.Order,
                                    state,
                                    users,
                                    appSettings,
                                  }}
                                />
                              </styled.div>
                            ))}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </CardBodyContent>
                </CardBody>
              </CardItem>
            ))}
            <CardItem>
                <CardBody>
                  <CardBodyTime>
                    {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                  </CardBodyTime>
                  <CardBodyContent alignItems={"center"} lineHeight={"2.25"} overflowWrap={"anywhere"}>
                    <styled.strong color={"primary.700"}>
                    <Clock size={14} style={{display: "inline"}} /> {order.assignee.firstName} {order.assignee.lastName}
                    </styled.strong>{" "}
                    has created the order.
                  </CardBodyContent>
                </CardBody>
              </CardItem>
          </ScrollArea>
        </CardsList>
      </styled.div>
    </styled.div>
  );
}
