import { textStyles } from "./textStyles";
import { semanticTokens } from "./semanticTokens";
import { tokens } from "./tokens";
import { defineTheme } from "../types";
import { icon } from "./recipes";

export const atlasTheme = defineTheme({
  extend: {
    tokens,
    semanticTokens,
    textStyles,
    recipes: { icon },
  },
});
