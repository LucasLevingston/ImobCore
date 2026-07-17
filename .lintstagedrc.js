// .js (não bloco "lint-staged" no package.json) porque eslint precisa rodar
// como comando por-arquivo — cada workspace tem seu próprio .eslintrc.json
// (React/JSX pros apps, Node puro pros services), e o ESLint 8 resolve isso
// sozinho via cascata de config quando aponta pro caminho completo do
// arquivo, não precisa de lógica extra aqui.
module.exports = {
  '*.{ts,tsx,js,jsx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md}': ['prettier --write'],
}
