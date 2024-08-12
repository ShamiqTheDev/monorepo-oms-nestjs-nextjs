import { Center, Circle, Divider, Flex, Grid, styled } from "@atdb/design-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@atdb/ui";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { OrderQuickActionsForm } from "./quick-actions.form";
import { fetchAppSettings, fetchUsers } from "../../../server-utils";
import { fetchOrder } from "../../dashboard/orders/server-utils";

type Props = {
  params: { id: string };
};

const Link = styled(NextLink);

export default async function Page({ params: { id } }: Props) {
  const order = await fetchOrder(id);
  if (!order || order.deleted) return notFound();

  const users = await fetchUsers();
  const { orderStatuses } = await fetchAppSettings();

  return (
    <Center h="100vh">
      <main>
        <Card w="11xl">
          <CardHeader>
            <CardTitle>Order #{order.id.toString().padStart(4, "0")}</CardTitle>
            <CardDescription>Perform quick actions on the order</CardDescription>
            <Flex gap="md">
              <Flex gap="sm" alignItems="center">
                <Link
                  href={`/dashboard/orders/${id}`}
                  color={"instructive.300"}
                  prefetch={false}
                  _hover={{
                    color: "instructive.400",
                    textDecoration: "underline",
                  }}
                >
                  View
                </Link>
              </Flex>
              <Flex 
                gap="sm" 
                alignItems="center" 
                bg={"gray.50"} 
                border={"1px solid token(colors.gray.100)"} 
                px=".5rem" 
                py=".25rem" 
                rounded="sm"
              >
                <Circle size="lg" bg={`${order.status.color}.9`} border={`1px solid token(colors.${order.status.color}).foreground`} />
                {order.status.label}
              </Flex>
              <Divider orientation="vertical" color={"gray.900"} />
            </Flex>
          </CardHeader>
          <CardContent>
            <Grid w="full" alignItems="center" gap="4">
              <Flex flexDirection="column" gap="1.5">
                <Center>Quick Actions</Center>
                <OrderQuickActionsForm {...{ order, users, orderStatuses }} />
              </Flex>
              <Flex flexDirection="column" gap="1.5"></Flex>
            </Grid>
          </CardContent>
          {/* <CardFooter>Card Footer</CardFooter> */}
        </Card>
      </main>
    </Center>
  );
}
