import { sva } from "@atdb/design-system";

export const scrollArea = sva({
  slots: ["root", "viewport", "corner", "scrollbar", "thumb"],
  base: {
    root: {
      position: "relative",
    },
    viewport: {
      h: "full",
      w: "full",
      rounded: "inherit",
    },
    scrollbar: {
      display: "flex",
      touchAction: "none",
      userSelect: "none",
      transition: "colors",

      "&[data-orientation=vertical]": {
        h: "full",
        w: "2.5",
        borderLeft: "base",
        borderLeftColor: "transparent",
        p: "1px",
      },

      "&[data-orientation=horizontal]": {
        h: "2.5",
        w: "full",
        borderTop: "base",
        borderTopColor: "transparent",
        p: "1px",
      },
    },
    thumb: {
      position: "relative",
      flex: "1",
      rounded: "full",
      bg: "border",
    },
  },
});
