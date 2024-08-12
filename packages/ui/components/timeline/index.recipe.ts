import { sva } from "@atdb/design-system";

export const cardsList = sva({
  slots: ["root", "item", "item_icon", "item_body", "item_body_time", "item_body_content"],
  base: {
    root: {
      maxHeight: "25rem",
      overflowY: "auto",
      w: "full",
      pos: "absolute",
      borderColor: "gray.200",
      listStyleType: "none",
      borderInlineStartWidth: "1px",
      _dark: { borderColor: "gray.700" },
    },

    item: { mb: "10", marginInlineStart: "lg", marginTop: "0.5em" },

    item_icon: {
      pos: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      w: "6",
      h: "6",
      bgColor: "blue.100",
      rounded: "full",
      insetInlineStart: "-xl",
      shadow: "8",
      _dark: { bgColor: "blue.900" },

      "&>svg,&>img,&>span": {
        rounded: "full",
        shadow: "lg",
      },
    },

    item_body: {
      flexDir: "column",
      justifyContent: "space-between",
      p: "4",
      bgColor: "white",
      borderWidth: "1px",
      borderColor: "gray.200",
      rounded: "lg",
      shadow: "sm",
      sm: { display: "flex" },
      _dark: { bgColor: "gray.700", borderColor: "gray.600" },
    },

    item_body_time: {
      alignSelf: "start",
      mb: "1",
      fontSize: "xs",
      lineHeight: "xs",
      fontWeight: "normal",
      color: "gray.400",
      sm: { order: "9999", mb: "0" },
    },

    item_body_content: {
      fontSize: "sm",
      lineHeight: "sm",
      fontWeight: "normal",
      color: "gray.500",
      _dark: { color: "gray.300" },
    },
  },
});
