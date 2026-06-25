// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
  {
    rules: {
      'import/order': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // React-Compiler-oriented rules (eslint-plugin-react-hooks v6). We don't use
      // the compiler; these misfire on Reanimated shared-value writes, external-store
      // refs, and async data-loading effects (all correct here). Keep rules-of-hooks
      // and exhaustive-deps; disable the experimental purity-model rules.
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      // The `const X = {...} as const; type X = ...` string-enum idiom (src/domain/enums.ts)
      // intentionally shares a name between value and type.
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      // i18next's default export legitimately exposes use()/t()/changeLanguage().
      'import/no-named-as-default-member': 'off',
    },
  },
];
