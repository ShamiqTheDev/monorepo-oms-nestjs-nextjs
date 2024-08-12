"use client";

import { css, cx, icon, styled } from "@atdb/design-system";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@atdb/ui";
import { MoreVertical, Trash } from "lucide-react";
import { deleteOrder, fetchOrderPdf } from "./action";
import { Order } from "../type";
import { useRouter } from "next/navigation";
import { useToast } from "@atdb/client-providers";
import Link from "next/link";

interface OrderControllerProps {
  order: Order;
}

async function savePdf(fileName: string, id: string) {
  const pdfBase64 = await fetchOrderPdf(id)
  const downloadLink = document.createElement("a");
  downloadLink.href = `data:application/pdf;base64,${pdfBase64}`;
  downloadLink.download = fileName;
  downloadLink.click();
}

const printPdf = async (id: string) => {
  const pdfBase64 = await fetchOrderPdf(id)
  const buffer = Buffer.from(pdfBase64, "base64");
  const blob = new Blob([buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const pdfWindow = window.open(url, "_blank");

  setTimeout(
    () => {
      URL.revokeObjectURL(url);
      pdfWindow?.close();
    },
    30 * 60 * 1000
  );
};

export default function OrderController({ order }: OrderControllerProps) {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <styled.div>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" lineHeight={"0"}>
              <span className={css({ srOnly: true })}>Open menu</span>
              <MoreVertical className={cx(icon({ left: "auto", dimmed: true }), css({ w: "xl", h: "auto" }))} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => printPdf(order.id.toString())}>Print Label</DropdownMenuItem>
            <DropdownMenuItem onClick={() => savePdf(`dz_order_${order.id}.pdf`, order.id.toString())}>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id.toString())}>Copy order ID</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/orders/${order.id}/edit`}>Edit Order</Link>
            </DropdownMenuItem>
            <AlertDialogTrigger>
              <DropdownMenuItem className={css({ color: "negative.300" })}>
                <Trash
                  className={css({
                    mr: "1",
                    h: "0.875rem",
                    w: "0.875rem",
                    ca: "negative.300/70",
                  })}
                />
                Delete Order
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this order and remove its data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={"destructive"}
              onClick={async () => {
                const isConfirmed = await deleteOrder(order.id);
                if (isConfirmed) router.push("/");

                toast({
                  title: isConfirmed ? "Order Deleted" : "Failed to delete order",
                  description: isConfirmed ? "Order has been deleted successfully " : "Order deletion failed due to a system error",
                  variant: isConfirmed ? "constructive" : "destructive",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </styled.div>
  );
}
