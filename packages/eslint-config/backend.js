const { resolve } = require("node:path");
const prettierConfig = require("./prettier-config")

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    require.resolve("@vercel/style-guide/eslint/typescript"),
    require.resolve("@vercel/style-guide/eslint/node"),
    require.resolve("@vercel/style-guide/eslint/jest"),
    "eslint-config-turbo",
    "plugin:prettier/recommended",
  ],
  env: {
    node: true,
  },
  plugins: ["only-warn", "prettier"],
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
  ],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
  rules: {
     "prettier/prettier": ["warn", prettierConfig],
     "jest/no-deprecated-functions": 'off'
  }
};
