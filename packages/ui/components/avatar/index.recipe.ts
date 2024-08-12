import { sva } from "@atdb/design-system";

export const avatar = sva({
  slots: ["root", "image", "fallback"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      h: "10",
      w: "10",
      flexShrink: "0",
      overflow: "hidden",
      rounded: "full",
    },

    image: {
      aspectRatio: "square",
      h: "full",
      w: "full",
    },

    fallback: {
      display: "flex",
      h: "full",
      w: "full",
      alignItems: "center",
      justifyContent: "center",
      rounded: "full",
      bg: "gray.100",
      color: "gray.900",
    },
  },
});
