// Único config ESLint do monorepo (root:true — nenhum workspace tem .eslintrc
// próprio). Biome cobre formatação + lint geral (correctness/a11y/react/style)
// via biome.json; ESLint sobrevive só pras 5 regras de arquitetura que o
// Biome não tem equivalente: max-lines, max-classes-per-file, import/no-cycle
// e as 2 regras custom (one-function-per-file, no-mixed-exports, definidas em
// eslint-local-rules.js). Sem parserOptions.project — nenhuma dessas regras
// precisa de type-checking, então não há resolução de tsconfig por workspace
// pra se preocupar (isso também é o que torna 1 config só possível).
const TEST_FILE_PATTERN = ['**/*.test.ts', '**/*.test.tsx']

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['import', 'local-rules'],
  rules: {
    'max-lines': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
    'max-classes-per-file': ['error', 1],
    'import/no-cycle': ['error', { maxDepth: 10, ignoreExternal: true }],
    'local-rules/one-function-per-file': 'error',
    'local-rules/no-mixed-exports': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: ['apps/*/tsconfig.json', 'services/*/tsconfig.json', 'packages/*/tsconfig.json'],
        noWarnOnMultipleProjects: true,
      },
    },
  },
  overrides: [
    {
      files: TEST_FILE_PATTERN,
      rules: { 'max-lines': 'off' },
    },
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    'build',
    '.next',
    'coverage',
    '.turbo',
    '**/generated/**',
    '**/prisma/migrations/**',
    'next-env.d.ts',
    '*.config.js',
  ],
}
