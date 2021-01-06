module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['e2e-tests'],
  extends: [
    'plugin:amsterdam/base',
    'plugin:amsterdam/import',
    'plugin:amsterdam/react',
    'plugin:amsterdam/redux-saga',
    'plugin:amsterdam/testing-library-react',
    'plugin:amsterdam/jest',
    'plugin:amsterdam/typescript',
  ],
  globals: {
    L: true,
  },
  overrides: [
    {
      files: ['./eslint-plugin-amsterdam/**/*', 'jest.config.*', './internals/**/*', './server/**/*'],
      extends: ['plugin:amsterdam/node'],
      rules: {
        'node/shebang': 'off',
        'no-process-exit': 'off',
        'node/no-unpublished-require': 'off',
        'import/no-nodejs-modules': 'off',
        'node/no-unpublished-import': 'off',
        'node/no-unsupported-features/es-syntax': 'off',
        'node/no-extraneous-require': 'off',
        'node/no-extraneous-import': 'off',
        'node/file-extension-in-import': 'off',
        'promise/prefer-await-to-callbacks': 'off',
      },
    },
  ],
  rules: {
    'array-bracket-newline': 'off',
    'function-paren-newline': 'off',
    'import/namespace': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'lines-around-command': 'off',
    'lines-around-comment': 'off',
    'multiline-ternary': 'off',
    'no-empty-function': 'off',
    'no-extra-parens': 'off',
    'no-mixed-operators': 'off',
    'no-unused-vars': 'off',
    'prefer-const': 'off',
    'promise/prefer-await-to-then': 'off',
    'react/display-name': 'off',
    'react/forbid-component-props': 'off',
    'react/jsx-key': 'off',
    'react/jsx-no-bind': 'off',
    'react/no-did-mount-set-state': 'off',
    'react/no-unused-prop-types': 'off',
    'react/require-optimization': 'off',
    'react/static-property-placement': 'off',
    'redux-saga/no-unhandled-errors': 'off',
    'require-yield': 'off',
    'space-before-function-paren': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prefer-ternary': 'off',
    'wrap-regex': 'off',
    camelcase: 'off',
    'default-param-last': 'off',
    'func-names': 'off',
    'id-length': 'off',
    'import/dynamic-import-chunkname': 'off',
    'import/no-anonymous-default-export': 'off',
    'import/no-commonjs': 'off',
    'import/no-unassigned-import': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'import/order': 'off',
    'import/unambiguous': 'off',
    'init-declarations': 'off',
    'line-comment-position': 'off',
    'max-len': 'off',
    'new-cap': 'off',
    'no-implicit-coercion': 'off',
    'no-import-assign': 'off',
    'no-invalid-this': 'off',
    'no-magic-numbers': 'off',
    'no-negated-condition': 'off',
    'no-promise-executor-return': 'off',
    'no-use-before-define': 'off',
    'no-warning-comments': 'off',
    'prefer-named-capture-group': 'off',
    'prefer-regex-literals': 'off',
    'require-atomic-updates': 'off',
    'require-unicode-regexp': 'off',
    'sonarjs/no-collapsible-if': 'off',
    'sonarjs/no-duplicate-string': 'off',
    'sonarjs/no-identical-functions': 'off',
    'sonarjs/no-small-switch': 'off',
    'testing-library/await-fire-event': 'off',
    'testing-library/consistent-data-testid': 'off',
    'testing-library/no-render-in-setup': 'off',
    'testing-library/prefer-presence-queries': 'off',
    'testing-library/prefer-screen-queries': 'off',
    'unicorn/catch-error-name': 'off',
    'unicorn/no-abusive-eslint-disable': 'off',
    'unicorn/no-zero-fractions': 'off',
    'unicorn/prefer-add-event-listener': 'off',
    'unicorn/prefer-includes': 'off',
    'unicorn/prefer-text-content': 'off',
    'unicorn/prevent-abbreviations': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    'jest/consistent-test-it': 'off',
    'jest/expect-expect': 'off',
    'jest/lowercase-name': 'off',
    'jest/no-conditional-expect': 'off',
    'jest/no-deprecated-functions': 'off',
    'jest/no-done-callback': 'off',
    'jest/no-export': 'off',
    'jest/no-hooks': 'off',
    'jest/no-identical-title': 'off',
    'jest/no-standalone-expect': 'off',
    'jest/no-test-return-statement': 'off',
    'jest/prefer-called-with': 'off',
    'jest/prefer-expect-assertions': 'off',
    'jest/prefer-spy-on': 'off',
    'jest/prefer-strict-equal': 'off',
    'jest/prefer-to-be-null': 'off',
    'jest/prefer-to-be-undefined': 'off',
    'jest/prefer-to-contain': 'off',
    'jest/prefer-to-have-length': 'off',
    'jest/require-to-throw-message': 'off',
    'jest/valid-expect': 'off',
    'jest/valid-title': 'off',

    '@typescript-eslint/no-type-alias': ['error', { allowCallbacks: 'always', allowAliases: 'in-unions' }],
    '@typescript-eslint/no-empty-function': ['warn'],
  },
};
