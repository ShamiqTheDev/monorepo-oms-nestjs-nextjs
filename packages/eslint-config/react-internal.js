const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: ["@vercel/style-guide/eslint/browser", "@vercel/style-guide/eslint/typescript", "@vercel/style-guide/eslint/react"].map(
    require.resolve
  ),
  parserOptions: {
    // project,
  },
  globals: {
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js"],

  rules: {
    "import/no-extraneous-dependencies": "off",
    "react/function-component-definition": "off",
    "@typescript-eslint/naming-convention": "off",
    // add specific rules configurations here
  },
};
