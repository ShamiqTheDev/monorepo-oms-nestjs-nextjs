import { cva } from "@atdb/design-system";

export const skeleton = cva({
  base: {
    animation: "pulse",
    rounded: "md",
    bg: "gray.100",
  },
});
