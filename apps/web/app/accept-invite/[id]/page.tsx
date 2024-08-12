import { HStack, styled } from "@atdb/design-system";
import Image from "next/image";
import { SignUpForm } from "./form";
import { Auth } from "@atdb/client-services";
import { getServerSession } from "next-auth";
import authOptions from "@atdb/auth-options";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { notFound } from "next/navigation";
import { fetchAppSettings } from "../../../server-utils";

const VAStack = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

const fetchInvite = async (id: string): Promise<Selectable<DB.Invitation> | null> => {
  const session = await getServerSession(authOptions);
  return await Auth.request<Selectable<DB.Invitation>>(`invitations/${id}`, {
    headers: { Authorization: `Bearer ${session?.secrets.access_token}` },
  });
};

type Props = {
  params: { id: string };
};

export default async function Signup({ params: { id } }: Props) {
  const invite = await fetchInvite(id);
  const appSettings = await fetchAppSettings();

  if (!invite) notFound();

  return (
    <VAStack gap={"6xl"} w={"20rem"} md={{ w: "26rem" }}>
      <VAStack gap={"4xl"}>
        <HStack display={"flex"} alignItems={"center"}>
          <Image src="/icon.png" width={20} height={20} alt="DentalZorg Logo" />
          <styled.h2 color={"primary.600"} textStyle={"textStyles.headings.h2"}>
            <b>Dentalzorg</b> Dashboard
          </styled.h2>
        </HStack>
        <VAStack gap={"sm"}>
          <styled.h1 textStyle={"textStyles.headings.h1"} fontWeight={"bold"}>
            Create a new account
          </styled.h1>
          <styled.h2 textStyle={"textStyles.headings.h3"}>Manage digital dentistry needs like never before.</styled.h2>
        </VAStack>
      </VAStack>
      <SignUpForm {...{ invite, appSettings }} />
    </VAStack>
  );
}
