import { cva } from "@atdb/design-system";

export const button = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    rounded: "md",
    textStyle: "sm",
    fontWeight: "medium",
    transition: "colors",
    cursor: "pointer",
    focusRingOffsetColor: "background",
    gap: "2",

    _focusVisible: {
      outline: "2px solid transparent",
      outlineOffset: "2px",
      focusRingWidth: "2",
      focusRingColor: "ring",
      focusRingOffsetWidth: "2",
    },

    _disabled: {
      pointerEvents: "none",
      opacity: "50%",
    },
  },

  variants: {
    variant: {
      /**
              bg={"primary.500"}
          _hover={{ bg: "primary.600" }}
          border={"solid 1px token(colors.primary.600)"}
          boxShadow={"0px 0px 2px -1px #0E1B2F, 0px 1px 1px 0px rgba(23, 68, 110, 0.15);"}
 */
      default: {
        bg: "primary",
        border: "solid 1px token(colors.primary.600)",
        color: "primary.foreground",
        boxShadow: "0px 0px 2px -1px #0E1B2F, 0px 1px 1px 0px rgba(23, 68, 110, 0.15);",

        _hover: {
          bga: "primary/90",
        },
      },
      destructive: {
        bg: "destructive",
        color: "destructive.foreground",

        _hover: {
          bga: "destructive/90",
        },
      },
      outline: {
        border: "input",
        bg: "background",

        _hover: {
          bg: "accent",
          color: "accent.foreground",
        },
      },
      secondary: {
        bg: "secondary",
        color: "secondary.foreground",

        _hover: {
          bga: "secondary/90",
        },
      },
      ghost: {
        _hover: {
          bg: "gray.50",
          color: "gray.700",
        },
      },
      link: {
        color: "primary",
        textUnderlineOffset: "4px",

        _hover: {
          textDecoration: "underline",
        },
      },
    },

    size: {
      default: {
        h: "10",
        px: "4",
        py: "2",
      },
      sm: {
        h: "9",
        rounded: "md",
        px: "3",
      },
      lg: {
        h: "11",
        rounded: "md",
        px: "8",
      },
      icon: {
        h: "10",
        w: "10",
      },
    },
  },

  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
