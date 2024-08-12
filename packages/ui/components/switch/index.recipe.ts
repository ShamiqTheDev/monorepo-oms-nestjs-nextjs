import { sva } from "@atdb/design-system";

export const switchRecipe = sva({
  slots: ["root", "thumb"],
  base: {
    root: {
      display: "inline-flex",
      h: "3xl",
      w: "2.75rem",
      flexShrink: 0,
      cursor: "pointer",
      alignItems: "center",
      rounded: "full",
      border: "2px solid transparent",
      transition: "colors",

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

      "&[data-state=checked]": {
        bg: "primary",
      },

      "&[data-state=unchecked]": {
        bg: "input",
      },
    },
    thumb: {
      pointerEvents: "none",
      display: "block",
      h: "5",
      w: "5",
      rounded: "full",
      bg: "background",
      shadow: "lg",
      focusRingWidth: "0",
      transition: "transform",
      translateY: "0",

      "&[data-state=checked]": {
        translateX: "5",
      },

      "&[data-state=unchecked]": {
        translateX: "0",
      },
    },
  },
});
