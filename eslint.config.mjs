import js from "@eslint/js";
import { fixupConfigRules } from "@eslint/compat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  js.configs.recommended,
  ...fixupConfigRules(nextVitals),
  ...fixupConfigRules(nextTs),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    settings: {
      react: {
        version: "19"
      }
    },
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "@next/next/no-img-element": "off",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/error-boundaries": "warn"
    }
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly"
      }
    }
  },
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}", "**/tests/**/*", "**/config/jest.setup.js", "**/config/jest.config.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
      "no-unassigned-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/display-name": "off",
      "prefer-rest-params": "off",
      "@typescript-eslint/ban-ts-comment": "off"
    },
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        afterAll: "readonly",
        afterEach: "readonly"
      }
    }
  },
  {
    files: ["scripts/**/*"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off"
    }
  },
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/out/**", "**/public/**", "**/coverage/**"]
  }
];

export default config;
