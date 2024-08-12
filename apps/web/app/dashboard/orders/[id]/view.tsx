"use client";

import { DB } from "@atdb/types";
import { Circle, Flex, HStack, VStack, css, styled } from "@atdb/design-system";
import { Selectable } from "kysely";
import OrderController from "./controller";
import { format } from "date-fns";
import OrderSideControl from "./side-control";
import OrderDetails from "./details";
import { Loader2 } from "lucide-react";
import CurrentPageQRCode from "./current-page-qr-code";
import { Button } from "@atdb/ui";
import { notFound, useRouter } from "next/navigation";
import { useToast } from "@atdb/client-providers";
import type { OrderWCommentsAndChanges } from "../type";
import { fetchOrder, updateOrder } from "../server-utils";
import { useEffect, useState } from "react";
import { autoRefresh } from "../client-utils";
import { fetchOrderPdf } from "./action";

type OrderViewProps = {
  id: string;
  users: Selectable<DB.User>[];
  appSettings: Selectable<DB.AppSettings>;
};

export default function OrderView({ id, users, appSettings }: OrderViewProps) {
  
  const [order, setOrder] = useState(null as unknown as OrderWCommentsAndChanges | null);
  const [orderPdf, setOrderPdf] = useState("");
  useEffect(() => {
    const getOrder = async () => {
      try {
        const order = await fetchOrder(id, true);
        if (!order || order.deleted) return notFound();
        order.comments = order.comments.reverse().filter((comment) => !comment.deleted);
        order.changes = order.changes.reverse();
        setOrder(order);
        setOrderPdf(await fetchOrderPdf(id));
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };
    return autoRefresh(getOrder, 15000);
  }, []);

  const router = useRouter();
  const { toast } = useToast();

  
  const [isLoading, setIsLoading] = useState(false);
  const update = async (updater: () => Promise<boolean>) => {
    if (isLoading) return;
    setIsLoading(true);
    
    const updating = toast({
      title: "Updating order...",
      description: "Order is being updated, please wait",
      variant: "instructive",
    });
    
    const isSuccess = await updater();
    updating.dismiss();
  
    if (isSuccess) {
      router.refresh();
    }
    
    toast({
      title: isSuccess ? "Order Updated" : "Order Update Failed",
      description: isSuccess ? "Order has been updated successfully " : "Order update failed due to a system error",
      variant: isSuccess ? "constructive" : "destructive",
    });
    
    setIsLoading(false);
  }


  if (!order) return <Loader2 className={css({ animation: "spin" })} />;

  return ( 
    <styled.div w="full">
      <HStack w="full" display="flex" justifyContent="space-between">
        <styled.div> 
          <styled.p color={"gray.700"}>Order No. #{order.id.toString().padStart(4, "0")}</styled.p>
        </styled.div>
        <styled.div>
          <styled.p css={{ alignContent: "flex-end" }} color={"gray.700"}>Last update: {format(new Date(order.updatedAt), "dd/MM/yyyy HH:mm")}</styled.p>
        </styled.div>
        <styled.div
          css={{
            "@media print": {
              visibility: "hidden",
            },
          }}
        >
          <OrderController {...{ users, order, orderPdf }} />
        </styled.div>
      </HStack>
      <styled.div display={"grid"} gridTemplateColumns={"1fr"} md={{ gridTemplateColumns: "2fr 1fr" }} gridColumnGap={"xl"}>
        <styled.div display="flex" flexDirection={"column"} gap={"2xl"}>
          <styled.div display="flex" gap={"xl"}>
            <styled.h1 textStyle={"textStyles.headings.h1"}>
              {format(new Date(order.createdAt), "MMM, do yyyy")} — {order.patient.name}
              {order.urgent && (
                <styled.span color="destructive" fontWeight={"bold"}>
                  !
                </styled.span>
              )}
            </styled.h1>
            <Flex
              gap="sm"
              alignItems="center"
              bg={"gray.50"}
              border={"1px solid token(colors.gray.100)"}
              px=".5rem"
              py=".25rem"
              rounded="sm"
            >
              <Circle
                size="lg"
                bg={order.closed ? "destructive" : "constructive"}
                border={`1px solid token(colors.${order.closed ? "destructive" : "constructive"}).foreground`}
              />
              {order.closed ? "Closed" : "Open"}
            </Flex>
          </styled.div>
          <OrderDetails {...{ order, users, appSettings }} />
        </styled.div>
        <styled.div w="full" md={{ borderInlineStart: "1px solid token(colors.gray.300)", w: "full" }}>
          <styled.div md={{ marginInlineStart: "xl" }} display={"flex"} flexDirection={"column"} gap={"2xl"}>
            <styled.div mt="sm" display={"flex"} flexDirection={"column"} marginTop={"2xl"} md={{ marginTop: "0" }} gap={"2xl"}>
              <VStack
                className={css({
                  borderBlock: "1px solid token(colors.gray.300)",
                  paddingBlock: "2xl",
                  md: { borderBlock: "none", paddingBlock: "0" },
                  gap: "xl",
                })}
              >
                <CurrentPageQRCode orderId={order.id} />
                <Button
                  type="button"
                  w="full"
                  variant={order.closed ? "outline" : "destructive"}
                  onClick={async () => update(() => updateOrder(order.id, { closed: order.closed }, { closed: !order.closed }))}>
                  {order.closed ? "Reopen" : "Close"}
                </Button>
                <Button
                  type="button"
                  w="full"
                  variant={order.urgent ? "destructive" : "destructive"}
                  onClick={async () => update(() => updateOrder(order.id, { urgent: order.urgent }, { urgent: !order.urgent }))}>
                  {order.urgent ? "Unprioritize" : "Set Urgent"}
                </Button>
              </VStack>
              <styled.div
                css={{
                  "@media print": {
                    visibility: "hidden",
                  },
                }}
              >
                <OrderSideControl {...{ appSettings, order, users, orderChanges: order.changes, orderComments: order.comments }} />
              </styled.div>
            </styled.div>
          </styled.div>
        </styled.div>
      </styled.div>
    </styled.div>
  );
}
