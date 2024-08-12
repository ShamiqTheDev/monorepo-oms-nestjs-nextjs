import { HStack, styled } from "@atdb/design-system";
import Image from "next/image";
import { PasswordResetForm } from "./reset-password-form";
import { UpdatePasswordForm } from "./update-password-form";

const VAStack = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

export default function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const token = searchParams.t as string | undefined;

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
            Reset your password
          </styled.h1>
        </VAStack>
      </VAStack>
      {token ? <UpdatePasswordForm token={token} /> : <PasswordResetForm />}
    </VAStack>
  );
}
