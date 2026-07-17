// eslint-plugin-local-rules descobre este arquivo pelo nome exato na raiz —
// implementação de cada regra fica em eslint-local-rules/ (mantém este
// arquivo, e cada peça, sob o limite de 100 linhas que a própria regra
// max-lines impõe ao resto do repo).
module.exports = {
  'one-function-per-file': require('./eslint-local-rules/one-function-per-file'),
  'no-mixed-exports': require('./eslint-local-rules/no-mixed-exports'),
}
