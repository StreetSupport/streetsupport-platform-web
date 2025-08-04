# Configuration Files Overview

This document provides an overview of the configuration files used in this project.

## Root Directory

- **babel.config.json**: Babel configuration for transpiling JavaScript/TypeScript code
- **eslint.config.mjs**: ESLint configuration using the new flat config format
- **next.config.ts**: Next.js configuration file
- **postcss.config.cjs**: PostCSS configuration for CSS processing
- **tailwind.config.js**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration
- **eslintignore**: Files to be ignored by ESLint

## Config Directory
- **config/jest.config.cjs**: Jest configuration for unit testing
- **config/jest.setup.js**: Jest setup file with test environment configuration
- **config/playwright.config.ts**: Playwright configuration for end-to-end testing

## Configuration References

- The `package.json` scripts reference the configuration files in the `config` directory
- The `tsconfig.json` includes references to test files and configuration files

## Notes

- All test-related configurations are in the `config` directory
- Build and styling configurations are in the root directory
- ESLint configuration uses the modern flat config format in the root directory