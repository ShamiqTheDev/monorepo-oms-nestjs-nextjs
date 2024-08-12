import { sva } from "@atdb/design-system";

const popover = sva({
  slots: ["root", "trigger", "portal", "content", "anchor", "close"],
  base: {
    content: {
      zIndex: 50,
      rounded: "md",
      border: "base",
      bg: "popover",
      color: "popover.foreground",
      boxShadow: "md",
      outline: "none",

      "&[data-state=open]": {
        animateIn: true,
        fadeIn: "0",
        zoomIn: 95,
      },

      "&[data-state=closed]": {
        animateOut: true,
        fadeOut: "0",
        zoomOut: 95,
      },

      "&[data-side=top]": {
        slideInFromBottom: "2",
      },

      "&[data-side=bottom]": {
        slideInFromTop: "2",
      },

      "&[data-side=left]": {
        slideInFromRight: "2",
      },

      "&[data-side=right]": {
        slideInFromLeft: "2",
      },
    },
  },
});

export default popover;
