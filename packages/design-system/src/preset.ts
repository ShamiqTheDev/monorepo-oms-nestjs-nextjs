import { defineGlobalStyles, definePreset } from "@pandacss/dev";
import { atlasTheme } from "./theme";
import { atlasUtilities } from "./utilities";

const globalCss = defineGlobalStyles({
  "html, body": {
    color: "gray.900",
    lineHeight: "1.5",
  },

  "h1, h2, h3, h4, p, th, td, span": {
    boxSizing: "border-box",
    color: "var(--colors-gray-900)",
  },
});

// ?? @GhaithAlHallak8
export const atlasPreset = definePreset({
  globalCss,
  theme: atlasTheme,
  utilities: atlasUtilities,
});
