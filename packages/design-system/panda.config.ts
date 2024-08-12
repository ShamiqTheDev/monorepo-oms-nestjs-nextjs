import radixColorsPreset from "pandacss-preset-radix-colors";
import { defineConfig } from "@pandacss/dev";
import { atlasPreset } from "./src/preset";
import path from "path";

const withinWorkspace = (...paths: string[]) => path.join(__dirname, "..", "..", ...paths);

export default defineConfig({
  presets: ["@pandacss/dev/presets", "@shadow-panda/preset", atlasPreset, radixColorsPreset()],
  staticCss: {
    css: [
      {
        properties: {
          color: [
            "instructive",
            "constructive",
            "imperative",
            "destructive",
            "instructive.100",
            "instructive.200",
            "instructive.300",
            "instructive.50",
          ],
          backgroundColor: [
            "gray",
            "instructive",
            "constructive",
            "imperative",
            "destructive",
            "instructive.100",
            "instructive.200",
            "instructive.300",
            "instruction.400",
            "instructive.50",
            "gray.9", "gray.10",
            "mauve.9", "mauve.10",
            "slate.9", "slate.10",
            "sage.9", "sage.10",
            "olive.9", "olive.10",
            "sand.9", "sand.10",
            "tomato.9", "tomato.10",
            "red.9", "red.10",
            "ruby.9", "ruby.10",
            "crimson.9", "crimson.10",
            "pink.9", "pink.10",
            "plum.9", "plum.10",
            "purple.9", "purple.10",
            "violet.9", "violet.10",
            "iris.9", "iris.10",
            "indigo.9", "indigo.10",
            "blue.9", "blue.10",
            "cyan.9", "cyan.10",
            "teal.9", "teal.10",
            "jade.9", "jade.10",
            "green.9", "green.10",
            "grass.9", "grass.10",
            "bronze.9", "bronze.10",
            "gold.9", "gold.10",
            "brown.9", "brown.10",
            "orange.9", "orange.10",
            "amber.9", "amber.10",
            "yellow.9", "yellow.10",
            "lime.9", "lime.10",
            "mint.9", "mint.10",
            "sky.9", "sky.10"
          ],
          cursor: ["pointer", "default"],
        },
      },
    ],
    recipes: {
      toast: [{ variant: ["*"] }],
    },
  },
  preflight: true,
  include: [
    withinWorkspace("apps", "web", "app", "**", "*"),
    withinWorkspace("packages", "ui", "components", "**", "*"),
    withinWorkspace("packages", "client", "providers", "lib", "**", "*"),
  ],
  exclude: [],
  jsxFramework: "react",
  cwd: __dirname,
  outdir: "@atdb/styled-system",
  emitPackage: true,
  theme: {
    extend: {
      // Override `semanticTokens`
      semanticTokens: {
        // Example: Set primary color to another value
        colors: {
          primary: {
            DEFAULT: {
              value: {
                base: "{colors.primary.500}",
                _dark: "{colors.primary.50}",
              },
            },
            foreground: {
              value: {
                base: "{colors.primary.50}",
                _dark: "{colors.primary.900}",
              },
            },
          },
          background: {
            value: {
              base: "{colors.gray.25}",
              _dark: "{colors.gray.900}",
            },
          },
          foreground: {
            value: {
              base: "{colors.gray.900}",
              _dark: "{colors.gray.50}",
            },
          },
          muted: {
            DEFAULT: {
              value: {
                base: "{colors.gray.100}",
                _dark: "{colors.gray.800}",
              },
            },
            foreground: {
              value: {
                base: "{colors.gray.500}",
                _dark: "{colors.gray.400}",
              },
            },
          },
          card: {
            DEFAULT: {
              value: {
                base: "{colors.gray.25}",
                _dark: "{colors.gray.900}",
              },
            },
            foreground: {
              value: {
                base: "{colors.gray.900}",
                _dark: "{colors.gray.50}",
              },
            },
          },
          popover: {
            DEFAULT: {
              value: {
                base: "{colors.gray.25}",
                _dark: "{colors.gray.900}",
              },
            },
            foreground: {
              value: {
                base: "{colors.gray.900}",
                _dark: "{colors.gray.50}",
              },
            },
          },
          border: {
            value: {
              base: "{colors.gray.200}",
              _dark: "{colors.gray.800}",
            },
          },
          input: {
            value: {
              base: "{colors.gray.200}",
              _dark: "{colors.gray.800}",
            },
          },
          secondary: {
            DEFAULT: {
              value: {
                base: "{colors.gray.100}",
                _dark: "{colors.gray.800}",
              },
            },
            foreground: {
              value: {
                base: "{colors.gray.900}",
                _dark: "{colors.gray.50}",
              },
            },
          },
          accent: {
            DEFAULT: {
              value: {
                base: "{colors.gray.100}",
                _dark: "{colors.gray.800}",
              },
            },
            foreground: {
              value: {
                base: "{colors.gray.900}",
                _dark: "{colors.gray.50}",
              },
            },
          },
          destructive: {
            DEFAULT: {
              value: {
                base: "{colors.negative.300}",
                _dark: "{colors.negative.500}",
              },
            },
            foreground: {
              value: {
                base: "{colors.gray.50}",
                _dark: "{colors.negative.50}",
              },
            },
          },
          instructive: {
            DEFAULT: {
              value: {
                base: "{colors.instructive.300}",
                _dark: "{colors.instructive.500}",
              },
            },
            foreground: {
              value: {
                base: "{colors.gray.50}",
                _dark: "{colors.instructive.50}",
              },
            },
          },
          imperative: {
            DEFAULT: {
              value: {
                base: "{colors.imperative.300}",
                _dark: "{colors.imperative.500}",
              },
            },
            foreground: {
              value: {
                base: "{colors.gray.50}",
                _dark: "{colors.imperative.50}",
              },
            },
          },
          constructive: {
            DEFAULT: {
              value: {
                base: "{colors.positive.300}",
                _dark: "{colors.positive.500}",
              },
            },
            foreground: {
              value: {
                base: "{colors.gray.50}",
                _dark: "{colors.positive.50}",
              },
            },
          },
          ring: {
            value: {
              base: "{colors.grayscale.400}",
              _dark: "{colors.grayscale.300}",
            },
          },
        },
        borders: {
          base: { value: "1px solid {colors.border}" },
          input: { value: "1px solid {colors.input}" },
          primary: { value: "1px solid {colors.primary}" },
          destructive: { value: "1px solid {colors.destructive}" },
        },
        radii: {
          xl: { value: `calc({radii.radius} + 4px)` },
          lg: { value: `{radii.radius}` },
          md: { value: `calc({radii.radius} - 2px)` },
          sm: { value: "calc({radii.radius} - 4px)" },
        },
        animations: {
          "accordion-down": { value: "accordion-down 0.2s ease-out" },
          "accordion-up": { value: "accordion-up 0.2s ease-out" },
        },
      },
    },
  },
});
