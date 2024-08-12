import { Grid, GridItem, styled } from "@atdb/design-system";
import { Breadcrumb, Navbar, Sidebar } from "@atdb/ui";
import { css } from "@atdb/design-system";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Grid width={"100vw"} height={"100vh"} gridTemplateColumns={"1fr 4fr"} gap={0}>
      {/* <GridItem> */}
      <Sidebar />
      {/* </GridItem> */}
      <GridItem gap={"4xl"} px={"4xl"} py={"3xl"} w="100vw" md={{ w: "auto" }}>
        <Navbar />
        <styled.div mb={"lg"}>
          <Breadcrumb capitalizeLinks={true} activeClasses={css({ fontWeight: 600 })} separator={<span>&gt;</span>} />
        </styled.div>
        <styled.main overflow="auto">{children}</styled.main>
      </GridItem>
    </Grid>
  );
}
