const { resolve } = require("node:path");
const prettierConfig = require("./prettier-config")

const project = resolve(process.cwd(), "tsconfig.json");

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
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    { files: ["*.js?(x)", "*.ts?(x)"] },
  ],
  rules: {
    "react/function-component-definition": ["warn", { 
      "namedComponents": "arrow-function",
      "unnamedComponents": "arrow-function",
     }],
     "prettier/prettier": ["warn", prettierConfig]
  }
};
