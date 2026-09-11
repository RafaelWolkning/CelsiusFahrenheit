// eslint.config.mjs
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  {
    files: ['src/**/*.js', '__tests__/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        test: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'error',
      'no-redeclare': 'off',
      'no-debugger': 'warn',
    },
  },
  // Frontend Vue (client/)
  ...pluginVue.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['client/**/*.{js,vue}'],
  })),
  {
    files: ['client/**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-debugger': 'warn',
    },
  },
];
