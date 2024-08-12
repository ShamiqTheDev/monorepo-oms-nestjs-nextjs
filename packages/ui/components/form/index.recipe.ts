import { cva } from "@atdb/design-system";

export const formLabel = cva({
  base: {},
});

export const formItem = cva({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "2",
  },
});

export const formControl = cva({
  base: {},
});

export const formDescription = cva({
  base: {
    textStyle: "sm",
    color: "muted.foreground",
  },
});

export const formMessage = cva({
  base: {
    textStyle: "sm",
    fontWeight: "medium",
    color: "destructive",
  },
});
