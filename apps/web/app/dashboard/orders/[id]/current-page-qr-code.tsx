"use client";

import { config } from "@atdb/client-config";
import { css } from "@atdb/design-system";
import QRCode from "react-qr-code";

export default function CurrentPageQRCode({ orderId }: { orderId: number }) {
  return <QRCode className={css({ hideBelow: "md" })} value={config.NEXT_PUBLIC_HOSTNAME.concat(`/peek/${orderId}`)} />;
}
