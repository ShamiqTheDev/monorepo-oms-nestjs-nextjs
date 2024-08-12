import { sva } from "@atdb/design-system";

export const checkbox = sva({
  slots: ["root", "indicator"],
  base: {
    root: {
      h: "4",
      w: "4",
      flexShrink: "0",
      rounded: "sm",
      border: "solid 1px token(colors.gray.300)",
      cursor: "pointer",
      focusRingOffsetColor: "gray.300",

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

      '&[data-state="checked"]': {
        bg: "primary.500",
        color: "primary.25",
        border: "none",
      },
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "currentColor",
    },
  },
});
