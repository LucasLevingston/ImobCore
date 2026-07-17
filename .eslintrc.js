// Cobre só scripts CommonJS soltos na raiz (eslint-local-rules.js, .lintstagedrc.js)
// — fora de qualquer workspace, logo fora de qualquer tsconfig project. Cada
// workspace tem root:true no seu próprio .eslintrc, então nunca herda deste.
module.exports = {
  root: true,
  env: { node: true, es2022: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'script' },
  extends: ['eslint:recommended'],
}
