import { cva } from "@atdb/design-system";

export const card = cva({
  base: {
    rounded: "lg",
    border: "base",
    bg: "card",
    color: "card.foreground",
    shadow: "sm",
  },
});

export const cardHeader = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    spaceY: "1.5",
    p: "6",
  },
});

export const cardTitle = cva({
  base: {
    textStyle: "2xl",
    fontWeight: "semibold",
    leading: "none",
    tracking: "tight",
  },
});

export const cardDescription = cva({
  base: {
    textStyle: "sm",
    color: "muted.foreground",
  },
});

export const cardContent = cva({
  base: {
    p: "6",
    pt: "0",
  },
});

export const cardFooter = cva({
  base: {
    display: "flex",
    alignItems: "center",
    p: "6",
    pt: "0",
  },
});
