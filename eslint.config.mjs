import { dirname } from "path";
import { fileURLToPath } from "url";

import pluginReact from "eslint-plugin-react";
import pluginA11y from "eslint-plugin-jsx-a11y";
import pluginImport from "eslint-plugin-import";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ),
  {
    plugins: {
      react: pluginReact,
      "jsx-a11y": pluginA11y,
      import: pluginImport,
      "@typescript-eslint": pluginTypeScript
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always"
        }
      ]
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  {
    ignores: [
      "node_modules",
      ".next",
      "out",
      "dist",
      "public",
      "pnpm-lock.yaml"
    ]
  }
];

export default eslintConfig;