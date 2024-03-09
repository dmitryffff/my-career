const { resolve } = require("node:path");
const vercelPrettierSettings = require("@vercel/style-guide/prettier")

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

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    require.resolve("@vercel/style-guide/eslint/typescript"),
    require.resolve("@vercel/style-guide/eslint/browser"),
    require.resolve("@vercel/style-guide/eslint/react"),
    require.resolve("@vercel/style-guide/eslint/jest"),
    require.resolve("@vercel/style-guide/eslint/jest-react"),
    "eslint-config-turbo",
    "plugin:prettier/recommended",
  ],
  plugins: ["only-warn", "prettier"],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    // Force ESLint to detect .tsx files
    { files: ["*.js?(x)", "*.ts?(x)"] },
  ],
  rules: {
    "react/function-component-definition": ["warn", { 
      "namedComponents": "arrow-function",
      "unnamedComponents": "arrow-function",
     }],
     "prettier/prettier": ["warn", vercelPrettierSettings]
  }
};
