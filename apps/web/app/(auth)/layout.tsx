import { HStack, styled } from "@atdb/design-system";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (session) redirect("/dashboard/orders");

  return (
    <HStack gap={0} css={{ height: "100vh" }}>
      <styled.div css={{ width: "45%", bg: "gray.100", height: "100%", centered: true }}>{children}</styled.div>
      <styled.div
        css={{
          width: "55%",
          position: "relative",
          height: "100%",
        }}
      >
        <Image src="/images/loginbg.svg" fill alt="" style={{ objectFit: "cover" }} />
      </styled.div>
    </HStack>
  );
}
