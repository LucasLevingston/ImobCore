module.exports = {
  root: true,
  extends: [
    '../../.eslintrc.base.json',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: { jsx: true },
  },
  settings: {
    react: { version: '19.2' },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  ignorePatterns: [
    '.eslintrc.js',
    '.next',
    'next.config.js',
    'postcss.config.js',
    'tailwind.config.ts',
    'src/generated',
  ],
}
