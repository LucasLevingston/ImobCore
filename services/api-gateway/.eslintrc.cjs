module.exports = {
  root: true,
  extends: ['../../.eslintrc.base.json'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
  },
  ignorePatterns: ['.eslintrc.cjs'],
}
