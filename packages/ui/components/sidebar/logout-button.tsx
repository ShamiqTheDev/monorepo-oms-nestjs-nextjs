"use client";

import { styled } from "@atdb/design-system";
import { Button } from "../button";
import { LogoutCurve } from "@atdb/icons";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {}

export default function LogoutButton({}: LogoutButtonProps) {
  return (
    <Button
      variant={"ghost"}
      w="full"
      h="full"
      px="lg"
      py="md"
      fontWeight={600}
      _hover={{ background: "gray.200" }}
      justifyContent={"start"}
      onClick={() => signOut()}
    >
      <styled.span w="full" display={"flex"} alignItems={"center"} gap="md">
        <LogoutCurve variant="Outline" />
        Logout
      </styled.span>
    </Button>
  );
}
