import { defineUtilities } from "./types";

export const atlasUtilities = defineUtilities({
  extend: {
    centered: {
      className: "centered",
      values: { type: "boolean" },
      transform(value: boolean) {
        if (!value) return {};
        return {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        };
      },
    },
  },
});
