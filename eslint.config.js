/**
 * @file        eslint.config.js
 * @description ESLint Flat Config fuer TypeScript und React
 * @version     0.1.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-06 19:14:38 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const tsConfigs = tsPlugin.configs;
const tsRecommendedRules = tsConfigs.recommended?.rules ?? {};
const tsTypeCheckingRules = tsConfigs['recommended-requiring-type-checking']?.rules ?? {};
const tsEslintRecommendedOverrides = tsConfigs['eslint-recommended']?.overrides ?? [];

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'logs/**', '.pnpm-store/**', 'src/config/generated/**']
  },
  {
    languageOptions: {
      globals: {
        React: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        URL: 'readonly'
      }
    }
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.server.json'],
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsRecommendedRules,
      ...tsTypeCheckingRules,
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  ...tsEslintRecommendedOverrides.map((override) => ({
    files: override.files,
    rules: override.rules
  })),
  prettierConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
];
