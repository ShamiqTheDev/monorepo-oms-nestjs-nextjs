"use server";

import * as Popover from "../popover";
import { Box, css, HStack, muted, styled } from "@atdb/design-system";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";
import { DirectNotification } from "@atdb/icons";
import authOptions from "@atdb/auth-options";
import { getServerSession } from "next-auth";
import { Auth } from "@atdb/client-services";
import { Button } from "../button";
import Greet from "./greet";
import { NotificationContent } from "./notification-content";
import { Notification } from "./types";
import { toTitleCase2 } from "../../../../apps/web/app/utils";
const getUserNotifications = async (): Promise<Notification[]> => {
  const session = await getServerSession(authOptions);

  const notifications = await Auth.request<Notification[]>(`/notifications`, {
    headers: { Authorization: `Bearer ${session?.secrets.access_token}` },
  });

  return notifications || [];
};

interface NavbarProps {}

export async function Navbar(props: NavbarProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  
  const notifications = await getUserNotifications();

  return (
    <styled.nav display={"flex"} justifyContent={"space-between"} mb={"6xl"}>
      <styled.div display={"flex"} gap={"2xl"}>
        <Image src="/images/welcome-icon.svg" width={32} height={32} alt="" />
        <styled.div lineHeight={1.2} display={"flex"} flexDirection={"column"}>
          <styled.h1 fontWeight={"500"} fontFamily={""} fontSize={"1.25rem"}>
            Hi, {session?.user.firstName}!
          </styled.h1>
          <styled.h1 fontWeight={"400"} fontSize={"sm"}>
            <Greet />
          </styled.h1>
        </styled.div>
      </styled.div>
      <HStack gap={"lg"}>
        <HStack>
          <Avatar>
            <AvatarImage src={session.user.avatarUrl} alt={`${session.user.firstName} ${session.user.lastName}'s Avatar`} />
            <AvatarFallback>{session.user.firstName[0].concat(session.user.lastName[0])}</AvatarFallback>
          </Avatar>
          <Box>
            <styled.div fontSize={"sm"} color={"gray.900"} fontWeight={600}>
              {session.user.firstName} {session.user.lastName}
            </styled.div>
            <styled.div fontSize={"sm"} color={"gray.700"}>
              {toTitleCase2(session.user.role)}
            </styled.div>
          </Box>
        </HStack>
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="ghost" p={0}>
              <DirectNotification fill="red" size={24} className={css({ color: "gray.700" })} />
            </Button>
          </Popover.Trigger>
          <Popover.Content className={css({ w: "80", p: "4" })}>
            <div className={css({ display: "grid", gap: "4" })}>
              <div className={css({ spaceY: "2" })}>
                <h4 className={css({ fontWeight: "semibold", leading: "none" })}>Notifications</h4>
                <p className={muted()}>All of your notifications.</p>
              </div>
              <div className={css({ display: "grid", gap: "2" })}>
                <div
                  className={css({
                    display: "flex",
                    flexDir: "column",
                    gap: "4",
                  })}
                >
                  {notifications.map((notification) => (
                    <styled.div key={notification.id} w="full" display={"flex"} gap="md">
                      <styled.div>
                        {"initiator" in notification && notification.initiator && (
                          <Avatar>
                            <AvatarImage
                              src={notification.initiator.avatarUrl}
                              alt={`${notification.initiator.firstName} ${notification.initiator.lastName}'s Avatar`}
                            />
                            <AvatarFallback>
                              {notification.initiator.firstName[0].concat(notification.initiator.lastName[0])}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </styled.div>
                      <styled.div w="full" fontSize={"sm"}>
                        <styled.span fontWeight="semibold">
                          <NotificationContent notification={notification} />
                        </styled.span>
                      </styled.div>
                    </styled.div>
                  ))}
                </div>
              </div>
            </div>
          </Popover.Content>
        </Popover.Root>
      </HStack>
    </styled.nav>
  );
}
