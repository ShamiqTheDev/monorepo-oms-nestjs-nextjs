import { cva } from "@atdb/design-system";

export const tableContainer = cva({
  base: {
    w: "100%",
    overflow: "auto",
  },
});

export const table = cva({
  base: {
    w: "full",
    captionSide: "bottom",
    textStyle: "sm",
    width: "100%",
    overflow: "auto",
  },
});

export const tableHeader = cva({
  base: {
    "& tr": {
      borderBottom: "base",
      borderColor: "gray.300",
    },
  },
});

export const tableBody = cva({
  base: {
    "& tr": {
      _last: {
        borderBottom: "transparent",
      },
    },
  },
});

export const tableFooter = cva({
  base: {
    bg: "primary",
    fontWeight: "medium",
    color: "primary.foreground",
  },
});

export const tableRow = cva({
  base: {
    borderBottom: "base",
    borderColor: "gray.300",
    transition: "colors",

    _hover: {
      bga: "gray.50/50",
    },

    "&[data-state=selected]": {
      bga: "gray.50/100",
    },

    "&[data-state=selected]:hover": {
      bga: "gray.50/100",
    },
  },
});

export const tableHead = cva({
  base: {
    h: "4rem",
    px: "2xl",
    textAlign: "left",
    verticalAlign: "middle",
    fontWeight: "medium",
    color: "gray.700",
    bg: "gray.100",

    "&:has([role=checkbox])": {
      pr: "0",
    },
  },
});

export const tableCell = cva({
  base: {
    p: "2xl",
    verticalAlign: "middle",

    "&:has([role=checkbox])": {
      pr: "0",
    },
  },
});

export const tableCaption = cva({
  base: {
    mt: "4",
    textStyle: "sm",
    color: "muted.foreground",
  },
});
