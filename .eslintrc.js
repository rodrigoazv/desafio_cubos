module.exports = {
    env: {
      browser: true,
      es2020: true,
      node: true,
      jest: true
    },
    extends: [
      'standard',
      'plugin:@typescript-eslint/recommended',
      'prettier/@typescript-eslint',
      'prettier/standard',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
      'prettier/prettier': 'error'
    },
    settings: {
      'import/resolver': {
        typescript: {}
      },
      react: {
        version: 'detect'
      }
    }
  }
  