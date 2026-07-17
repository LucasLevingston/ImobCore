// Biome (biome.json, raiz) cobre formatação + lint geral + organize-imports
// pra tudo. ESLint (.eslintrc.js, raiz) roda por cima só pras 5 regras de
// arquitetura que o Biome não tem (max-lines, max-classes-per-file,
// import/no-cycle, one-function-per-file, no-mixed-exports) — daí rodar como
// comando por-arquivo (--fix), não precisa de config por workspace.
module.exports = {
  '*.{ts,tsx,js,jsx}': ['biome check --write --no-errors-on-unmatched', 'eslint --fix'],
  '*.{json,md}': ['biome format --write --no-errors-on-unmatched'],
}
