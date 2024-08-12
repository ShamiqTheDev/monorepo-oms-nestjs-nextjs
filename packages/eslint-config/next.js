const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "next",
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
    "@vercel/style-guide/eslint/next",
  ].map(require.resolve),
  parserOptions: {
    // project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    next: {
      rootDir: ["apps/*/", "packages/*/"],
    },
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "import/no-default-export": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    // "import/no-relative-packages": "off",
    "import/no-extraneous-dependencies": 0,
    "no-console": "off",
  },
};
