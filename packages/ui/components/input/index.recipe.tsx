import { sva } from "@atdb/design-system";

const checkbox = sva({
  slots: ["root", "control", "icon"],

  base: {
    root: {
      display: "flex",
      alignItems: "center",
      gap: "md",
      height: "5xl",
      borderRadius: "8px",
      bg: "gray.100",
      border: "1px solid token(colors.gray.300)",
      px: "0.875rem",
      py: "0.625rem",
      width: "11xl",
    },

    control: {
      border: "none",
      bg: "inherit",
      outline: "none",
      color: "gray.900",
      width: "100%",
      _placeholder: { color: "gray.500" },
    },

    icon: { color: "text.subtle" },
  },

  // variants: {
  //   size: {},
  // },

  // defaultVariants: {
  //   size: 'sm',
  // },
});

export default checkbox;
