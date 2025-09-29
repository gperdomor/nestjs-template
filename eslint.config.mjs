import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'prisma/**',
      'test/**',
      '*.js',
      '.eslintrc.js',
      'jest.config.js',
      '.idea',
      '.vscode',
      '.DS_Store',
      'package-lock.json',
      '**/*.spec.ts',
      'admin/dist/**',
      'admin/node_modules/**',
      'admin/*.config.ts',
      'admin/*.config.js',
    ],
  },
  // Backend TypeScript configuration
  {
    files: ['src/**/*.ts', '!admin/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: '.',
        sourceType: 'module',
      },
      ecmaVersion: 2020,
      globals: {
        node: true,
        jest: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...prettierPlugin.configs.recommended.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      'newline-before-return': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: true,
          },
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'max-len': ['error', { code: 120, ignoreStrings: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-duplicate-imports': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      curly: 'error',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'eol-last': ['error', 'always'],
    },
  },
  // Admin frontend TypeScript/React configuration
  {
    files: ['admin/src/**/*.ts', 'admin/src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'admin/tsconfig.json',
        tsconfigRootDir: '.',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      ecmaVersion: 2020,
      globals: {
        window: true,
        document: true,
        console: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...prettierPlugin.configs.recommended.rules,
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // More permissive for admin UI
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'max-len': ['error', { code: 120, ignoreStrings: true }],
      'no-console': 'off', // Allow console in frontend
      'no-duplicate-imports': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'prefer-const': 'error',
      'eol-last': ['error', 'always'],
    },
  },
  prettierConfig,
];
