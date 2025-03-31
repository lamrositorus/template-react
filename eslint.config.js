import js from '@eslint/js';
import airbnbBase from 'eslint-config-airbnb-base';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Konfigurasi dasar untuk semua file
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        URLSearchParams: 'readonly',
        setTimeout: 'readonly',
        location: 'readonly',
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { vars: 'all', args: 'none' }],
      'no-console': 'off',
    },
  },

  // Konfigurasi untuk backend (Express/Node)
  {
    files: ['routes/**/*.js', 'utils/**/*.js'],
    rules: {
      ...airbnbBase.rules,
      'no-await-in-loop': ['warn'],
      'consistent-return': ['error'],
    },
  },

  // Konfigurasi untuk frontend (React)
  {
    files: ['src/**/*.js', 'src/**/*.jsx'],
    plugins: {
      react: reactPlugin,
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.js'] }],
      'react/react-in-jsx-scope': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/prefer-default-export': 'off',
      'no-case-declarations': 'off',
    },
  },

  // Prettier untuk formatting
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': ['error'],
    },
  },
];
