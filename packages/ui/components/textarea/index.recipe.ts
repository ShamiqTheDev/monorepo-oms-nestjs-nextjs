import { cva } from "@atdb/design-system";

export const textarea = cva({
  base: {
    display: "flex",
    minH: "80px",
    w: "full",
    rounded: "md",
    border: "input",
    bg: "transparent",
    px: "3",
    py: "2",
    textStyle: "sm",
    focusRingOffsetColor: "background",

    _placeholder: {
      color: "muted.foreground",
    },

    _focusVisible: {
      outline: "2px solid transparent",
      outlineOffset: "2px",
      focusRingWidth: "2",
      focusRingColor: "ring",
      focusRingOffsetWidth: "2",
    },

    _disabled: {
      cursor: "not-allowed",
      opacity: "0.5",
    },
  },
});
