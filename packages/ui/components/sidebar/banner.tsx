import { Center, styled } from "@atdb/design-system";

export function Banner() {
  return (
    <Center borderBottom={"1px solid token(colors.gray.300)"} w={"full"} h={"7xl"} px={"6xl"} py={"3xl"}>
      <styled.h3 textStyle={"h3"}>Dentalzorg</styled.h3>
    </Center>
  );
}
