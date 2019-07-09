module.exports = {
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended'],
  rules: {
    'prettier/prettier': ['error'],
    'no-console': 0,
    'comma-dangle': ['error', 'always-multiline'],
  },
  env: {
    browser: true,
    mocha: true,
  },
};
