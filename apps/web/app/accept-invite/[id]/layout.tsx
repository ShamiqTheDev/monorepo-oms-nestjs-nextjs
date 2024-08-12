import { HStack, styled } from "@atdb/design-system";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HStack gap={0} css={{ height: "100vh" }}>
      <styled.div css={{ width: "full", md: { width: "40%" }, bg: "gray.100", height: "100%", centered: true }}>{children}</styled.div>
      <styled.div
        css={{
          hideBelow: "md",
          width: "60%",
          position: "relative",
          height: "100%",
        }}
      >
        <Image src="/images/loginbg.svg" fill alt="" style={{ objectFit: "cover" }} />
      </styled.div>
    </HStack>
  );
}
