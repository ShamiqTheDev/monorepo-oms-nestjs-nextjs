import { sva } from "@atdb/design-system";

export const navigationMenu = sva({
  slots: ["root", "list", "item", "trigger", "content", "link", "viewportWrapper", "viewport", "indicator"],
  base: {
    root: {
      position: "relative",
      zIndex: "10",
      display: "flex",
      flex: "1",
      alignItems: "center",
      justifyContent: "center",
    },

    list: {
      display: "flex",
      flexDirection: "column",
      flex: "1",
      listStyleType: "none",
      alignItems: "center",
      justifyContent: "center",
      gap: "1",
    },

    item: {
      "& > [data-radix-collection-item]": {
        display: "inline-flex",
        h: "5xl",
        w: "14rem",
        alignItems: "center",
        justifyContent: "start",
        rounded: "md",
        px: "lg",
        py: "md",
        textStyle: "sm",
        fontWeight: 600,
        transition: "colors",
        cursor: "pointer",
        color: "gray.900",

        _hover: {
          bg: "gray.200",
          color: "primary.700",
        },

        _focus: {
          color: "gray.700",
          outline: "none",
        },

        _disabled: {
          pointerEvents: "none",
          opacity: "gray.700/50",
        },

        "&[data-active]": {
          bga: "accent/50",
        },

        "&[data-state=open]": {
          bga: "accent/50",
        },
      },
    },

    trigger: {
      "& > svg": {
        position: "relative",
        top: "1px",
        ml: "1",
        h: "3",
        w: "3",
        transition: "all",
        transitionDuration: "normal",
        marginLeft: "auto",
      },

      "&[data-state=open]": {
        _hover: {
          "& > svg": {
            transform: "rotate(180deg)",
          },
        },
      },
    },

    content: {
      w: "full",

      "&[data-motion^=from-]": {
        animateIn: true,
        fadeIn: "0",
      },

      "&[data-motion^=to-]": {
        animateOut: true,
        fadeOut: "0",
      },

      "&[data-motion=from-end]": {
        slideInFromRight: "52",
      },

      "&[data-motion=from-start]": {
        slideInFromLeft: "52",
      },

      "&[data-motion=to-end]": {
        slideOutToRight: "52",
      },

      "&[data-motion=to-start]": {
        slideOutToLeft: "52",
      },

      md: {
        w: "auto",
      },
    },

    viewportWrapper: {
      position: "absolute",
      left: "0",
      top: "100%",
      display: "flex",
      justifyContent: "center",
    },

    viewport: {
      transformOrigin: "top center",
      position: "relative",
      mt: "1.5",
      h: "var(--radix-navigation-menu-viewport-height)",
      w: "full",
      overflow: "hidden",
      rounded: "md",
      border: "base",
      bg: "popover",
      color: "popover.foreground",
      shadow: "lg",

      "&[data-state=open]": {
        animateIn: true,
        zoomIn: 90,
      },

      "&[data-state=closed]": {
        animateOut: true,
        zoomOut: 95,
      },

      md: {
        w: "var(--radix-navigation-menu-viewport-width)",
      },
    },

    indicator: {
      top: "100%",
      zIndex: "1",
      display: "flex",
      h: "1.5",
      alignItems: "flex-end",
      justifyContent: "center",
      overflow: "hidden",

      "&[data-state=visible]": {
        animateIn: true,
        fadeIn: "0",
      },

      "&[data-state=hidden]": {
        animateOut: true,
        fadeOut: "0",
      },

      "& > div": {
        position: "relative",
        top: "60%",
        h: "2",
        w: "2",
        transform: "rotate(45deg)",
        roundedTopLeft: "sm",
        bg: "border",
        shadow: "md",
      },
    },
  },
});
