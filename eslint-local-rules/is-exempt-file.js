const TEST_FILE_PATTERN = /\.test\.tsx?$/
// Next.js exige `middleware`+`config` no mesmo arquivo `middleware.ts` na raiz do
// app — não é escolha de design, é convenção de framework (o build só lê esse
// arquivo específico). Mesmo mecanismo de exceção que TEST_FILE_PATTERN.
const MIDDLEWARE_FILE_PATTERN = /(^|[\\/])middleware\.ts$/

function isExemptFile(filename) {
  return TEST_FILE_PATTERN.test(filename) || MIDDLEWARE_FILE_PATTERN.test(filename)
}

module.exports = { isExemptFile }
