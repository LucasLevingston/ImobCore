const { isExemptFile } = require('./is-exempt-file')
const { isExportedFunction } = require('./ast-helpers')

module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Cada arquivo deve exportar no máximo uma função (SRP)' },
    schema: [],
  },
  create(context) {
    if (isExemptFile(context.getFilename())) return {}

    const exportedFunctionNodes = []

    return {
      'Program:exit'(program) {
        for (const stmt of program.body) {
          if (stmt.type === 'ExportNamedDeclaration' && stmt.declaration) {
            if (isExportedFunction(stmt.declaration)) {
              exportedFunctionNodes.push(stmt.declaration)
            }
          }
          if (stmt.type === 'ExportDefaultDeclaration') {
            if (
              stmt.declaration.type === 'FunctionDeclaration' ||
              stmt.declaration.type === 'ArrowFunctionExpression' ||
              stmt.declaration.type === 'FunctionExpression'
            ) {
              exportedFunctionNodes.push(stmt.declaration)
            }
          }
        }

        if (exportedFunctionNodes.length > 1) {
          for (const node of exportedFunctionNodes.slice(1)) {
            context.report({
              node,
              message:
                'Este arquivo já exporta outra função — cada arquivo deve exportar no máximo uma (SRP). Extraia pra um arquivo próprio.',
            })
          }
        }
      },
    }
  },
}
