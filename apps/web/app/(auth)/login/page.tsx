"use client";

import { HStack, css, styled } from "@atdb/design-system";
import { Input } from "@atdb/ui";
import Image from "next/image";
import Link from "next/link";
import { Sms, PasswordCheck } from "@atdb/icons";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
const VAStack = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) return;

    const req = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (req?.error) return setError(req.error);
    if (req?.ok) return router.push("/dashboard");
  }

  return (
    <VAStack gap={"6xl"}>
      <VAStack gap={"4xl"}>
        <HStack display={"flex"} alignItems={"center"}>
          <Image src="/icon.png" width={26} height={26} alt="AtlasAI Logo" />
          <styled.h2 color={"primary.600"} textStyle={"textStyles.headings.h2"}>
            <b>Dentalzorg</b> Dashboard
          </styled.h2>
        </HStack>
        <VAStack gap={"sm"}>
          <styled.h1 textStyle={"textStyles.headings.h1"} fontWeight={"bold"}>
            Sign in to your account
          </styled.h1>
          <styled.h2 textStyle={"textStyles.headings.h3"}>
            Manage your clients' needs with{" "}
            <Link
              href={"https://dentalzorg.com"}
              target="_blank"
              className={css({
                color: "primary.600",
                fontWeight: "bold",
              })}
            >
              Dentalzorg
            </Link>
          </styled.h2>
        </VAStack>
      </VAStack>
      <form onSubmit={onSubmit}>
        <VAStack gap={"xl"}>
          <Input.Root w={"full"}>
            <Input.Icon>
              <Sms size={"20px"} />
            </Input.Icon>
            <Input.Control type={"email"} placeholder="Email" name="email" />
          </Input.Root>
          <Input.Root w={"full"}>
            <Input.Icon>
              <PasswordCheck size={"20px"} />
            </Input.Icon>
            <Input.Control type={"password"} placeholder="Password" name="password" />
          </Input.Root>
          <styled.button
            bg={"primary.500"}
            boxShadow={"0px 9px 17px 0px hsla(254 46% 31% / 15%)"}
            py={"lg"}
            px={"3xl"}
            color={"gray.25"}
            rounded={"8px"}
            type="submit"
          >
            Sign in
          </styled.button>
        </VAStack>
        {error && <styled.p color={"destructive"}>{error}</styled.p>}
      </form>
      <Link
        href={"/reset-password"}
        className={css({
          color: "primary.600",
        })}
      >
        Reset Password
      </Link>
    </VAStack>
  );
}
