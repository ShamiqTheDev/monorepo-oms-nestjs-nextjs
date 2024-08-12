import { cva } from "@atdb/design-system";

export const label = cva({
  base: {
    textStyle: "sm",
    leading: "none",
    fontWeight: "medium",

    _peerDisabled: {
      cursor: "not-allowed",
      opacity: "0.7",
    },
  },
});
