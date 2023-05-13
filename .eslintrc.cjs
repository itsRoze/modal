/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["./packages/eslint-config"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  settings: {
    next: {
      rootDir: ["apps/web"],
    },
  },
  ignorePatterns: [
    "**/*.config.js",
    "**/*.config.cjs",
    "packages/eslint-config/**",
    "stacks/*",
  ],
};

module.exports = config;
