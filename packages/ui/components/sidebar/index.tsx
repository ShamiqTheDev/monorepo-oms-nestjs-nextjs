"use server";

import { Center, css, cx, styled } from "@atdb/design-system";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "../nav-menu";
import NextLink from "next/link";
import { Notepad2 as Note, Setting2, People, NoteRemove } from "@atdb/icons";
import { DB } from "@atdb/types";
import { getServerSession } from "next-auth";
import authOptions from "@atdb/auth-options";
import LogoutButton from "./logout-button";

const Link = styled(NextLink);

export async function Sidebar() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <styled.aside hideBelow={"md"} height={"100%"} bg={"gray.100"} width={"17rem"} borderRight={"1px solid token(colors.gray.300)"}>
        <Center borderBottom={"1px solid token(colors.gray.300)"} w={"full"} h={"7xl"} px={"6xl"} py={"3xl"}>
          <styled.h3 textStyle={"h3"}>Dentalzorg</styled.h3>
        </Center>
        <NavigationMenu>
          <NavigationMenuList py={"2xl"}>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/dashboard/orders">
                  <styled.span display={"flex"} alignItems={"center"} gap="md">
                    <Note variant="Bold" />
                    Orders List
                  </styled.span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link prefetch={false} href="/dashboard/orders/closed">
                  <styled.span display={"flex"} alignItems={"center"} gap="md">
                    <NoteRemove variant="Bold" />
                    Closed Orders
                  </styled.span>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {session && session.user.role !== DB.Role.Customer && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link prefetch={false} href="/dashboard/patients">
                    <styled.span display={"flex"} alignItems={"center"} gap="md">
                      <People variant="Bold" />
                      Patients List
                    </styled.span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {session && session.user.role !== DB.Role.Customer && (
              <NavigationMenuItem justifyContent={"start"}>
                <NavigationMenuLink asChild justifyContent={"start"}>
                  <Link href="/dashboard/settings" className={cx(css({ justifyContent: "start" }))}>
                    <styled.span display={"flex"} alignItems={"center"} gap="md">
                      <Setting2 variant="Bold" />
                      Manage
                    </styled.span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem w="full" justifyContent={"start"}>
              <NavigationMenuLink asChild justifyContent={"start"}>
                <LogoutButton />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </styled.aside>
      <styled.div
        border={"1.5px solid token(colors.gray.300)"}
        display={"initial"}
        pos="fixed"
        bottom={0}
        zIndex={4000}
        left="50%"
        hideFrom={"md"}
        x={"-50%"}
        y="-50%"
        bg="gray.50"
        borderRadius={"15px"}
        boxShadow={"0 0 10px 2px hsla(262 32% 11% / 5%)"}
      >
        <NavigationMenu>
          <NavigationMenuList height="4rem" paddingX={"xl"} flexDir={"row !important"} py={"2xl"}>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link w="full !important" display={"flex"} alignItems={"center"} gap="md" href="/dashboard/orders">
                  <Note variant="Bold" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link prefetch={false} w="full !important" display={"flex"} alignItems={"center"} gap="md" href="/dashboard/patients">
                  <People variant="Bold" />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {session && session.user.role !== DB.Role.Customer && (
              <NavigationMenuItem justifyContent={"start"}>
                <NavigationMenuLink asChild justifyContent={"start"}>
                  <Link
                    w="full !important"
                    display={"flex"}
                    alignItems={"center"}
                    gap="md"
                    href="/dashboard/settings"
                    className={cx(css({ justifyContent: "start" }))}
                  >
                    <Setting2 variant="Bold" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem w="full !important" justifyContent={"start"}>
              <NavigationMenuLink w="full" asChild justifyContent={"start"}>
                <LogoutButton />
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </styled.div>
    </>
  );
}
