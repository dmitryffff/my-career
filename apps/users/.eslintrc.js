/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/backend.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: true,
  },
  rules: {
    "@typescript-eslint/no-unsafe-assignment": ['off'],
    "@typescript-eslint/no-unsafe-call": ['off'],
    "@typescript-eslint/no-unsafe-member-access": ['off'],
    "@typescript-eslint/no-unsafe-return": ['off'],
  }
};
