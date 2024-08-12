"use client";

import { styled } from "@atdb/design-system";
import { DB } from "@atdb/types";
import NextLink from "next/link";
import { Notification } from "./types";

const Link = styled(NextLink);

interface NotificationContentProps {
  notification: Notification;
}

export function NotificationContent(props: NotificationContentProps) {
  const { notification } = props;

  switch (notification.action) {
    case DB.NotificationAction.Assign:
      return (
        <>
          You have been assigned to order with ID
          <Link
            color={"instructive.300"}
            _hover={{
              color: "instructive.400",
              textDecoration: "underline",
            }}
            prefetch={false}
            href={`/dashboard/orders/${notification.metadata.orderId!}`}
          >
            #{notification.metadata.orderId!.toString().padStart(4, "0")}
          </Link>{" "}
          by {notification.initiator.firstName} {notification.initiator.lastName}.
        </>
      );

    case DB.NotificationAction.Reminder:
      return (
        <>
          You have unfinished order #
          <Link
            color={"instructive.300"}
            _hover={{
              color: "instructive.400",
              textDecoration: "underline",
            }}
            prefetch={false}
            href={`/dashboard/orders/${notification.metadata.orderId!}`}
          >
            #{notification.metadata.orderId!.toString().padStart(4, "0")}
          </Link>
        </>
      );

    case DB.NotificationAction.Mention:
      return (
        <>
          You have been mentioned by {notification.initiator.firstName} {notification.initiator.lastName} in order{" "}
          <Link
            color={"instructive.300"}
            _hover={{
              color: "instructive.400",
              textDecoration: "underline",
            }}
            prefetch={false}
            href={`/dashboard/orders/${notification.metadata.orderId!}`}
          >
            #{notification.metadata.orderId!.toString().padStart(4, "0")}
          </Link>
        </>
      );
  }
}
